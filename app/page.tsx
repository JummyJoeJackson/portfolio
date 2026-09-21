import { NavPlane } from "@/components/NavPlane";
import { SocialLinks } from "@/components/SocialLinks";
import { TravelGlobe } from "@/components/TravelGlobe";
import { site } from "@/data/site";

export default function Home() {
  return (
    <main className="grid h-dvh grid-rows-[auto_minmax(0,1fr)_auto] gap-y-[clamp(0.5rem,2dvh,1.5rem)] overflow-hidden px-6 py-[clamp(0.75rem,3dvh,2rem)]">
      {/*
        Hero text. Not a header: no bar, no border, no background band, it is
        plain centered text that belongs to the hero.
      */}
      <div className="text-center">
        <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
          {site.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          {site.hook}
        </p>
      </div>

      {/*
        Middle row. On md and up the globe sits in a centre track flanked by
        the two plane buttons; below md the globe takes a full width row with
        the buttons side by side underneath it.

        The side tracks are symmetric (1fr / 2fr / 1fr) so the globe is exactly
        centred and the gap to each button is equal no matter how wide the two
        labels are. That also keeps the centre cell a definite size, which lets
        the circle size itself off the cell with container query units instead
        of overflowing the row.
      */}
      <div className="grid min-h-0 grid-cols-2 grid-rows-[minmax(0,1fr)_auto] gap-x-[clamp(1rem,6vw,2rem)] gap-y-[clamp(0.5rem,2dvh,1.5rem)] md:grid-cols-[1fr_2fr_1fr] md:grid-rows-1 md:gap-x-[clamp(1rem,4vw,3rem)]">
        <div className="col-span-2 col-start-1 row-start-1 grid min-h-0 min-w-0 place-items-center [container-type:size] md:col-span-1 md:col-start-2">
          <TravelGlobe className="aspect-square w-[min(100cqw,100cqh,30rem)]" />
        </div>

        <NavPlane
          direction="arrivals"
          className="col-start-1 row-start-2 justify-self-end md:col-start-1 md:row-start-1 md:self-center"
        />
        <NavPlane
          direction="departures"
          className="col-start-2 row-start-2 justify-self-start md:col-start-3 md:row-start-1 md:self-center"
        />
      </div>

      <SocialLinks />
    </main>
  );
}
