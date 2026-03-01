import Card from '@/components/Card'
import ArrowLink from '@/components/ArrowLink'

export default function Home() {
  const featuredWork = [
    { year: '2026', title: 'Midas', href: '/work/midas', description: 'AR-powered Repair Assistant' },
    { year: '2026', title: 'SignCLI', href: '/work/sign-cli', description: 'Command-line tool that teaches sign language' },
  ]

  const recentTravel = [
    { year: '2025', title: 'A Brief Chaos in Europe', href: '/travel/europe'},
    { year: '2024', title: 'A Summer in Japan', href: '/travel/japan' },
  ]

  return (
    <div className="container-reading py-24">
      <header className="mb-24">
        <h1 className="text-ink">
          Diego Gonzalez
        </h1>
        <p className="text-xl text-ink max-w-xl leading-relaxed">
          Mathematics at the University of Waterloo. I build high-quality software and explore data through a lens of simplicity and intentionality.
        </p>
        <p className="text-muted text-lg max-w-xl">
          Currently focused on Software Engineering and Data Science. I believe in making things that feel well-made, like a good book.
        </p>
      </header>

      <section className="mb-24">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-sm mono uppercase tracking-widest text-muted m-0">Selected Works</h2>
          <ArrowLink href="/work">View all</ArrowLink>
        </div>
        <div className="flex flex-col">
          {featuredWork.map((item) => (
            <Card key={item.title} {...item} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-sm mono uppercase tracking-widest text-muted m-0">Recent Travels</h2>
          <ArrowLink href="/travel">View all</ArrowLink>
        </div>
        <div className="flex flex-col">
          {recentTravel.map((item) => (
            <Card key={item.title} {...item} />
          ))}
        </div>
      </section>
    </div>
  )
}
