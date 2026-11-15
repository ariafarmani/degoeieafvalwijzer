import { SITE } from '$lib/seo';
import { WASTE_PAGES } from '$lib/content';

export const prerender = true;

export function GET() {
	const paths = [
		'/',
		'/afvalkalender-groningen',
		...WASTE_PAGES.map((p) => `/afval/${p.slug}`)
	];

	const urls = paths
		.map((path) => {
			const priority = path === '/' ? '1.0' : '0.7';
			return `	<url>
		<loc>${SITE.url}${path === '/' ? '/' : path}</loc>
		<changefreq>weekly</changefreq>
		<priority>${priority}</priority>
	</url>`;
		})
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	});
}
