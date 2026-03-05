# De Goeie Afvalwijzer

Een betere afvalkalender voor gemeente Groningen. Vul je postcode en huisnummer in en zie direct wanneer welk afval wordt opgehaald.

## Features

- **Kalenderweergave** - Maandoverzicht met gekleurde indicatoren per afvaltype
- **Eerstvolgende ophaaldagen** - Overzicht van aankomende ophaalmomenten naast de kalender
- **Filteropties** - Filter op afvaltype (GFT, papier, restafval, PMD, etc.)
- **Kalenderexport** - Exporteer naar Apple Kalender (iCal), Google Agenda, Outlook of download als .ics
- **Herinneringen** - Geexporteerde events bevatten een herinnering (8 uur van tevoren)
- **Responsive** - Werkt op desktop en mobiel

## Tech stack

- [SvelteKit](https://svelte.dev) met TypeScript
- Burgerportaal API (gemeente Groningen)
- Vercel voor hosting

## Lokaal draaien

```sh
npm install
npm run dev
```

De app draait op `http://localhost:5173`.

## Deployen

De app is geconfigureerd voor Vercel:

```sh
npm run build
```

Koppel de repo aan Vercel en elke push naar `master` wordt automatisch gedeployd.

## Ondersteunde afvaltypes

| Type | Kleur |
|------|-------|
| GFT | Groen |
| Papier | Blauw |
| Restafval | Grijs |
| Grofafval | Oranje |
| PMD | Rood |
| Textiel | Paars |
| KCA | Roze |

## Licentie

MIT
