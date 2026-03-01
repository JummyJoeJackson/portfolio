# Project Requirements Document

**Project:** Personal Website
**Version:** 1.0
**Status:** Draft
**Last Updated:** February 2026

---

## 1. Overview

### 1.1 Purpose

This document defines the functional and non-functional requirements for the design and development of a personal website. It serves as the single source of truth for scope, features, constraints, and acceptance criteria throughout the build.

### 1.2 Background

The goal is to build a personal website that functions as a home on the web — a place to introduce who I am, share my work, and past travels. The aesthetic direction is inspired by makingsoftware.com: editorial, typographic, monotone, and minimal. The site is not a flashy portfolio or a personal brand machine; it is a considered, well-made thing.

### 1.3 Stakeholders

| Role             | Person                                                  |
| ---------------- | ------------------------------------------------------- |
| Owner / Author   | Me                                                      |
| Designer         | Me                                                      |
| Developer        | Me                                                      |
| Primary Audience | Potential collaborators, employers, and curious readers |

---

## 2. Scope

### 2.1 In Scope

- Design and development of a static personal website
- Pages: Home, Work, Writing, About
- MDX-based content authoring for writing and project pages
- Responsive layout (mobile, tablet, desktop)
- Deployment to Vercel with a custom domain
- Basic SEO and Open Graph metadata

### 2.2 Out of Scope

- CMS or admin interface
- User authentication or accounts
- E-commerce or payment flows
- Comments or community features
- Newsletter or email capture (for v1)
- Analytics beyond basic page views (for v1)

---

## 3. Functional Requirements

### 3.1 Home Page

| ID   | Requirement                                                          | Priority  |
| ---- | -------------------------------------------------------------------- | --------- |
| F-01 | Display my name and a one-line descriptor prominently above the fold | Must Have |
| F-02 | Include a brief personal statement (2–4 sentences)                   | Must Have |
| F-03 | Show a curated list of recent work and travels with titles and dates | Must Have |
| F-04 | Each list item links to its respective detail page                   | Must Have |
| F-05 | No hero image, carousel, or full-bleed media required                | Must Have |

### 3.2 Work Page

| ID   | Requirement                                                    | Priority     |
| ---- | -------------------------------------------------------------- | ------------ |
| F-06 | Display a list of selected projects                            | Must Have    |
| F-07 | Each project shows: title, year, short description, and a link | Must Have    |
| F-08 | Individual project pages are rendered from `.mdx` files        | Must Have    |
| F-09 | Projects can optionally include a single representative image  | Should Have  |
| F-10 | Projects can be filtered or grouped by type or year            | Nice to Have |

### 3.3 Travel Page

| ID   | Requirement                                                                 | Priority    |
| ---- | --------------------------------------------------------------------------- | ----------- |
| F-11 | Display a reverse-chronological list of all travels                         | Must Have   |
| F-12 | Each item shows: title and date. No excerpts on the index.                  | Must Have   |
| F-13 | Individual post pages are rendered from `.mdx` files                        | Must Have   |
| F-14 | Posts support tags; tags are displayed on the detail page                   | Should Have |
| F-15 | Draft posts (frontmatter `draft: true`) are excluded from production builds | Must Have   |
| F-16 | Posts support embedded React components within prose (MDX)                  | Must Have   |
| F-17 | Code blocks are syntax-highlighted                                          | Must Have   |
| F-18 | Headings on post pages include anchor links                                 | Should Have |

### 3.4 About Page

| ID   | Requirement                                           | Priority    |
| ---- | ----------------------------------------------------- | ----------- |
| F-19 | Contains a personal narrative written in first person | Must Have   |
| F-20 | Includes a photo or illustration                      | Should Have |
| F-21 | Includes contact information (email)                  | Must Have   |
| F-22 | Optionally includes social/professional links         | Should Have |

### 3.5 Navigation

| ID   | Requirement                                                                | Priority    |
| ---- | -------------------------------------------------------------------------- | ----------- |
| F-23 | Global navigation includes: name/logo (links to Home), Work, Travel, About | Must Have   |
| F-24 | Navigation is not sticky — it scrolls with the page                        | Must Have   |
| F-25 | On mobile, navigation collapses into a simple accessible menu              | Must Have   |
| F-26 | The current page is visually indicated in the nav                          | Should Have |

### 3.6 Content Authoring

| ID   | Requirement                                                                                  | Priority  |
| ---- | -------------------------------------------------------------------------------------------- | --------- |
| F-27 | All writing and work content is authored in `.mdx` files with YAML frontmatter               | Must Have |
| F-28 | Frontmatter fields: `title`, `date`, `tags`, `draft`, `description`                          | Must Have |
| F-29 | New posts and projects can be added by creating a new `.mdx` file — no code changes required | Must Have |

---

## 4. Non-Functional Requirements

### 4.1 Performance

