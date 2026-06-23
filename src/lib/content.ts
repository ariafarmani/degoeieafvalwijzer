// Content for the SEO landing pages. Each waste type gets its own page with
// genuinely distinct, useful text (what belongs in it, what doesn't, tips) so
// the pages are helpful content rather than thin doorway pages.

export interface WastePage {
	slug: string; // URL segment under /afval/
	type: string; // matches WASTE_TYPES key in types.ts
	label: string; // human label, e.g. "GFT"
	metaTitle: string;
	metaDescription: string;
	h1: string;
	lead: string;
	wel: string[]; // hoort hier wel
	niet: string[]; // hoort hier niet
	tips: string[];
}

export const WASTE_PAGES: WastePage[] = [
	{
		slug: 'gft',
		type: 'gft',
		label: 'GFT',
		metaTitle: 'GFT ophalen in Groningen – wanneer & wat mag erin | Ofvalwiezer',
		metaDescription:
			'Wanneer wordt GFT opgehaald in gemeente Groningen en wat mag er wel en niet in de groene bak? Bekijk de ophaaldagen op postcode.',
		h1: 'GFT ophalen in gemeente Groningen',
		lead: 'GFT staat voor groente-, fruit- en tuinafval. Dit organische afval wordt apart ingezameld en gecomposteerd of vergist tot groen gas. Vul je postcode in op de homepage om te zien wanneer het GFT bij jouw adres in Groningen wordt opgehaald.',
		wel: [
			'Schillen en resten van groente en fruit',
			'Etensresten, ook gekookt',
			'Tuinafval: bladeren, gras, onkruid en snoeiafval',
			'Koffiefilters, koffieprut en theezakjes zonder nietje',
			'Eierschalen en notendoppen'
		],
		niet: [
			'Plastic zakjes, ook "composteerbare" zakjes',
			'Kattenbakkorrels en uitwerpselen van dieren',
			'Stenen, zand en potgrond',
			'Verpakkingen en luiers'
		],
		tips: [
			'Een krant onderin de bak houdt de bak schoner en droger.',
			'Een goed gescheiden GFT-bak voorkomt stankoverlast in de zomer.'
		]
	},
	{
		slug: 'papier',
		type: 'papier',
		label: 'Papier',
		metaTitle: 'Oud papier ophalen in Groningen – ophaaldagen | Ofvalwiezer',
		metaDescription:
			'Wanneer wordt oud papier en karton opgehaald in gemeente Groningen en wat hoort erbij? Bekijk de ophaaldagen op postcode.',
		h1: 'Oud papier en karton ophalen in Groningen',
		lead: 'Papier en karton worden apart ingezameld en bijna volledig hergebruikt. Vouw dozen plat zodat ze niet te veel ruimte innemen. Vul je postcode in om de ophaaldagen voor papier bij jouw adres in Groningen te zien.',
		wel: [
			'Kranten, tijdschriften en folders',
			'Papieren enveloppen (ook met venster)',
			'Kartonnen dozen, plat gevouwen',
			'Papieren zakken en wikkels'
		],
		niet: [
			'Drankkartons van melk en sap (dat is PMD)',
			'Vet, vies of nat papier zoals pizzadozen met resten',
			'Geplastificeerd of geplakt papier',
			'Behang en fotopapier'
		],
		tips: [
			'Verwijder grote stukken plakband en plastic vensters waar mogelijk.',
			'Houd het papier droog; nat papier is lastiger te recyclen.'
		]
	},
	{
		slug: 'restafval',
		type: 'restafval',
		label: 'Restafval',
		metaTitle: 'Restafval ophalen in Groningen – ophaaldagen | Ofvalwiezer',
		metaDescription:
			'Wanneer wordt restafval opgehaald in gemeente Groningen en wat hoort erin? Bekijk de ophaaldagen op postcode.',
		h1: 'Restafval ophalen in gemeente Groningen',
		lead: 'Restafval is alles wat overblijft als je GFT, papier, PMD, glas en textiel goed hebt gescheiden. Hoe beter je scheidt, hoe minder restafval je overhoudt. Vul je postcode in om te zien wanneer het restafval bij jou wordt opgehaald.',
		wel: [
			'Luiers en incontinentiemateriaal',
			'Kattenbakkorrels en dierlijke uitwerpselen',
			'Sigarettenpeuken en as (afgekoeld)',
			'Kapot serviesgoed en spiegels'
		],
		niet: [
			'GFT, papier, glas, textiel en PMD — scheid die apart',
			'Klein chemisch afval zoals batterijen en verf (dat is KCA)',
			'Elektrische apparaten',
			'Grofafval dat niet in de bak past'
		],
		tips: [
			'Veel "restafval" is eigenlijk PMD of GFT — apart scheiden scheelt geld en milieu.',
			'Een goed gevulde maar niet overvolle bak voorkomt zwerfafval.'
		]
	},
	{
		slug: 'pmd',
		type: 'pmd',
		label: 'PMD',
		metaTitle: 'PMD ophalen in Groningen – plastic, metaal & drankkartons | Ofvalwiezer',
		metaDescription:
			'Wanneer wordt PMD (plastic, metaal en drankkartons) opgehaald in gemeente Groningen en wat mag erin? Bekijk de ophaaldagen op postcode.',
		h1: 'PMD ophalen in Groningen: plastic, metaal en drankkartons',
		lead: 'PMD staat voor Plastic verpakkingen, Metalen verpakkingen en Drankkartons. Deze verpakkingen worden samen ingezameld en daarna gescheiden voor recycling. Vul je postcode in om de ophaaldagen voor PMD bij jouw adres in Groningen te zien.',
		wel: [
			'Plastic flessen, flacons en bakjes',
			'Plastic tasjes en folies',
			'Blik, conservenblikken en aluminium bakjes',
			'Drankkartons van melk, sap en vla'
		],
		niet: [
			'Verpakkingen met etensresten — leeg ze eerst',
			'Piepschuim en hard plastic speelgoed',
			'Plastic zonder verpakkingsfunctie zoals tuinstoelen',
			'Luiers en chipszakken met folie (twijfel? restafval)'
		],
		tips: [
			'Verpakkingen hoeven niet schoon, wel leeg.',
			'Duw flessen en pakken plat zodat er meer in de zak past.'
		]
	},
	{
		slug: 'grofafval',
		type: 'grofafval',
		label: 'Grofafval',
		metaTitle: 'Grofafval Groningen – ophalen op afspraak | Ofvalwiezer',
		metaDescription:
			'Hoe lever je grofafval in gemeente Groningen in en wanneer wordt het opgehaald? Lees wat grofafval is en bekijk de ophaaldagen.',
		h1: 'Grofafval in gemeente Groningen',
		lead: 'Grofafval is afval dat te groot is voor de gewone afvalbak, zoals meubels en grote huishoudelijke spullen. In Groningen wordt grofafval vaak op afspraak opgehaald of kun je het naar het afvalbrengstation brengen. Vul je postcode in voor de ophaaldata bij jouw adres.',
		wel: [
			'Meubels zoals kasten, banken en stoelen',
			'Matrassen',
			'Grote stukken hout en tapijt',
			'Grote huishoudelijke voorwerpen'
		],
		niet: [
			'Klein restafval dat in de bak past',
			'Bouw- en sloopafval',
			'Klein chemisch afval (KCA)',
			'Elektrische apparaten — die worden apart ingezameld'
		],
		tips: [
			'Bekijk of spullen nog bruikbaar zijn voor de kringloop voordat je ze weggooit.',
			'Maak grote stukken waar mogelijk kleiner zodat ze makkelijker mee kunnen.'
		]
	},
	{
		slug: 'textiel',
		type: 'textiel',
		label: 'Textiel',
		metaTitle: 'Textiel inleveren in Groningen – kleding & schoenen | Ofvalwiezer',
		metaDescription:
			'Waar en wanneer lever je textiel zoals kleding en schoenen in gemeente Groningen in? Bekijk de inzameldagen op postcode.',
		h1: 'Textiel inleveren in gemeente Groningen',
		lead: 'Oude kleding, schoenen en huishoudtextiel kunnen een tweede leven krijgen of worden gerecycled. Ook kapotte kleding hoort bij het textiel, zolang het schoon en droog is. Vul je postcode in om te zien wanneer textiel bij jou wordt ingezameld.',
		wel: [
			'Kleding, ook versleten of kapot',
			'Schoenen, per paar samengebonden',
			'Lakens, handdoeken en gordijnen',
			'Tassen, riemen en knuffels'
		],
		niet: [
			'Nat of beschimmeld textiel',
			'Met verf of olie vervuild textiel',
			'Tapijt en vloerbedekking',
			'Matrassen (dat is grofafval)'
		],
		tips: [
			'Doe het textiel in een dichtgeknoopte zak zodat het droog blijft.',
			'Goede kleding kun je ook naar een kringloopwinkel brengen.'
		]
	},
	{
		slug: 'kca',
		type: 'kca',
		label: 'KCA',
		metaTitle: 'KCA in Groningen – klein chemisch afval inleveren | Ofvalwiezer',
		metaDescription:
			'Wat is KCA (klein chemisch afval) en hoe lever je het veilig in bij gemeente Groningen? Lees wat erbij hoort en bekijk de inzameldagen.',
		h1: 'KCA (klein chemisch afval) in Groningen',
		lead: 'KCA staat voor klein chemisch afval: huishoudelijke producten die schadelijk zijn voor mens en milieu en daarom apart moeten worden ingeleverd. Lever KCA nooit los bij het restafval in. Vul je postcode in om te zien wanneer KCA bij jou wordt ingezameld.',
		wel: [
			'Batterijen en oplaadbare accu\'s',
			'Verf, lijm en kit',
			'Medicijnen en injectienaalden',
			'Spaarlampen en tl-buizen'
		],
		niet: [
			'Gewoon restafval',
			'Lege, schoongespoelde verpakkingen (vaak PMD)',
			'Grote elektrische apparaten',
			'Bouwafval'
		],
		tips: [
			'Bewaar KCA in de originele verpakking zodat duidelijk is wat het is.',
			'Veel apparaatwinkels nemen oude batterijen en lampen gratis terug.'
		]
	}
];

export const WASTE_PAGE_BY_SLUG: Record<string, WastePage> = Object.fromEntries(
	WASTE_PAGES.map((p) => [p.slug, p])
);
