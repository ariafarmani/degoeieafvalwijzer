// Central SEO configuration. Change `url` here if the production domain ever moves.
export const SITE = {
	url: 'https://goudeofvalwiezer.nl',
	name: 'De Goude Ofvalwiezer',
	// Shown as the browser/Google title. ~60 chars, keyword-first, brand last.
	title: 'Afvalkalender Groningen – ophaaldagen GFT, papier & restafval',
	// Google snippet. ~155 chars, leads with the user intent + the action.
	description:
		'Bekijk direct wanneer GFT, papier, PMD en restafval worden opgehaald in gemeente Groningen. Vul je postcode en huisnummer in en exporteer naar je agenda.',
	locale: 'nl_NL',
	// 1200×630 social-share image.
	ogImage: 'https://goudeofvalwiezer.nl/og-image.png'
} as const;

// Frequently-asked questions. Rendered visibly on the page AND emitted as
// FAQPage structured data so Google can show them as rich results / capture
// long-tail "wanneer wordt afval opgehaald" queries.
export const FAQ: { q: string; a: string }[] = [
	{
		q: 'Wanneer wordt mijn afval opgehaald in Groningen?',
		a: 'Vul hierboven je postcode en huisnummer in. Je ziet dan meteen de ophaaldagen voor GFT, papier, PMD, restafval en meer in een overzichtelijke maandkalender.'
	},
	{
		q: 'Welke afvalsoorten worden in gemeente Groningen opgehaald?',
		a: 'In Groningen worden onder andere GFT (groente-, fruit- en tuinafval), oud papier, PMD (plastic, metaal en drankkartons), restafval, grofafval, textiel en KCA opgehaald. Welke soorten bij jouw adres horen zie je na het invullen van je postcode.'
	},
	{
		q: 'Kan ik de afvalkalender in mijn agenda zetten?',
		a: 'Ja. Na het zoeken kun je de ophaaldagen exporteren naar Apple Kalender, Google Agenda en Outlook, of downloaden als .ics-bestand. Elke afspraak krijgt automatisch een herinnering 8 uur van tevoren.'
	},
	{
		q: 'Is De Goude Ofvalwiezer gratis?',
		a: 'Ja, het bekijken en exporteren van je afvalkalender voor gemeente Groningen is helemaal gratis.'
	}
];

// JSON-LD structured data for the homepage.
export function buildJsonLd(): string {
	const graph = [
		{
			'@type': 'WebSite',
			'@id': `${SITE.url}/#website`,
			url: SITE.url,
			name: SITE.name,
			description: SITE.description,
			inLanguage: 'nl-NL'
		},
		{
			'@type': 'WebApplication',
			'@id': `${SITE.url}/#webapp`,
			name: SITE.name,
			url: SITE.url,
			applicationCategory: 'UtilitiesApplication',
			operatingSystem: 'Web',
			browserRequirements: 'Requires JavaScript.',
			inLanguage: 'nl-NL',
			description: SITE.description,
			areaServed: {
				'@type': 'AdministrativeArea',
				name: 'Gemeente Groningen'
			},
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'EUR'
			}
		},
		{
			'@type': 'FAQPage',
			'@id': `${SITE.url}/#faq`,
			mainEntity: FAQ.map((item) => ({
				'@type': 'Question',
				name: item.q,
				acceptedAnswer: {
					'@type': 'Answer',
					text: item.a
				}
			}))
		}
	];

	return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}
