const requests = new Map<string, number[]>();
const dailyCounts = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_MINUTE = 30;
const MAX_REQUESTS_PER_DAY = 500;

export function isRateLimited(ip: string): boolean {
	const now = Date.now();

	// Per-minute check
	const timestamps = requests.get(ip) ?? [];
	const recent = timestamps.filter((t) => now - t < WINDOW_MS);
	recent.push(now);
	requests.set(ip, recent);

	if (recent.length > MAX_REQUESTS_PER_MINUTE) return true;

	// Daily cap
	const daily = dailyCounts.get(ip);
	if (daily && now < daily.resetAt) {
		daily.count++;
		if (daily.count > MAX_REQUESTS_PER_DAY) return true;
	} else {
		dailyCounts.set(ip, { count: 1, resetAt: now + 86_400_000 });
	}

	// Clean up old entries periodically
	if (requests.size > 10_000) {
		for (const [key, vals] of requests) {
			if (vals.every((t) => now - t >= WINDOW_MS)) {
				requests.delete(key);
			}
		}
	}
	if (dailyCounts.size > 10_000) {
		for (const [key, val] of dailyCounts) {
			if (now >= val.resetAt) dailyCounts.delete(key);
		}
	}

	return false;
}
