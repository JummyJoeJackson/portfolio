# Personal Website — Design Document

_Inspired by makingsoftware.com_

---

## Vision & Goals

This is a personal website designed with the editorial clarity and quiet confidence of makingsoftware.com. The goal is not to impress with flashiness, but to communicate thoughtfully — letting ideas, writing, and work speak for themselves. The site should feel like a well-made book: unhurried, intentional, and pleasurable to read.

**Primary goals:**

- Introduce who I am and what I care about
  - Who I am: Diego Gonzalez, Mathematics Student at the University of Waterloo
  - What I do: Software Engineering + Data Science
  - What I'm passionate about: Using data to solve real world problems and making simple things with high quality
- Showcase selected projects and writing
  - Midas: https://github.com/JummyJoeJackson/Midas
  - SignCLI: https://github.com/JummyJoeJackson/sign-cli
  - World Cup Game Prediction: https://github.com/JummyJoeJackson/canada-vs-italy-prediction-model
  - AI Chess Bot: https://github.com/JummyJoeJackson/AI-Chess-Bot
  - Christmas Song Lyrics Visualizer: https://github.com/JummyJoeJackson/christmas-lyrics
- Create a space that reflects my aesthetic sensibilities
  - High quality illustrations
  - Clean and simple design
  - Easy to navigate

---

## Aesthetic Direction

### Tone

Calm, intelligent, and a little curious. The site should feel like a late-night reading experience — something you settle into rather than scan.

### Visual Style

- **Monotone palette** — the site lives almost entirely in black, white, and one or two near-neutral tones (warm off-white or cool gray). Color, if used at all, is used sparingly as an accent.
- **Editorial and typographic** — the design is led by type, not images. Generous whitespace. Wide margins. Text that breathes.
- **Illustration over photography** — custom diagrams, hand-drawn or vector illustrations to explain ideas (following the spirit of makingsoftware.com's heavy use of visuals to carry content).
- **No decorative chrome** — no gradients, no drop shadows, no UI widgets for their own sake. Every element earns its place.

---

## Typography

| Role                 | Typeface                                                                                    | Notes                                                            |
| -------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Headings             | A humanist serif (e.g. _Freight Display_, _Domaine_, or _Canela_)                           | Weight: regular or medium. Should feel editorial, not corporate. |
| Body                 | A legible serif or high-quality sans (e.g. _Freight Text_, _Söhne_, or _iA Writer Quattro_) | 16–18px, 1.7–1.8 line height                                     |
| Labels / Metadata    | Monospace or small-caps sans                                                                | Used for dates, categories, nav items                            |
| Code (if applicable) | A clean monospace (e.g. _JetBrains Mono_, _Fira Code_)                                      |                                                                  |

**Type scale:** Modular scale with strong hierarchy. H1 should feel big and confident. Body text should feel readable, not crammed.

---

## Color Palette

| Name       | Hex                                   | Use                                       |
| ---------- | ------------------------------------- | ----------------------------------------- |
| Background | `#F5F2EC`                             | Warm off-white — the "paper"              |
| Text       | `#1A1A1A`                             | Near-black for body and headings          |
| Muted      | `#888880`                             | Metadata, captions, secondary labels      |
| Rule       | `#D4D0C8`                             | Dividers, borders                         |
| Accent     | `#1A1A1A` (or one reserved ink color) | Links, hover states, illustration accents |

The palette can flip to a dark mode version: dark charcoal background, off-white text.

---

## Layout & Grid

- **Max content width:** 720px for reading columns; up to 1100px for full-bleed layouts
- **Margins:** Generous horizontal margins on desktop (10–15% each side). Comfortable padding on mobile.
- **Grid:** Mostly single-column for content. Two-column used sparingly for project grids or metadata+content pairings.
- **Spacing system:** Based on an 8px base unit. Sections separated by significant whitespace (80–120px), not just lines.

---

## Site Structure

### Pages

**Home (`/`)**
A quiet, confident introduction. Name, one-line descriptor, and a brief statement of intent. Below the fold: a curated list of recent work and writing — no carousels, no grids of thumbnails, just a clean list with titles and dates.

**Work (`/work`)**
Selected projects. Each project gets a title, a 1–2 sentence description, and a link. Optionally: a single illustrative image per project. Not a portfolio dump — a considered selection.

**Travel (`/travel`)**
A reverse-chronological list of travel experiences. Clean title + date + optional tag. No excerpts on the index. Let the titles do the work.

**About (`/about`)**
A personal narrative, written in first person. Who I am, what I work on, what I find interesting. A good photo (or illustration). Maybe a short list of influences or things I like.

**Contact (`/contact`)** _(optional, or just fold into About)_
Email address. Maybe social links. Nothing more.

---

## Components

### Navigation

- Minimal. Logo/name on the left, 3–4 links on the right.
- On mobile: hamburger or a simple stacked footer nav.
- No sticky nav. Let the page breathe.

### Link Style

- No underlines at rest. An underline or color shift on hover.
- External links get a subtle `↗` arrow.

### Illustrations / Diagrams

- Drawn in a clean, consistent style (SVG preferred).
- Black lines on transparent or page-colored background — fits the monotone palette naturally.
- Used to break up long text sections and explain ideas visually, in the spirit of makingsoftware.com.

### Images

- Full-width or contained within the reading column.
- No borders or drop shadows. Let images sit cleanly on the page.
- Captions in small muted type below.

### Project / Post Cards (list view)

```
Year   Title of the Project or Post                    →
2024   How I rebuilt my workflow around plain text     →
2024   A short film about making things slowly         →
2023   Notes on type design                            →
```

Simple. No thumbnails required on the index.

---

## Interactions & Animation

Less is more. Inspired by makingsoftware.com's restraint:

- **Page transitions:** A simple fade or instant load. No dramatic slide animations.
- **Hover states:** Subtle. A color shift or underline appearing.
- **Scroll:** No scroll-triggered animations. Content is simply there.
- **Illustrations:** May have light, purposeful motion — a subtle loop or a user-triggered interactive diagram — only where it adds genuine understanding.

---

## Performance & Accessibility

- Target Lighthouse score of 95+ across the board.
- Semantic HTML throughout (`<article>`, `<nav>`, `<main>`, `<aside>`).
- All images have descriptive `alt` text.
- Color contrast ratios meet WCAG AA minimum (4.5:1 for body text).
- Keyboard-navigable. Focus states visible.
- No heavy JS bundles. Prefer CSS for any visual effects.

---

## What This Site Is _Not_

- Not a flashy portfolio with autoplay video and motion graphics.
- Not a personal brand machine with growth metrics and CTAs.
- Not a dark-pattern newsletter funnel.

It is a home on the web: honest, readable, and made with care.

---

_Document version 1.0 — to be updated as the design evolves._
