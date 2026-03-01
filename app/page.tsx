import Card from '@/components/Card'
import ArrowLink from '@/components/ArrowLink'

export default function Home() {
  const featuredWork = [
    { year: '2024', title: 'Midas', href: '/work/midas', description: 'AI-powered fraud detection prototype with high-end visualization.' },
    { year: '2024', title: 'SignCLI', href: '/work/sign-cli', description: 'Command-line tool for signing and verifying files with ease.' },
  ]

  const recentTravel = [
    { year: '2024', title: 'A Summer in Japan', href: '/travel/japan' },
    { year: '2023', title: 'Notes on Northern Italy', href: '/travel/italy' },
  ]

  return (
    <div className="container-reading py-24">
      <header className="mb-24">
        <h1 className="text-ink">
          Diego Gonzalez
        </h1>
        <p className="text-xl text-ink max-w-xl leading-relaxed">
          Mathematics student at the University of Waterloo. I build high-quality software and explore data through a lens of simplicity and intentionality.
        </p>
        <p className="text-muted text-lg max-w-xl">
          Currently focused on Software Engineering and Data Science. I believe in making things that feel well-made, like a good book.
        </p>
      </header>

      <section className="mb-24">
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-sm mono uppercase tracking-widest text-muted m-0">Selected Work</h2>
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
          <h2 className="text-sm mono uppercase tracking-widest text-muted m-0">Recent Travel</h2>
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
