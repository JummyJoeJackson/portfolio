import { getMDXData } from '@/lib/mdx'
import Card from '@/components/Card'

export const metadata = {
  title: 'Work',
  description: 'A selection of projects I have worked on.',
}

export default async function WorkPage() {
  const allWork = await getMDXData('work')

  return (
    <div className="container-reading py-24">
      <header className="mb-24">
        <h1 className="text-ink">Work</h1>
        <p className="text-muted text-lg max-w-xl">
          A collection of projects and experiments. I enjoy building tools that solve problems and exploring the intersection of data and software.
        </p>
      </header>

      <div className="flex flex-col">
        {allWork.map((post) => (
          <Card
            key={post.slug}
            year={new Date(post.metadata.date).getFullYear().toString()}
            title={post.metadata.title}
            href={`/work/${post.slug}`}
            description={post.metadata.description}
          />
        ))}
      </div>
    </div>
  )
}
