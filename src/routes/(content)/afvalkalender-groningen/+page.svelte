<script lang="ts">
	import { SITE, buildBreadcrumbLd } from '$lib/seo';
	import { WASTE_PAGES } from '$lib/content';

	const title = 'Afvalkalender Groningen 2026 – ophaaldagen op postcode';
	const description =
		'De afvalkalender en afvalwijzer voor gemeente Groningen. Bekijk per postcode wanneer GFT, papier, PMD, restafval, grofafval, textiel en KCA worden opgehaald.';
	const canonical = `${SITE.url}/afvalkalender-groningen`;
	const breadcrumb = buildBreadcrumbLd([
		{ name: 'Home', path: '/' },
		{ name: 'Afvalkalender Groningen', path: '/afvalkalender-groningen' }
	]);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content={SITE.ogImage} />
	{@html `<script type="application/ld+json">${breadcrumb}</script>`}
</svelte:head>

<h1>Afvalkalender Groningen: wanneer wordt jouw afval opgehaald?</h1>

<p class="lead">
	Op zoek naar de afvalkalender of afvalwijzer van gemeente Groningen? Met De Goude
	Ofvalwiezer zie je in één oogopslag wanneer GFT, papier, PMD, restafval en meer bij
	jou worden opgehaald — gewoon op postcode en huisnummer.
</p>

<p>
	Vul je gegevens in op de <a href="/">homepage</a> en je krijgt direct een overzichtelijke
	maandkalender met gekleurde indicatoren per afvaltype. Je kunt de ophaaldagen bovendien
	gratis exporteren naar Apple Kalender, Google Agenda of Outlook, inclusief een herinnering
	8 uur van tevoren. Zo mis je nooit meer een ophaaldag.
</p>

<h2>Welk afval wordt in Groningen opgehaald?</h2>
<p>
	In gemeente Groningen worden verschillende afvalstromen apart ingezameld. Hieronder vind
	je per soort uitleg over wat er wel en niet bij hoort, plus handige scheidingstips:
</p>
<ul>
	{#each WASTE_PAGES as p}
		<li><a href="/afval/{p.slug}">{p.label} — {p.h1.toLowerCase()}</a></li>
	{/each}
</ul>

<h2>Waarom afval scheiden?</h2>
<p>
	Goed gescheiden afval kan worden hergebruikt en gerecycled, wat grondstoffen bespaart en
	het milieu ontlast. Hoe beter je GFT, papier, glas, textiel en PMD scheidt, hoe minder
	restafval je overhoudt. De afvalkalender helpt je om elke stroom op het juiste moment
	buiten te zetten.
</p>

<h2>Zelf je ophaaldagen bekijken</h2>
<p>
	Klaar om te beginnen? <a href="/">Open de afvalkalender</a>, vul je postcode en huisnummer
	in en bekijk meteen jouw persoonlijke ophaalschema voor Groningen.
</p>
