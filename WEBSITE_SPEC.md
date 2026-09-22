# Personal Website Spec: Diego Gonzalez

This is the build spec for my personal website. Read the whole file before writing any code. Work through the phases in order and stop at each checkpoint so I can review.

---

## 1. Overview

A minimal, professional personal site for a second-year Data Science student at the University of Waterloo. The home page is a single screen with an interactive globe showing places I've been. Two airport-themed text buttons lead to Experience ("Arrivals") and Projects ("Departures").

### Hard rules (do not break these)

1. **No header.** No nav bar, no logo bar, no top border, no background band at the top. The name and hook are plain centered text that belongs to the hero.
2. **No single long scrolling home page.** The home page must fit exactly one screen on every device, with no vertical or horizontal scroll.
3. **Footer has no visual separation.** No divider line, no border, no background color change. Just centered links sitting on the page background.
4. **No MDX.** All content lives in typed TypeScript data files.
5. **Nothing that looks "vibe coded."** No gradient blobs, no glassmorphism cards everywhere, no emoji-heavy UI, no generic "Hi, I'm \_\_\_ 👋" hero, no excessive animation. Restrained and clean.

---

## 2. Tech stack

| Area      | Choice                                                                            |
| --------- | --------------------------------------------------------------------------------- |
| Framework | Next.js (latest stable), App Router, TypeScript                                   |
| Styling   | Tailwind CSS                                                                      |
| UI setup  | shadcn/ui (for project structure, `components/ui`, `@/` alias, `cn` util)         |
| Globe     | `cobe` (latest) via the 21st.dev `cobe-globe` component                           |
| Icons     | `lucide-react` (`PlaneLanding`, `PlaneTakeoff`, footer icons)                     |
| Animation | `motion` (the current package name for Framer Motion; import from `motion/react`) |
| Hosting   | Vercel, deployed from GitHub, using my existing custom domain                     |

Notes:

- Use the latest `cobe`. Marker `id`s and CSS Anchor Positioning support (`--cobe-<id>` anchors and `--cobe-visible-<id>` variables) are required and exist in current versions. Verify after install.
- Next.js `<Link>` prefetches automatically in production. Still call `router.prefetch()` on hover/focus for the plane buttons, since navigation is triggered programmatically after the animation.

---

## 3. Site structure

| Route         | Purpose                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------- |
| `/`           | Home hero: name, hook, globe, Arrivals/Departures buttons, footer links. One screen, no scroll. |
| `/experience` | Experience page ("Arrivals"). Can scroll if content is long.                                    |
| `/projects`   | Projects page ("Departures"). Can scroll if content is long.                                    |

Resume lives at `public/resume.pdf` and opens in a new tab.

---

## 4. Home page

### 4.1 Layout: desktop (`md` and up, 768px+)

```
                 Diego Gonzalez
        Data Science @ University of Waterloo

  🛬 Arrivals        (   GLOBE   )        🛫 Departures
  (Experience)                             (Projects)

      LinkedIn · GitHub · Email · Resume
```

