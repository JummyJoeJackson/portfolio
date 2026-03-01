# Tech Stack

A record of the tools, frameworks, and libraries used to build this site.

---

## Core

### [Next.js](https://nextjs.org)
The foundation of the site. Next.js handles routing, static site generation, and server-side rendering where needed. The App Router is used throughout, with static export for pages that don't require a server.

- **Version:** 14.x (App Router)
- **Rendering strategy:** Static generation (`generateStaticParams`) for writing and work pages; SSG default for everything else
- **Routing:** File-based via `app/` directory
- **Image optimization:** `next/image` for responsive, lazy-loaded images

### [React](https://react.dev)
The component model underpinning the UI. Components are written as server components by default; client components (`"use client"`) are used only where interactivity is required.

- **Version:** 18.x
- **Pattern:** Server Components first, Client Components by exception
- **State:** `useState` / `useReducer` for local UI state; no global state library needed at this scale

### [Tailwind CSS](https://tailwindcss.com)
All styling is written in Tailwind utility classes. No separate CSS files except for a single `globals.css` for base resets and custom CSS variables (font faces, color tokens).

- **Version:** 3.x
- **Config:** Custom design tokens defined in `tailwind.config.ts` — type scale, color palette, spacing scale, and font families
- **Approach:** Utility-first; no component library dependencies

---

## Content

### Markdown + MDX
Writing and project pages are authored in `.mdx` files, allowing React components to be embedded inline within prose. Parsed via `@next/mdx` with `remark` and `rehype` plugins.

**Plugins in use:**
- `remark-gfm` — GitHub-flavored Markdown (tables, strikethrough, task lists)
- `rehype-pretty-code` — syntax highlighting for code blocks, powered by Shiki
- `rehype-slug` + `rehype-autolink-headings` — anchor links on headings

### Frontmatter
Each `.mdx` file includes YAML frontmatter for metadata:

```yaml
---
title: Notes on type design
date: 2024-03-12
tags: [typography, design]
draft: false
---
```

---

## Typography

Fonts are self-hosted via `@font-face` in `globals.css` and referenced as Tailwind tokens.

| Role | Typeface | Variable |
|------|----------|----------|
| Headings | Canela (or similar serif) | `font-display` |
| Body | iA Writer Quattro | `font-body` |
| Mono | JetBrains Mono | `font-mono` |

---

## Developer Experience

### [TypeScript](https://www.typescriptlang.org)
The entire codebase is TypeScript. Strict mode enabled.

### [ESLint](https://eslint.org)
Linting via `eslint-config-next` with a few custom rules. Runs on every commit via a pre-commit hook.

### [Prettier](https://prettier.io)
Consistent code formatting. Integrated with ESLint via `eslint-config-prettier`.

### [Husky](https://typicode.github.io/husky) + [lint-staged](https://github.com/okonet/lint-staged)
Pre-commit hooks run ESLint and Prettier on staged files before every commit.

---

## Deployment

### [Vercel](https://vercel.com)
Deployed to Vercel. Every push to `main` triggers a production deployment. Pull requests get preview deployments automatically.

- **Build command:** `next build`
- **Output:** Static export (`output: 'export'` in `next.config.ts`) where possible
- **Domain:** Custom domain managed via Vercel DNS

---

## File Structure

```
/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout (fonts, metadata, nav)
│   ├── page.tsx            # Home
│   ├── about/page.tsx
│   ├── work/
│   │   ├── page.tsx        # Work index
│   │   └── [slug]/page.tsx # Individual project pages
│   └── writing/
│       ├── page.tsx        # Writing index
│       └── [slug]/page.tsx # Individual posts
├── components/             # Shared UI components
├── content/                # .mdx files for writing and work
│   ├── writing/
│   └── work/
├── lib/                    # Utilities (MDX loader, date formatting, etc.)
├── public/                 # Static assets (fonts, og images, favicons)
├── styles/
│   └── globals.css         # Base resets, @font-face, CSS vars
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

---

## Key `next.config.ts` Settings

```ts
import createMDX from '@next/mdx'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrettyCode, rehypeSlug, rehypeAutolinkHeadings],
  },
})

const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  output: 'export',           // Static export for Vercel
  images: { unoptimized: true }, // Required for static export
}

export default withMDX(nextConfig)
```

---

## Key `tailwind.config.ts` Settings

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F5F2EC',
        ink: '#1A1A1A',
        muted: '#888880',
        rule: '#D4D0C8',
      },
      fontFamily: {
        display: ['Canela', 'Georgia', 'serif'],
        body: ['iA Writer Quattro', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      maxWidth: {
        reading: '720px',
        wide: '1100px',
      },
    },
  },
}

export default config
```

---

*Last updated: February 2026*
