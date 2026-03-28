const POSTCODE_REGEX = /^\d{4}[A-Z]{2}$/;
const HOUSENUMBER_REGEX = /^\d{1,5}$/;
const SUFFIX_REGEX = /^[A-Za-z0-9]{0,4}$/;

export function validatePostcode(raw: string): string | null {
	const cleaned = raw.toUpperCase().replace(/\s/g, '');
	return POSTCODE_REGEX.test(cleaned) ? cleaned : null;
}

export function validateHousenumber(raw: string): string | null {
	const cleaned = raw.trim();
	return HOUSENUMBER_REGEX.test(cleaned) ? cleaned : null;
}

export function validateSuffix(raw: string): string | null {
	const cleaned = raw.trim();
	return SUFFIX_REGEX.test(cleaned) ? cleaned.toUpperCase() : null;
}
