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
    <div className="container-reading py-14">
      <header className="mb-24">
        <h1 className="text-ink">
          Diego Gonzalez
        </h1>
        <p className="text-xl text-ink max-w-xl leading-relaxed">
          Data Science at the University of Waterloo. I build high-quality software and explore data through a lens of simplicity and intentionality.
        </p>
        <p className="text-muted text-lg max-w-xl">
          I&apos;m currently focused on building the next generation of AI in Computer Vision and Machine Learning. I believe in making things that feel well-made, like a good book.
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

      <section className="mb-24">
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

      <section>
        <div className="flex justify-between items-baseline mb-8">
          <h2 className="text-sm mono uppercase tracking-widest text-muted m-0">Get In Touch</h2>
        </div>
        <div className="flex flex-col">
          <p className="text-muted text-lg max-w-xl">
            I&apos;m looking to build an impactful Winter 2027 co-op term in Software Engineering, Data Science, or AI. If you&apos;re working on something interesting and looking for a curious mind to join the team, I&apos;d love to connect.
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <ArrowLink href="mailto:d23gonza@uwaterloo.ca" external>Email</ArrowLink>
          <ArrowLink href="https://github.com/JummyJoeJackson" external>GitHub</ArrowLink>
          <ArrowLink href="https://linkedin.com/in/dgonza-math" external>LinkedIn</ArrowLink>
        </div>
      </section>
    </div>
  )
}
