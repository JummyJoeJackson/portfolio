# Diego Gonzalez, personal site

Next.js App Router, TypeScript, Tailwind v4. Built against [`WEBSITE_SPEC.md`](WEBSITE_SPEC.md), which is the source of truth for the design rules.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build, also the fastest way to catch type errors
npm run lint
```

---

## Where do I change this?

| I want to change | Go to |
| --- | --- |
| My name, the one line hook, the site URL | [`data/site.ts`](data/site.ts) → `site` |
| LinkedIn, GitHub, email, resume links | [`data/site.ts`](data/site.ts) → `links` |
| Places on the globe | [`data/places.ts`](data/places.ts) → `places` |
| Jobs on the Arrivals page | [`data/experience.ts`](data/experience.ts) → `experience` |
| Projects on the Departures page | [`data/projects.ts`](data/projects.ts) → `projects` |
| Colours, light or dark | [`app/globals.css`](app/globals.css) → `:root` and `.dark` |
| Globe colours | [`data/site.ts`](data/site.ts) → `globeThemes` |
| The resume PDF | `public/resume.pdf`, replace the file |
| Trip photos | `public/places/`, replace the files |
| Favicon | [`app/icon.svg`](app/icon.svg) |
| Link preview card | [`app/opengraph-image.tsx`](app/opengraph-image.tsx) |
| Page titles, meta description | [`app/layout.tsx`](app/layout.tsx) → `metadata` |

Everything you are likely to edit day to day is in `data/`. Nothing in `components/` needs touching to change content.

---

## Content

### `data/site.ts`

Identity and everything global.

- `site.name`, `site.hook` — the two lines on the home page. The hook is also the meta description and the subtitle on the link preview card, so keep it to one line.
- `site.url` — your domain. Link previews need an absolute URL, so this must be right or shared links show no image. Preview deploys use their own Vercel URL automatically.
- `site.home` — where flight path arcs start from. Only used when `features.homeArc` is on.
- `links` — the four footer links. Email is turned into a `mailto:` for you.
- `features.homeArc` — draw a faint arc from home to whichever place is open.
- `features.placeToPlaceArcs` — also link the open place to every other place.
- `globeThemes` and `globeTheme` — see [Theme](#theme).

### `data/places.ts`

The pins on the globe. Each needs an `id` (lowercase, letters, numbers and hyphens only, because it becomes a CSS anchor name), a short `label` for the hover tag, a full `name` for the card, `location` as `[lat, lng]`, a `date` and a `note`.

**Adding a photo.** Drop the file in `public/places/` and set `image: "/places/whatever.jpg"`. The card crops it to 3:2 and fills the frame, so landscape survives best. Around 1600px wide is plenty; Next resizes and optimises at build time, so there is no need to shrink it first. `.webp` or `.avif` will be noticeably smaller than `.jpg`.

Leave `imageAlt` unset for an ordinary trip photo. The card already names the place beside it, so an empty alt is correct and stops a screen reader saying the same thing twice. Set it only when the photo shows something the name and note do not.

The four files currently in `public/places/` are generated neutral grey stand-ins, not real photographs. Overwrite them and the entries pick the new ones up. If your photos are `.jpg`, update the four `image:` extensions.

### `data/experience.ts` and `data/projects.ts`

Both render as boarding passes. Fields map onto the ticket like this:

| Ticket | Experience | Projects |
| --- | --- | --- |
| Heading | `company` | `title` |
| Under it | `role` | `summary` |
| FROM / TO | `start` / `end` | `start` / `end` |
| LOCATION | `location` | `location` |
| Rest of the card | `bullets` | `tags`, `github`, `demo` |

On Projects, `start`, `end` and `location` are optional: leave them out and that row simply does not render. On Experience they are required.

The flight number and barcode on the stub are decorative. They are derived from each entry's `id`, so they stay the same across rebuilds and change only if you rename an entry.

---

## Theme

Two files, and only two.

1. [`app/globals.css`](app/globals.css) — the `:root` block holds the light palette, `.dark` holds the dark one. Everything on the site reads these tokens, so changing `--background` and `--foreground` changes the whole site.
2. [`data/site.ts`](data/site.ts) — `globeThemes.light` and `globeThemes.dark` hold the globe's colours, which are WebGL and cannot read CSS. Keep them roughly in step with the palette above.

**The site is currently hard set to light.** The last line of `data/site.ts` is:

```ts
export const globeTheme = globeThemes.light;
```

To go dark you need both: switch that to `globeThemes.dark`, and add `class="dark"` to the `<html>` tag in [`app/layout.tsx`](app/layout.tsx).

One thing that is easy to miss: the colours in [`app/opengraph-image.tsx`](app/opengraph-image.tsx) are written as hex separately, because that image renders without a stylesheet and cannot read the tokens. Change the theme and you have to change those by hand too.

### Typography

One typeface, Geist, everywhere. What makes ARRIVALS and DEPARTURES look like airport signage is the uppercase and the wide letter spacing, not a different font. Both live in `app/globals.css`:

- `.board-sign` — the large signage: the home page title, the two page titles, the plane buttons.
- `.board-label` — the small caps labels: FROM, TO, LOCATION, FLIGHT, STACK, PLACES, PREV and NEXT.

They share a letter spacing value on purpose. Use these classes rather than retyping `uppercase tracking-[...]`, which is what made the lettering look inconsistent before.

---

## Tuning the interactive parts

Every number below is a named constant at the top of its file.

### Globe — [`components/ui/cobe-globe.tsx`](components/ui/cobe-globe.tsx)

| Constant | Does |
| --- | --- |
| `AUTO_ROTATE` | Idle spin speed, radians per second |
| `MAX_THETA` | How far it can be tilted before the poles swing into view |
| `DRAG_SENSITIVITY` | Radians of rotation per pixel dragged |
| `MOMENTUM_REMAINING_PER_SECOND` | How fast a flick decays |
| `FOCUS_DURATION` | How long it takes to swing a place to the centre |
| `DEFAULT_MARKER_SIZE` | Pin size |
| `MAP_SAMPLES` | Dot density of the landmasses |

Globe size on screen is set where it is used, in [`app/page.tsx`](app/page.tsx): `w-[min(100cqw,100cqh,30rem)]`. The `30rem` is the cap on large screens; raise it for a bigger globe.

### Ticket deck — [`components/TicketDeck.tsx`](components/TicketDeck.tsx)

| Constant | Does |
| --- | --- |
| `DRAG_PRESETS` | Pull distance and swipe threshold, per screen size |
| `VISIBLE_BEHIND` | How many cards show behind the front one |
| `DEPTH_Y`, `DEPTH_SCALE` | How far each card behind is offset and shrunk |
| `LIFT_MS`, `LIFT_Y`, `LIFT_TILT` | The rise and tilt of the shuffle |
| `TUCK_MS` | How long the card takes to settle at the back |

`MIN_TICKET_HEIGHT` in [`components/Ticket.tsx`](components/Ticket.tsx) is what keeps an Arrivals ticket and a Departures ticket the same size. It is a floor, not a fixed height: if a real entry grows past it, that deck gets taller and the two pages stop matching. Raise the constant to bring them back in line.

### Page transitions

- `WHOOSH_MS` and the `flights` table in [`components/PlaneFlight.tsx`](components/PlaneFlight.tsx) — how far, how fast and at what angle each plane flies. Each axis has its own easing, which is what curves the path; changing only one axis changes the shape of the arc.
- `HERO_FADE_MS` and `ENTER` in [`app/page.tsx`](app/page.tsx) — the home page fade out, and the delays that stagger the entrance.

---

## Things to leave alone unless you mean it

- **`prefers-reduced-motion`** is handled in every animated component. If you add animation, match the pattern.
- **The `noscript` block in `TicketDeck`** un-stacks the deck into a plain list when JavaScript does not run. Without it, only the top ticket would be readable.
- **The home page entrance is CSS, not JavaScript**, on purpose. Driving it from JS meant the server sent `opacity: 0` on every element, so a slow or failed bundle left the page blank.
- **`app/globals.css` `.cobe-*` classes** position the globe's marker buttons using CSS anchor positioning. They depend on how `cobe` names its anchors.

---

## Deploying

This lives on the `redesign` branch of `JummyJoeJackson/portfolio`. That branch **shares no history** with `master`, which still holds the old site, so a normal pull request merge will not work.

To switch the domain over, change the Production Branch in Vercel from `master` to `redesign`. That is reversible and leaves the old site intact, which is why it beats the alternatives:

- Making `redesign` the default branch on GitHub also works, and also keeps `master`.
- `git push origin redesign:master --force` replaces the old site's history outright. Only worth it once the domain is already serving the new build happily.
- Merging is not an option. With no common ancestor, `git merge` needs `--allow-unrelated-histories` and then conflicts on every shared path, since both branches are Next.js apps at the repo root.

---

## Still open

Design decisions are settled and recorded in `WEBSITE_SPEC.md` section 13: light only, arcs on, hook written. What remains is real content, above all the experience entries in `data/experience.ts`, which are still placeholders.
