/**
 * Single source of truth for identity, links, feature flags and globe colors.
 * Nothing in here should be hardcoded anywhere else in the site.
 */

export const site = {
  name: "Diego Gonzalez",
  /**
   * Absolute origin, used to resolve Open Graph and icon URLs. Social
   * scrapers will not follow a relative path, so this has to be absolute.
   * Vercel preview builds fall back to their own URL, see app/layout.tsx.
   */
  url: "https://diegogonzalez.tech",
  hook: "I turn messy data into something you can use",
  /** Used for the flight-path arc origin in section 5.6. */
  home: {
    label: "Toronto",
    location: [43.6532, -79.3832] as [number, number],
  },
} as const;

export const links = {
  linkedin: "https://www.linkedin.com/in/dgonza-math/",
  github: "https://github.com/JummyJoeJackson",
  email: "d23gonza@uwaterloo.ca",
  resume: "/resume.pdf",
} as const;

export const features = {
  /** Faint arc from home to the selected place while its card is open. */
  homeArc: true,
  /**
   * Also link the open place to every other place. Separate from homeArc and
   * left off: with more than a handful of pins this draws a starburst, which
   * is the opposite of the "noticeable, not flashy" the brief asks for.
   */
  placeToPlaceArcs: false,
} as const;

/**
 * Globe colors, kept here so a light/dark switch is a two-file change
 * (this file plus app/globals.css). Values are cobe's 0..1 RGB tuples.
 */
export type GlobeTheme = {
  dark: number;
  diffuse: number;
  mapBrightness: number;
  baseColor: [number, number, number];
  markerColor: [number, number, number];
  glowColor: [number, number, number];
  arcColor: [number, number, number];
};

export const globeThemes: { light: GlobeTheme; dark: GlobeTheme } = {
  light: {
    dark: 0,
    diffuse: 0.4,
    mapBrightness: 1.2,
    baseColor: [1, 1, 1],
    markerColor: [0.25, 0.25, 0.28],
    glowColor: [0.94, 0.94, 0.94],
    arcColor: [0.45, 0.45, 0.5],
  },
  dark: {
    dark: 1,
    diffuse: 1.2,
    mapBrightness: 6,
    baseColor: [0.22, 0.22, 0.24],
    markerColor: [0.92, 0.92, 0.94],
    glowColor: [0.16, 0.16, 0.18],
    arcColor: [0.7, 0.7, 0.76],
  },
};

/*
  Light only for now. The dark palette above is kept deliberately, both here
  and as the .dark block in globals.css, so switching later is two lines
  rather than a rebuild: point this at globeThemes.dark and add class="dark"
  to the html tag in app/layout.tsx.
*/
export const globeTheme = globeThemes.light;
