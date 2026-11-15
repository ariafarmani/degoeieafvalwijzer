<script lang="ts">
	import { SITE, buildBreadcrumbLd } from '$lib/seo';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const page = $derived(data.page);

	const canonical = $derived(`${SITE.url}/afval/${page.slug}`);
	const breadcrumb = $derived(
		buildBreadcrumbLd([
			{ name: 'Home', path: '/' },
			{ name: 'Afvalkalender Groningen', path: '/afvalkalender-groningen' },
			{ name: page.label, path: `/afval/${page.slug}` }
		])
	);
</script>

<svelte:head>
	<title>{page.metaTitle}</title>
	<meta name="description" content={page.metaDescription} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={page.metaTitle} />
	<meta property="og:description" content={page.metaDescription} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={SITE.ogImage} />
	{@html `<script type="application/ld+json">${breadcrumb}</script>`}
</svelte:head>

<h1>{page.h1}</h1>

<p class="lead">{page.lead}</p>

<div class="cols">
	<div>
		<h2>Wat hoort er wel bij {page.label}?</h2>
		<ul>
			{#each page.wel as item}
				<li>{item}</li>
			{/each}
		</ul>
	</div>
	<div>
		<h2>Wat hoort er niet bij?</h2>
		<ul>
			{#each page.niet as item}
				<li>{item}</li>
			{/each}
		</ul>
	</div>
</div>

<h2>Tips</h2>
<ul>
	{#each page.tips as tip}
		<li>{tip}</li>
	{/each}
</ul>

<h2>Wanneer wordt {page.label} bij jou opgehaald?</h2>
<p>
	Bekijk de exacte ophaaldagen voor {page.label} bij jouw adres in gemeente Groningen.
	<a href="/">Open de afvalkalender</a>, vul je postcode en huisnummer in en je ziet meteen
	wanneer {page.label} aan de beurt is. Je kunt de data ook exporteren naar je agenda.
</p>
