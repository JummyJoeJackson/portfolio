import Image from 'next/image'

export const metadata = {
  title: 'About',
  description: 'Who I am and what I do.',
}

export default function AboutPage() {
  return (
    <div className="container-reading py-14">
      <h1 className="text-ink mb-12">About</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 items-start">
        <div className="prose text-lg leading-relaxed text-ink/90">
          <p>
            I am Diego Gonzalez, a Data Science student at the University of Waterloo with a deep interest in Software Engineering and AI. My work is driven by a desire to take complex systems and distill them into simple and high-quality solutions.
          </p>
          
          <p>
            When I am not studying or building software, you can find me exploring new cultures through travel, working out, or experimenting with new technologies.
          </p>

          <p>
            This website is a reflection of my approach to work and life: unhurried, intentional, and focused on quality over quantity.
          </p>
        </div>
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="/assets/about/diego.webp"
            alt="Diego Gonzalez"
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  )
}
