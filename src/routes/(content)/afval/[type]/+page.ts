import { error } from '@sveltejs/kit';
import { WASTE_PAGES, WASTE_PAGE_BY_SLUG } from '$lib/content';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

// Tell SvelteKit which slugs to prerender for this dynamic route.
export const entries: EntryGenerator = () => WASTE_PAGES.map((p) => ({ type: p.slug }));

export const load: PageLoad = ({ params }) => {
	const page = WASTE_PAGE_BY_SLUG[params.type];
	if (!page) throw error(404, 'Afvaltype niet gevonden');
	return { page };
};
