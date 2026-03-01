import ArrowLink from '@/components/ArrowLink'

export const metadata = {
  title: 'About',
  description: 'Who I am and what I do.',
}

export default function AboutPage() {
  return (
    <div className="container-reading py-24">
      <h1 className="text-ink mb-12">About</h1>
      
      <div className="prose text-lg leading-relaxed text-ink/90">
        <p>
          I'm Diego Gonzalez, a Mathematics student at the University of Waterloo with a deep interest in Software Engineering and Data Science. My work is driven by a desire to take complex systems and distill them into simple and high-quality solutions.
        </p>
        
        <p>
          When I am not studying or building software, you can find me exploring new cultures through travel, working out, or experimenting with new technologies.
        </p>

        <p>
          This website is a reflection of my approach to work and life: unhurried, intentional, and focused on quality over quantity.
        </p>

        <section className="mt-16 not-prose">
          <h2 className="text-sm mono uppercase tracking-widest text-muted mb-6">Connect</h2>
          <div className="flex flex-col space-y-4">
            <ArrowLink href="mailto:[EMAIL_ADDRESS]" external>Email</ArrowLink>
            <ArrowLink href="https://github.com/JummyJoeJackson" external>GitHub</ArrowLink>
            <ArrowLink href="https://linkedin.com/in/diegogonzalez" external>LinkedIn</ArrowLink>
          </div>
        </section>
      </div>
    </div>
  )
}
