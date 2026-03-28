const requests = new Map<string, number[]>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

export function isRateLimited(ip: string): boolean {
	const now = Date.now();
	const timestamps = requests.get(ip) ?? [];

	const recent = timestamps.filter((t) => now - t < WINDOW_MS);
	recent.push(now);
	requests.set(ip, recent);

	// Clean up old entries periodically
	if (requests.size > 10_000) {
		for (const [key, vals] of requests) {
			if (vals.every((t) => now - t >= WINDOW_MS)) {
				requests.delete(key);
			}
		}
	}

	return recent.length > MAX_REQUESTS;
}