| ID    | Requirement                                         | Target   |
| ----- | --------------------------------------------------- | -------- |
| NF-01 | Lighthouse Performance score                        | ≥ 95     |
| NF-02 | Largest Contentful Paint (LCP)                      | < 1.5s   |
| NF-03 | Cumulative Layout Shift (CLS)                       | < 0.1    |
| NF-04 | First Contentful Paint (FCP)                        | < 1.0s   |
| NF-05 | No render-blocking JavaScript on initial load       | Required |
| NF-06 | All fonts self-hosted; no third-party font requests | Required |

### 4.2 Accessibility

| ID    | Requirement                                                               | Standard    |
| ----- | ------------------------------------------------------------------------- | ----------- |
| NF-07 | Lighthouse Accessibility score                                            | ≥ 95        |
| NF-08 | All interactive elements keyboard navigable                               | WCAG 2.1 AA |
| NF-09 | All images include descriptive `alt` text                                 | WCAG 2.1 AA |
| NF-10 | Color contrast ratio for body text                                        | ≥ 4.5:1     |
| NF-11 | Color contrast ratio for large text / headings                            | ≥ 3:1       |
| NF-12 | Focus states visible on all interactive elements                          | WCAG 2.1 AA |
| NF-13 | Semantic HTML used throughout (`<main>`, `<nav>`, `<article>`, `<aside>`) | Required    |

### 4.3 SEO & Metadata

| ID    | Requirement                                                       | Priority  |
| ----- | ----------------------------------------------------------------- | --------- |
| NF-14 | Every page has a unique `<title>` and `<meta name="description">` | Must Have |
| NF-15 | Open Graph tags on all pages for social sharing previews          | Must Have |
| NF-16 | `robots.txt` and `sitemap.xml` generated at build time            | Must Have |
| NF-17 | Canonical URLs set on all pages                                   | Must Have |

### 4.4 Responsiveness

| ID    | Requirement                                               |
| ----- | --------------------------------------------------------- |
| NF-18 | Layout is fully functional and readable at 375px (mobile) |
| NF-19 | Layout is fully functional at 768px (tablet)              |
| NF-20 | Layout is optimized for 1280px+ (desktop)                 |
| NF-21 | No horizontal scrolling on any viewport                   |

### 4.5 Browser Support

| Browser             | Minimum Version |
| ------------------- | --------------- |
| Chrome              | Last 2 versions |
| Firefox             | Last 2 versions |
| Safari              | Last 2 versions |
| Edge                | Last 2 versions |
| Mobile Safari (iOS) | iOS 15+         |
| Chrome for Android  | Last 2 versions |

---

## 5. Technical Constraints

- **Framework:** Next.js 14 (App Router) — no exceptions
- **Styling:** Tailwind CSS only — no additional CSS-in-JS libraries
- **Language:** TypeScript throughout — strict mode enabled
- **Output:** Static export (`output: 'export'`) — no Node.js server required at runtime
- **Hosting:** Vercel — free tier
- **No external UI libraries** — all components are hand-built
- **No client-side data fetching** — all content resolved at build time

---

## 6. Pages & Routes

| Route            | Page           | Rendering                     |
| ---------------- | -------------- | ----------------------------- |
| `/`              | Home           | Static                        |
| `/work`          | Work index     | Static                        |
| `/work/[slug]`   | Project detail | Static (generateStaticParams) |
| `/travel`        | Travel index   | Static                        |
| `/travel/[slug]` | Travel detail  | Static (generateStaticParams) |
| `/about`         | About          | Static                        |

---

## 7. Content Requirements

### 7.1 Launch Content Minimums

| Section       | Minimum              |
| ------------- | -------------------- |
| Work projects | 3 projects           |
| Travel posts  | 3 published posts    |
| About page    | Complete and written |
| Home intro    | Written and final    |

### 7.2 Assets Required Before Launch

- [ ] Profile photo or illustration
- [ ] Favicon (`.ico` and `.svg`)
- [ ] Open Graph default image (1200×630px)
- [ ] Self-hosted font files (WOFF2 format)

---

## 8. Acceptance Criteria

The project is considered complete when all of the following are true:

- [ ] All **Must Have** functional requirements (F-01 through F-29) are implemented and working
- [ ] Lighthouse scores: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] Site renders correctly on Chrome, Firefox, Safari (desktop and mobile)
- [ ] No console errors on any page in production
- [ ] All links resolve correctly; no 404s
- [ ] Draft posts do not appear in production
- [ ] Sitemap and robots.txt are accessible at their expected routes
- [ ] Custom domain is live with HTTPS

---

## 9. Open Questions

| #   | Question                                                          | Owner | Status     |
| --- | ----------------------------------------------------------------- | ----- | ---------- |
| 1   | Will a dark mode be supported in v1?                              | Me    | Yes        |
| 2   | Should the writing section include an RSS feed?                   | Me    | No         |
| 3   | Is a contact form needed, or is a plain email address sufficient? | Me    | Email only |
| 4   | What analytics tool, if any, should be used?                      | Me    | No         |

---

_This document should be updated whenever scope changes. All significant changes should be noted with a version bump._
