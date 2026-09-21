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
  /** e.g. "/places/tokyo.jpg" */
  image?: string;
};

/**
 * PLACEHOLDER DATA. Replace with real trips and photos in public/places/.
 * Defined at module level so the reference stays stable across renders.
 */
export const places: Place[] = [
  {
    id: "tokyo",
    label: "Tokyo",
    name: "Tokyo, Japan",
    location: [35.6762, 139.6503],
    date: "Placeholder date",
    note: "Placeholder note. Replace this entry with a real trip.",
  },
  {
    id: "lisbon",
    label: "Lisbon",
    name: "Lisbon, Portugal",
    location: [38.7223, -9.1393],
    date: "Placeholder date",
    note: "Placeholder note. Replace this entry with a real trip.",
  },
  {
    id: "mexico-city",
    label: "Mexico City",
    name: "Mexico City, Mexico",
    location: [19.4326, -99.1332],
    date: "Placeholder date",
    note: "Placeholder note. Replace this entry with a real trip.",
  },
  {
    id: "reykjavik",
    label: "Reykjavik",
    name: "Reykjavik, Iceland",
    location: [64.1466, -21.9426],
    date: "Placeholder date",
    note: "Placeholder note. Replace this entry with a real trip.",
  },
];

export function getPlace(id: string): Place | undefined {
  return places.find((place) => place.id === id);
}
