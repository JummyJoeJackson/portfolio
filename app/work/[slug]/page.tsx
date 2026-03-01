import { getMDXBySlug, getMDXData } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'

export async function generateStaticParams() {
  const allWork = await getMDXData('work')
  return allWork.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getMDXBySlug('work', params.slug)
  if (!post) return {}

  return {
    title: post.metadata.title,
    description: post.metadata.description,
  }
}

export default async function WorkDetail({ params }: { params: { slug: string } }) {
  const post = await getMDXBySlug('work', params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container-reading py-24 prose">
      <header className="mb-12 not-prose">
        <span className="text-sm mono text-muted uppercase tracking-widest block mb-4">
          {new Date(post.metadata.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-medium text-ink mb-0">
          {post.metadata.title}
        </h1>
      </header>
      <MDXRemote source={post.content} />
    </article>
  )
}
