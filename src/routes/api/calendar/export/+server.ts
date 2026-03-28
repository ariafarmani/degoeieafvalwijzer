import { FIREBASE_API_KEY, PROVIDER_ID } from '$env/static/private';
import { validatePostcode, validateHousenumber, validateSuffix } from '$lib/server/validation';
import { isRateLimited } from '$lib/server/rate-limit';
import type { RequestHandler } from './$types';

const BASE_URL =
	'https://europe-west3-burgerportaal-production.cloudfunctions.net/exposed';

const WASTE_LABELS: Record<string, string> = {
	gft: 'GFT',
	papier: 'Papier',
	restafval: 'Restafval',
	grofafval: 'Grofafval',
	pmd: 'PMD',
	textiel: 'Textiel',
	kca: 'KCA',
	kerstboom: 'Kerstboom'
};

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

	if (!res.ok) throw new Error('Auth failed');

	const data = await res.json();
	cachedToken = {
		token: data.idToken,
		expiresAt: Date.now() + (parseInt(data.expiresIn) - 60) * 1000
	};
	return cachedToken.token;
}

function nextDay(dateStr: string): string {
	const d = new Date(dateStr + 'T00:00:00');
	d.setDate(d.getDate() + 1);
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export const GET: RequestHandler = async ({ url, getClientAddress }) => {
	const clientIp = getClientAddress();
	if (isRateLimited(clientIp)) {
		return new Response('Te veel verzoeken, probeer het later opnieuw', { status: 429 });
	}

	const postcodeParam = url.searchParams.get('postcode');
	const housenumberParam = url.searchParams.get('housenumber');
	const suffixParam = url.searchParams.get('suffix') || '';
	const typesParam = url.searchParams.get('types') || '';

	if (!postcodeParam || !housenumberParam) {
		return new Response('Postcode en huisnummer zijn verplicht', { status: 400 });
	}

	const zipcode = validatePostcode(postcodeParam);
	if (!zipcode) {
		return new Response('Ongeldige postcode (verwacht formaat: 1234AB)', { status: 400 });
	}

	const housenumber = validateHousenumber(housenumberParam);
	if (!housenumber) {
		return new Response('Ongeldig huisnummer', { status: 400 });
	}

	const validSuffix = suffixParam ? validateSuffix(suffixParam) : null;
	if (suffixParam && validSuffix === null) {
		return new Response('Ongeldige toevoeging', { status: 400 });
	}

	const allowedTypes = typesParam ? new Set(typesParam.split(',')) : null;

	try {
		const token = await getToken();

		const params = new URLSearchParams({ zipcode, housenumber });
		if (validSuffix) params.set('suffix', validSuffix);

		const addressRes = await fetch(
			`${BASE_URL}/organisations/${PROVIDER_ID}/address?${params}`,
			{ headers: { authorization: token } }
		);

		if (!addressRes.ok) return new Response('Adres niet gevonden', { status: 404 });

		const addresses = await addressRes.json();
		if (!Array.isArray(addresses) || !addresses.length) {
			return new Response('Adres niet gevonden', { status: 404 });
		}

		let address = addresses[0];
		if (suffixParam) {
			const match = addresses.find(
				(a: Record<string, unknown>) =>
					String(a.addition || '').toUpperCase() === suffixParam.toUpperCase()
			);
			if (match) address = match;
		}

		const calendarRes = await fetch(
			`${BASE_URL}/organisations/${PROVIDER_ID}/address/${address.addressId}/calendar`,
			{ headers: { authorization: token } }
		);

		if (!calendarRes.ok && calendarRes.status !== 204) {
			return new Response('Kalender ophalen mislukt', { status: 500 });
		}

		const rawCalendar = calendarRes.status === 204 ? [] : await calendarRes.json();
		const entries = (Array.isArray(rawCalendar) ? rawCalendar : [])
			.map((e: Record<string, unknown>) => {
				const type = typeof e.fraction === 'string' ? e.fraction.toLowerCase() : '';
				const rawDate = typeof e.collectionDate === 'string' ? e.collectionDate : '';
				if (!type || !rawDate) return null;
				return { type, date: rawDate.split('T')[0] };
			})
			.filter((e): e is { type: string; date: string } => {
				if (!e) return false;
				if (allowedTypes && !allowedTypes.has(e.type)) return false;
				return true;
			});

		const lines = [
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//DeGoeieAfvalwijzer//NL',
			'CALSCALE:GREGORIAN',
			'METHOD:PUBLISH',
			'X-WR-CALNAME:Afvalkalender',
			`X-WR-CALDESC:Afvalkalender voor ${address.street || ''} ${address.housenumber || ''}, ${address.city || 'Groningen'}`
		];

		for (const entry of entries) {
			const label = WASTE_LABELS[entry.type] || entry.type;
			const dtStart = entry.date.replace(/-/g, '');
			const dtEnd = nextDay(entry.date).replace(/-/g, '');
			lines.push(
				'BEGIN:VEVENT',
				`DTSTART;VALUE=DATE:${dtStart}`,
				`DTEND;VALUE=DATE:${dtEnd}`,
				`SUMMARY:${label} ophalen`,
				`DESCRIPTION:${label} wordt vandaag opgehaald - ${address.street || ''} ${address.housenumber || ''}`,
				`UID:${entry.type}-${entry.date}@degoeieafvalwijzer`,
				'BEGIN:VALARM',
				'TRIGGER:-PT8H',
				'ACTION:DISPLAY',
				`DESCRIPTION:${label} wordt vandaag opgehaald`,
				'END:VALARM',
				'END:VEVENT'
			);
		}

		lines.push('END:VCALENDAR');
		const icsContent = lines.join('\r\n');

		return new Response(icsContent, {
			status: 200,
			headers: {
				'Content-Type': 'text/calendar; charset=utf-8',
				'Content-Disposition': 'attachment; filename="afvalkalender.ics"',
				'Cache-Control': 'no-cache'
			}
		});
	} catch (e) {
		console.error('Export error:', e instanceof Error ? e.message : 'Unknown error');
		if (cachedToken) cachedToken = null;
		return new Response('Er ging iets mis', { status: 500 });
	}
};
