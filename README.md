# De Goude Ofvalwiezer

Een betere afvalkalender voor gemeente Groningen. Vul je postcode en huisnummer in en zie direct wanneer welk afval wordt opgehaald — en zet de ophaaldagen in één klik in je eigen agenda.

🔗 **Live:** [goudeofvalwiezer.nl](https://goudeofvalwiezer.nl)

## Features

- **Kalenderweergave** — maandoverzicht met gekleurde indicatoren per afvaltype
- **Eerstvolgende ophaaldagen** — overzicht van aankomende ophaalmomenten naast de kalender
- **Filteropties** — filter op afvaltype (GFT, papier, restafval, PMD, etc.)
- **Kalenderexport** — exporteer naar Apple Kalender (iCal), Google Agenda, Outlook of download als `.ics`
- **Herinneringen** — geëxporteerde afspraken bevatten een herinnering (8 uur van tevoren)
- **Responsive** — werkt op desktop en mobiel
- **SEO-geoptimaliseerd** — Open Graph/Twitter-kaarten, JSON-LD structured data, sitemap en prerendering

## Tech stack

- [SvelteKit](https://svelte.dev) (Svelte 5) met TypeScript
- Burgerportaal API (gemeente Groningen) voor de ophaalgegevens
- Cloudflare Workers voor hosting (`@sveltejs/adapter-cloudflare`)

## Lokaal draaien

```sh
npm install
npm run dev
```

De app draait op `http://localhost:5173`.

### Environment variables

De API-routes praten met het Burgerportaal en hebben twee secrets nodig. Kopieer `.env.example` naar `.env` en vul ze in:

```sh
cp .env.example .env
```

| Variabele          | Omschrijving                                            |
| ------------------ | ------------------------------------------------------- |
| `FIREBASE_API_KEY` | API-key voor de anonieme auth van het Burgerportaal     |
| `PROVIDER_ID`      | Organisatie-/provider-ID van gemeente Groningen         |

## Scripts

| Commando          | Wat het doet                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start de dev-server met hot reload            |
| `npm run build`   | Maakt een productie-build                     |
| `npm run preview` | Bekijkt de productie-build lokaal             |
| `npm run check`   | Typecheck via `svelte-check`                  |

## Projectstructuur

```
src/
  app.html                       Document-shell (meta, fonts, theme-color)
  app.css                        Globale stijlen en design tokens
  lib/
    types.ts                     Afvaltypes, kleuren en iconen
    seo.ts                       Centrale SEO-config + JSON-LD
  routes/
    +page.svelte                 De hele app (zoeken, kalender, export, FAQ)
    +page.ts                     Prerender-instelling voor de homepage
    sitemap.xml/+server.ts       Gegenereerde sitemap
    api/calendar/+server.ts      Haalt de afvalkalender op
    api/calendar/export/+server.ts  Genereert het .ics-bestand
static/                          robots.txt, favicon, og-image
```

## Deployen

De app is geconfigureerd voor **Cloudflare Workers** (zie `wrangler.jsonc` en de `adapter-cloudflare` in `svelte.config.js`):

```sh
npm run build
```

De repo is gekoppeld aan Cloudflare Workers Builds; elke push naar `master` wordt automatisch gedeployd. Stel `FIREBASE_API_KEY` en `PROVIDER_ID` in als secrets in het Cloudflare-dashboard (of via `wrangler secret put`).

## SEO

Het domein staat centraal in `src/lib/seo.ts` — pas `SITE.url` daar aan als het domein verandert. Verder is geregeld:

- Keyword-rijke `<title>` en meta-description
- Open Graph- en Twitter Card-tags met een 1200×630 deelafbeelding (`static/og-image.png`)
- JSON-LD structured data: `WebSite`, `WebApplication` en `FAQPage`
- Een zichtbare, crawlbare FAQ-sectie
- `sitemap.xml` (gegenereerd) en een verwijzing daarnaar in `robots.txt`
- Canonical-URL en prerendering van de homepage

Na het deployen: meld het domein aan bij [Google Search Console](https://search.google.com/search-console) en dien `https://goudeofvalwiezer.nl/sitemap.xml` in.

## Ondersteunde afvaltypes

| Type      | Kleur        |
| --------- | ------------ |
| GFT       | Groen        |
| Papier    | Blauw        |
| Restafval | Grijs        |
| Grofafval | Amber        |
| PMD       | Oranje       |
| Textiel   | Paars        |
| KCA       | Magenta      |
| Kerstboom | Donkergroen  |

## Licentie

MIT
