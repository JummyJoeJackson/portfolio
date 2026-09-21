import { site } from "@/data/site";

// Phase 1 placeholder. The real hero grid is built in Phase 2.
export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center justify-center gap-2 overflow-hidden px-6 text-center">
      <h1 className="text-2xl font-medium tracking-tight">{site.name}</h1>
      <p className="text-sm text-muted-foreground">{site.hook}</p>
    </main>
  );
}
