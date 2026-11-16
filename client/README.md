# yairmahfud — portfolio

Personal site. React + TypeScript + Vite + Tailwind, deployed on Vercel.

```bash
npm install
npm run dev     # local dev
npm run build   # type-check + production build
```

## Editing content

- Projects: `src/data/projects.ts` — `featured` get their own page at `/projects/:id`; `otherWork` is the compact list.
- Name, links, skills: `src/data/site.ts`
- Personal page text and media: `src/pages/PersonalPage.tsx` (media files live in `public/`)
