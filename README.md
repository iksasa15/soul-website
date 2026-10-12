# SOUL — Company Website

Bilingual (Arabic / English), light & dark company website for **SOUL**, built with Next.js 16, React 19, Tailwind CSS 4, Motion and three.js.

موقع تعريفي لشركة SOUL بالعربية والإنجليزية، يدعم الوضع الليلي والنهاري.

## Run locally — التشغيل محليًا

```bash
npm install
npm run dev
```

Open http://localhost:3000 — it redirects to `/ar`. The English site is at `/en`.

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm test` | Unit tests (calculator maths, translations, language switching) |
| `npm run lint` / `npm run typecheck` | Code checks |

## Pages — الصفحات

- `/ar`, `/en` — home: hero with interactive 3D globe, about, story, why SOUL, fields, projects, initiatives, achievements & gallery, team, partnerships, contact.
- `/[locale]/projects/cardio-k` — live app demo with three scenarios.
- `/[locale]/projects/neomove` — interactive bed explorer, vital-signs monitor, satellite link.
- `/[locale]/projects/omnisense` — live RFID dashboard and nursing-time calculator.

All pages are generated statically at build time.

## Editing content — تعديل النصوص

All text lives in two files with the same structure:

- `src/i18n/dictionaries/ar.ts` — Arabic (source)
- `src/i18n/dictionaries/en.ts` — English

TypeScript and `npm test` fail if a key exists in one language but not the other.
Images are in `public/images/` (products, team, events); the gallery list is in `src/data/projects.ts`.

## Contact form — نموذج التواصل

1. Create a free access key at https://web3forms.com using `soulcompany.om@gmail.com`.
2. Add it as `NEXT_PUBLIC_WEB3FORMS_KEY` (see `.env.example`) — locally in `.env.local`, on Vercel under Project → Settings → Environment Variables.

Without a key the form still works: it opens the visitor's email app with the message pre-filled.

## Deploy to Vercel — النشر

1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new (framework is detected automatically).
3. Add `NEXT_PUBLIC_WEB3FORMS_KEY` and, once you have a domain, `NEXT_PUBLIC_SITE_URL` (e.g. `https://soul.om`).

## Notes

- The logo in `src/components/brand/logo-paths.ts` was vectorised from the supplied `Logo.pdf`.
- Product, team and event photos were cropped from the company profile PDF; replace them with higher-resolution originals in `public/images/` when available (keep the same file names, update `width`/`height` where the files are referenced).
- The live demos on the project pages use simulated data and are labelled as such on the page.
- `npm run globe:land` regenerates the globe's land mask (`src/components/globe/land-mask.ts`).
