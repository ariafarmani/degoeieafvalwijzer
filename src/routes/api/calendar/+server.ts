import { json } from '@sveltejs/kit';
import { FIREBASE_API_KEY, PROVIDER_ID } from '$env/static/private';
import { validatePostcode, validateHousenumber, validateSuffix } from '$lib/server/validation';
import { isRateLimited } from '$lib/server/rate-limit';
import type { RequestHandler } from './$types';

const BASE_URL =
	'https://europe-west3-burgerportaal-production.cloudfunctions.net/exposed';

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
	if (cachedToken && Date.now() < cachedToken.expiresAt) {
		return cachedToken.token;
	}

	const res = await fetch(
		`https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_API_KEY}`,
		{
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ returnSecureToken: true })
		}
	);

	if (!res.ok) {
		throw new Error('Authenticatie mislukt');
	}

	const data = await res.json();
	cachedToken = {
		token: data.idToken,
		expiresAt: Date.now() + (parseInt(data.expiresIn) - 60) * 1000
	};

	return cachedToken.token;
}

function normalizeEntry(entry: Record<string, unknown>): {
	type: string;
	date: string;
} | null {
	const type = typeof entry.fraction === 'string' ? entry.fraction.toLowerCase() : '';
	const rawDate = typeof entry.collectionDate === 'string' ? entry.collectionDate : '';

	if (!type || !rawDate) return null;

	return {
		type,
		date: rawDate.split('T')[0]
	};
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
	const clientIp = getClientAddress();
	if (isRateLimited(clientIp)) {
		return json({ error: 'Te veel verzoeken, probeer het later opnieuw' }, { status: 429 });
	}

	const { postcode, housenumber, suffix } = await request.json();

	if (!postcode || !housenumber) {
		return json({ error: 'Postcode en huisnummer zijn verplicht' }, { status: 400 });
	}

	const zipcode = validatePostcode(String(postcode));
	if (!zipcode) {
		return json({ error: 'Ongeldige postcode (verwacht formaat: 1234AB)' }, { status: 400 });
	}

	const validHousenumber = validateHousenumber(String(housenumber));
	if (!validHousenumber) {
		return json({ error: 'Ongeldig huisnummer' }, { status: 400 });
	}

	const validSuffix = suffix ? validateSuffix(String(suffix)) : null;
	if (suffix && validSuffix === null) {
		return json({ error: 'Ongeldige toevoeging' }, { status: 400 });
	}

	try {
		const token = await getToken();

		const params = new URLSearchParams({
			zipcode,
			housenumber: validHousenumber
		});
		if (validSuffix) params.set('suffix', validSuffix);

		const addressRes = await fetch(
			`${BASE_URL}/organisations/${PROVIDER_ID}/address?${params}`,
			{ headers: { authorization: token } }
		);

		if (!addressRes.ok) {
			return json({ error: 'Adres niet gevonden' }, { status: 404 });
		}

		const addresses = await addressRes.json();
		if (!Array.isArray(addresses) || !addresses.length) {
			return json({ error: 'Adres niet gevonden' }, { status: 404 });
		}

		let address = addresses[0];
		if (suffix) {
			const match = addresses.find(
				(a: Record<string, unknown>) =>
					String(a.addition || '').toUpperCase() === suffix.toUpperCase()
			);
			if (match) address = match;
		}

		const calendarRes = await fetch(
			`${BASE_URL}/organisations/${PROVIDER_ID}/address/${address.addressId}/calendar`,
			{ headers: { authorization: token } }
		);

		if (calendarRes.status === 204) {
			return json({ calendar: [], address });
		}

		if (!calendarRes.ok) {
			return json({ error: 'Kalender ophalen mislukt' }, { status: 500 });
		}

		const rawCalendar = await calendarRes.json();
		const calendar = (Array.isArray(rawCalendar) ? rawCalendar : [])
			.map((e: Record<string, unknown>) => normalizeEntry(e))
			.filter((e): e is { type: string; date: string } => e !== null);

		return json({ calendar, address });
	} catch (e) {
		console.error('API error:', e instanceof Error ? e.message : 'Unknown error');
		if (cachedToken) cachedToken = null;
		return json(
			{ error: 'Er ging iets mis bij het ophalen van de data' },
			{ status: 500 }
		);
	}
};
