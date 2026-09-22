export type Place = {
  /** Unique, lowercase, used for CSS anchors. Letters, numbers and hyphens only. */
  id: string;
  /** Short name shown on hover, e.g. "Tokyo". */
  label: string;
  /** Full name for the card, e.g. "Tokyo, Japan". */
  name: string;
  /** [lat, lng] */
  location: [number, number];
  /** e.g. "Summer 2024" */
  date: string;
  /** One or two short sentences. */
  note: string;
  /**
   * Optional photo for the card, as a path under public/.
   *
   * To add one: drop the file in public/places/ and set this to
   * "/places/<file>". Anything the browser reads works, though .webp or .avif
   * will be a good deal smaller than .jpg for the same quality. The card crops
   * it to 3:2 and fills the frame, so a landscape shot survives best; a
   * portrait one loses its top and bottom.
   *
   * Next optimises and resizes it at build time, so there is no need to shrink
   * it first. Around 1600px wide is plenty, since the card never shows it
   * larger than about 290px.
   */
  image?: string;
  /**
   * What the photo shows, for screen readers.
   *
   * Leave it unset for an ordinary trip photo. The card already names the
   * place next to it, so an empty alt is correct and stops a screen reader
   * reading the same thing twice. Set it only when the photo carries
   * something the name and note do not.
   */
  imageAlt?: string;
};

/**
 * PLACEHOLDER DATA. Replace with real trips and photos in public/places/.
 *
 * The images are neutral generated stand-ins, not real photographs, so the
 * card's photo path is exercised before the real ones arrive. Overwrite the
 * files in public/places/ and the entries pick them up.
 * Defined at module level so the reference stays stable across renders.
 */
export const places: Place[] = [
  {
    id: "tokyo",
    label: "Tokyo",
    name: "Tokyo, Japan",
    location: [35.6762, 139.6503],
    date: "July 2024",
    note: "From the bustling streets of Shibuya to the peaceful temples of Asakusa, Tokyo was an unforgettable blend of tradition and futurism.",
    image: "/places/tokyo.png",
  },
  {
    id: "paris",
    label: "Paris",
    name: "Paris, France",
    location: [48.8566, 2.3522],
    date: "August 2025",
    note: "A weekend trip to celebrate a birthday with family. Caught the Eiffel Tower sparkle show and ate my weight in croissants.",
    image: "/places/paris.png",
  },
  {
    id: "mexico-city",
    label: "Mexico City",
    name: "Mexico City, Mexico",
    location: [19.4326, -99.1332],
    date: "Placeholder date",
    note: "Placeholder note. Replace this entry with a real trip.",
    image: "/places/mexico-city.png",
  },
  {
    id: "rome",
    label: "Rome",
    name: "Rome, Italy",
    location: [41.9028, 12.4964],
    date: "March 2024",
    note: "School trip. Ate the best carbonara of my life.",
    image: "/places/rome.png",
  },
];

export function getPlace(id: string): Place | undefined {
  return places.find((place) => place.id === id);
}
