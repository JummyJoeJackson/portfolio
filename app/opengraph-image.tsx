import { ImageResponse } from "next/og";

import { site } from "@/data/site";

// Middot, not an em dash: section 12 rules them out of site copy.
export const alt = `${site.name} · ${site.hook}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/*
  Link preview card. Generated at build time rather than shipped as a static
  asset, so the name and hook stay in step with data/site.ts.

  Colours are the light theme tokens written as hex: this renders through
  Satori, which does not understand oklch, and it has no access to the
  stylesheet anyway. Keep them in step with globals.css by hand.

  Satori supports a subset of CSS built around flexbox, so every container
  here sets display flex explicitly.
*/
const COLORS = {
  background: "#fafafa",
  foreground: "#1f1f1f",
  muted: "#6f6f6f",
  border: "#e4e4e4",
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: COLORS.background,
          color: COLORS.foreground,
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            color: COLORS.muted,
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          {/* PlaneTakeoff, the same mark as the favicon. */}
          <svg
            width="34"
            height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.muted}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 22h20" />
            <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
          </svg>
          <span>Departures</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 88, letterSpacing: "-0.02em" }}>
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: "18px",
              fontSize: 34,
              color: COLORS.muted,
            }}
          >
            {site.hook}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: `1px solid ${COLORS.border}`,
            paddingTop: "28px",
            fontSize: 24,
            color: COLORS.muted,
          }}
        >
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    size,
  );
}