- Page wrapper: `h-dvh` (not `h-screen`, so mobile browser bars don't cause overflow), `overflow-hidden`.
- Outer grid rows: `auto 1fr auto` (top text, middle, footer).
- Middle row is a 3-column grid: `grid-cols-[1fr_auto_1fr]`.
  - Globe in the center column.
  - Arrivals in the left column, vertically centered (`self-center`), aligned toward the globe (`justify-self-end`).
  - Departures in the right column, vertically centered, aligned toward the globe (`justify-self-start`).
  - Equal gap between each button and the globe.
- Globe sizing: `aspect-square`, `max-h-full`, `max-w-full`, so it fills the leftover space without overflowing. Grid children need `min-h-0` so the `1fr` row can actually shrink.

### 4.2 Layout: small screens (below `md`)

```
          Diego Gonzalez
      Data Science @ University of Waterloo

        (   GLOBE   )

  🛬 Arrivals      🛫 Departures
  (Experience)     (Projects)

 LinkedIn · GitHub · Email · Resume
```

- The globe spans the full width in its own row. The two buttons sit side by side directly below it, keeping left = Arrivals and right = Departures.
- Still exactly one screen, no scroll. The globe is the element that shrinks when height is tight (landscape phones, short laptops). Text, buttons, and footer never get cut off.
- Do not use a swipe carousel for the buttons.

### 4.3 Top text (not a header)

- My name, then the one-line hook directly beneath it. Centered.
- Hook text: `TODO: I'll provide this.` Use a placeholder like "Data Science @ Waterloo" until then. Keep it in `data/site.ts`.

### 4.4 Arrivals / Departures buttons

Each button is one link element with two lines:

|       | Line 1                             | Line 2 (smaller, muted) | Destination   |
| ----- | ---------------------------------- | ----------------------- | ------------- |
| Left  | `PlaneLanding` icon + "Arrivals"   | (Experience)            | `/experience` |
| Right | `PlaneTakeoff` icon + "Departures" | (Projects)              | `/projects`   |

- Plain text style, no filled button backgrounds. Subtle hover: underline or the icon nudges a few pixels in its direction of travel.
- "Arrivals" / "Departures" may be uppercase with slightly wider letter spacing to hint at an airport board. Keep it subtle.
- Must be keyboard focusable with a visible focus ring. Accessible names should include the section, e.g. "Arrivals: Experience".

### 4.5 Footer

- One centered row of links: LinkedIn, GitHub, Email, Resume.
- Muted text that brightens on hover; small lucide icons next to labels are fine.
- Same background as the page. No border, no divider, no color band, not sticky or fixed.
- External links open in a new tab with `rel="noopener noreferrer"`. Email uses `mailto:`.
- Link values come from `data/site.ts`:
  - LinkedIn: `https://www.linkedin.com/in/dgonza-math/`
  - GitHub: `https://github.com/JummyJoeJackson`
  - Email: `d23gonza@uwaterloo.ca`
  - Resume: `/resume.pdf`

---

## 5. Globe

### 5.1 Base component

Install the 21st.dev component into `components/ui/cobe-globe.tsx`, either with:

```bash
npx shadcn@latest add https://21st.dev/r/larsen66/cobe-globe
```

or by copying the source I have into that path. Do not add the `demo.tsx` file to the site; it is reference only for props.

The component already provides: auto-rotation, drag with momentum, theta clamping, marker IDs with anchored labels, arcs, and a canvas fade-in.

### 5.2 Required modifications to the component

1. **Resize handling.** The component measures width once at init and never updates. Add a `ResizeObserver` that updates the canvas size (recreate or update the globe) when the container resizes. Must look sharp after window resizes, device rotation, and crossing the `md` breakpoint.
2. **Stop unnecessary re-inits.** The main `useEffect` depends on array props (`markers`, `arcs`, color tuples). New array identities destroy and recreate the globe, which resets rotation and flickers. Fix by keeping config in refs (read inside the render loop) and only re-initializing when truly needed. Opening or closing a place card must not restart the globe.
3. **Clickable markers.** Labels currently have `pointer-events: none`. Add an invisible, accessible `<button>` per marker, anchored with `position-anchor: --cobe-<id>` and hidden/disabled when `--cobe-visible-<id>` is 0 (back of the globe). Clicking opens that place's card. Hit area at least 32×32px.
4. **Click vs drag.** A drag that starts on the canvas must never open a card. Treat a pointer movement over ~5px as a drag.
5. **Programmatic control.** Add:
   - a `paused` prop (stops auto-rotation while a card is open),
   - a way to rotate to a given `[lat, lng]` (imperative ref method such as `focusOn(location)`), easing smoothly to center that place.
6. **Label behavior and styling.** Remove the hardcoded navy `#1a1a2e` label styling and monospace font. Use the site's theme tokens and font. Labels show on hover/focus of their marker only, not always, to avoid clutter.
7. **Theme props.** Globe colors (`baseColor`, `markerColor`, `glowColor`, `arcColor`, `dark`) come from one theme config so they match the site palette.
8. **Reduced motion.** With `prefers-reduced-motion: reduce`, disable auto-rotation (dragging still works) and make `focusOn` jump instead of animate.
9. **WebGL fallback.** If WebGL is unavailable, show a simple static circle/placeholder of the same size. The Places list (5.5) keeps all places reachable.

### 5.3 Data

All places live in `data/places.ts`, the single source of truth:

```ts
export type Place = {
  id: string; // unique, lowercase, used for CSS anchors
  label: string; // short name shown on hover, e.g. "Tokyo"
  name: string; // full name for the card, e.g. "Tokyo, Japan"
  location: [number, number]; // [lat, lng]
  date: string; // e.g. "Summer 2024"
  note: string; // one or two short sentences
  image?: string; // e.g. "/places/tokyo.jpg"
};
```

- Define the array at module level (stable reference).
- The globe wrapper derives `markers` from it; the card reads the rest.
- IDs must be valid CSS identifier fragments (letters, numbers, hyphens).
- Seed with 3 to 4 placeholder places so everything can be tested; I'll replace them with real ones.
- Placeholder images: use a neutral local placeholder or known Unsplash images during development only. Final images are my own photos in `public/places/`.

### 5.4 Place card

- **Desktop:** small floating card near the selected marker (or a fixed corner position if anchoring near the marker is awkward). Shows name, date, note, optional photo.
- **Mobile:** bottom sheet instead of a floating card.
- Opening a card: pause rotation and rotate the globe to center that place.
- Closing: ✕ button, click outside, or Escape. Resume rotation on close.
- Focus moves into the card on open and returns to the triggering element on close.

### 5.5 Places list (accessibility and fallback)

- An unobtrusive "Places" text control (for example, small text near the globe) that opens a simple list of all places.
- Selecting a place calls `focusOn` and opens its card.
- This is also the fallback for browsers without CSS Anchor Positioning support, where marker buttons will not position correctly. Detect support with `CSS.supports("position-anchor: --a")` and hide the anchored marker buttons when unsupported.

### 5.6 Arcs (optional, off by default)

Support showing a faint arc from home (Toronto) to the selected place while its card is open, like a flight route. Behind a flag in `data/site.ts`, default off. No always-on arcs.
Also add support for arcs from any given two places. For example, if I visit two places, I can click on the first place and see the arc from the second place to the first place. And vice versa. They should not be super flashy, just noticeable.

---

## 6. Transitions

Use `motion`. Next.js App Router does not do exit animations between routes cleanly, so play the animation on the home page first and navigate when it finishes.

### 6.1 Home → Experience (Arrivals)

1. The `PlaneLanding` icon glides down and to the right on a gentle curve, easing out like a touchdown, then fades.
2. A thin, faint trail (transparent-to-muted gradient line) stretches behind it and fades.
3. The rest of the hero fades out during the last ~200ms.
4. `router.push("/experience")`.
5. The Experience page fades in with content rising a few pixels into place.

### 6.2 Home → Projects (Departures)

Same flow, but the `PlaneTakeoff` icon starts slow and accelerates up and to the right, exiting off the top of the screen (ease-in, like a takeoff).

### 6.3 Back to home

Home always plays the same fade-in, whether it's the first site load, the "← Back" link, or the browser back button. It runs on mount, so it's consistent automatically.

Stagger order: name + hook, then globe, then buttons, then footer. Coordinate with the globe's own canvas fade so it doesn't lag noticeably behind.

### 6.4 Timing

| Moment                                 | Duration     |
| -------------------------------------- | ------------ |
| Plane whoosh                           | ~550ms       |
| Hero fade-out (overlaps end of whoosh) | ~200ms       |
| Subpage fade-in                        | ~300ms       |
| Home fade-in with stagger              | ~600ms total |

Click to new content must stay under ~800ms.

### 6.5 Rules

- Prefetch the destination on hover/focus of each plane button (and again on click).
- Ignore extra clicks while an animation is playing (no double navigation).
- Cmd/Ctrl-click and middle-click must still open the page in a new tab normally (skip the animation, use real `href`s).
- `prefers-reduced-motion`: skip plane movement and trails, use a quick fade only.
- Keep animations to transform and opacity only.

---

## 7. Experience and Projects pages

- Same fonts, colors, and spacing as home. No header here either.
- A single "← Back" text link at top left returns home. It's a link, not a bar.
- Page title styled to match: "🛬 Arrivals" with "(Experience)" beneath, and "🛫 Departures" with "(Projects)" beneath (use the lucide icons, not emoji).
- These pages may scroll if content is long.

### 7.1 Experience (`data/experience.ts`)

```ts
export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string; // e.g. "May 2026"
  end: string; // e.g. "Aug 2026" or "Present"
  bullets: string[]; // 2 to 3 short points
  link?: string;
};
```

Display like a clean flight board: company, role, and dates in aligned columns on desktop, stacking on mobile. Bullets below each entry.

### 7.2 Projects (`data/projects.ts`)

```ts
export type Project = {
  id: string;
  title: string;
  summary: string; // one line
  tags: string[]; // tech stack
  github?: string;
  demo?: string;
  image?: string;
};
```

Simple list or card grid, restrained. No heavy hover effects.

Seed both files with 2 to 3 clearly marked placeholder entries. I'll fill in real content.

### 7.3 Ticket deck (Phase 8)

Instead of a vertical list of boarding passes, stack them on top of each other like a deck and let me move through them one at a time, the way you flip through flashcards.

This replaces the list layout on both Experience and Projects. The ticket design itself does not change.

**Deck**

- One ticket is active and fully visible. The next two or three sit behind it, offset down by a few pixels and scaled down slightly, so the stack reads as a pile with depth. Everything further back is not rendered.
- The deck sits at a fixed height so the page does not jump as cards of different heights come forward. Height comes from the tallest card in the set, measured once.
- A quiet position indicator, for example `3 / 7`, near the deck. Plain text, same muted style as the rest of the site.

**Moving through it**

- Drag or swipe the top card sideways to send it away and bring the next one forward. Pointer events, so mouse and touch use the same path.
- Release below a distance threshold and the card springs back instead of advancing. Use the same roughly 5px slop as the globe so a click is never read as a drag.
- Left and right arrow keys move between cards when the deck has focus. The deck is one tab stop, not one per card.
- Small previous and next text controls as well, so it works without dragging at all. Never an icon only control.
- The deck wraps around at both ends, and sending the last card away brings the first back.

**Rules**

- Every ticket must stay reachable with a keyboard alone, and any link inside a ticket must be reachable too. Only the active card's links should be in the tab order; cards behind it are inert.
- Screen readers should be told which card is showing, for example a live region announcing `Ticket 3 of 7`, and the cards behind the active one should be hidden from assistive technology.
- `prefers-reduced-motion`: no sliding and no spring. Cards cut from one to the next, and the stack offsets can stay since they are static.
- Animate transform and opacity only, same rule as the transitions.
- Dragging a card must never trigger a link inside it.
- Do not capture vertical scrolling. A mostly vertical drag should scroll the page as usual, so only a mostly horizontal gesture moves the deck.
- If JavaScript does not run, the tickets must still all be readable. Fall back to the plain stacked list rather than showing only the top card, the same way the CSS entrance was kept working without JS.

**Open questions for me, don't guess**

- Should the deck advance on a vertical swipe instead, since a page of tickets reads top to bottom?
- Should Experience and Projects both use the deck, or only one of them?
- Do you want the discarded card to fly off like the plane, or just fade?

---

## 8. Design system

- **Theme: `TODO`, not decided yet (light or dark).** Put all colors in CSS variables / Tailwind theme tokens and the globe color config in one place, so switching is a one-file change. Build with a light default (white globe on an off-white background, similar to the 21st.dev demo) until I decide.
- One clean sans-serif font via `next/font` (e.g. Inter or Geist). Optional second font only for "Arrivals"/"Departures" if it looks good; otherwise one font.
- Muted secondary text for "(Experience)", "(Projects)", footer links, and card dates.
- Generous whitespace, no shadows except a very soft one on the place card.

---

## 9. File layout

```
app/
  layout.tsx            → fonts, metadata, theme variables
  page.tsx              → home hero
  experience/page.tsx
  projects/page.tsx
  globals.css
components/
  ui/
    cobe-globe.tsx      → 21st.dev component with section 5.2 changes
  TravelGlobe.tsx       → connects places.ts to the globe, clicks, focus, card state
  PlaceCard.tsx         → floating card (desktop) / bottom sheet (mobile)
  PlacesList.tsx        → accessible list + fallback
  NavPlane.tsx          → Arrivals / Departures button with whoosh animation
  SocialLinks.tsx       → centered footer links
  PageShell.tsx         → shared subpage wrapper (back link, fade-in)
data/
  site.ts               → name, hook, links, feature flags, theme/globe colors
  places.ts
  experience.ts
  projects.ts
lib/
  utils.ts              → shadcn cn()
public/
  resume.pdf            → placeholder until I add mine
  places/               → my trip photos
```

---

## 10. Metadata and polish

- Page titles: "Diego Gonzalez", "Experience · Diego Gonzalez", "Projects · Diego Gonzalez".
- Meta description from the hook.
- Favicon (simple, can be a small globe or plane mark).
- Open Graph image for link previews (static image is fine).
- Lighthouse: aim for 90+ on Performance, Accessibility, Best Practices, SEO.
- Globe must not block first paint: render it client-side only, keep the canvas container sized from the start so layout doesn't shift.

---

## 11. Build phases (stop after each for review)

**Phase 1: Setup and deploy**

- Create the Next.js + TypeScript + Tailwind project, run shadcn init, install `cobe`, `lucide-react`, `motion`.
- Create the folder structure and data files with placeholders.
- Checkpoint: runs locally with no errors. I'll push to GitHub and connect Vercel + my domain.

**Phase 2: Home layout**

- Build the hero grid with a placeholder circle instead of the globe, the two plane buttons, and the footer.
- Checkpoint: fits exactly one screen, no scroll, at 375×667, 390×844, 844×390 (landscape), 768×1024, 1440×900, 1920×1080.

**Phase 3: Globe**

- Add the 21st.dev component, apply all section 5.2 changes, wire it to `places.ts`.
- Checkpoint: sharp at all sizes, survives resizing, no restarts on state changes.

**Phase 4: Markers, card, places list**

- Clickable markers, click-vs-drag, `focusOn`, pause, card / bottom sheet, Places list, anchor-positioning fallback.
- Checkpoint: works with mouse, touch, and keyboard.

**Phase 5: Subpages**

- Experience and Projects pages from their data files, back link, shared shell.

**Phase 6: Transitions**

- Plane whoosh animations, hero fade-out, subpage fade-in, home fade-in, reduced motion, double-click protection, modifier-click behavior.

**Phase 7: Polish**

- Metadata, favicon, OG image, WebGL fallback, Lighthouse pass.

**Phase 8: Ticket deck**

- Stack the Experience and Projects tickets into a swipeable deck per section 7.3, with keyboard and pointer parity, a no-JavaScript fallback, and reduced motion handled.

---

## 12. Acceptance checklist

- [ ] No header anywhere on the site.
- [ ] Home fits one screen with zero scroll at every size in Phase 2.
- [ ] Buttons are vertically centered beside the globe on desktop and side by side below it on mobile.
- [ ] Footer is centered links only, with no line, border, or color change.
- [ ] Globe stays sharp after resizing and rotation, and never restarts when a card opens.
- [ ] Dragging never opens a card; clicking a visible marker always does.
- [ ] Every place is reachable through the Places list, including in browsers without anchor positioning.
- [ ] Arrivals plays the landing whoosh, Departures plays the takeoff whoosh, both navigate in under ~800ms.
- [ ] Home always fades in the same way (first load, back link, browser back).
- [ ] Reduced motion setting is respected everywhere.
- [ ] All content (places, experience, projects, links, hook) is edited only in `data/` files.
- [ ] Every ticket in the deck is reachable by keyboard alone, and the cards behind the active one are inert and hidden from assistive technology.
- [ ] A mostly vertical drag on the deck scrolls the page instead of changing card.
- [ ] With JavaScript off, every ticket is still readable rather than only the top one.
- [ ] No MDX, no em dashes in site copy.

---

## 13. Open items (ask me, don't guess)

- Light or dark theme.
- The one-line hook.
- Real places, experience, projects, and resume PDF.
- Whether to turn on the flight-path arc option.
