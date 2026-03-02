import { getMDXData } from '@/lib/mdx'
import Card from '@/components/Card'

export const metadata = {
  title: 'Travel',
  description: 'Notes and photos from past travels.',
}

export default async function TravelPage() {
  const allTravel = await getMDXData('travel')

  return (
    <div className="container-reading py-24">
      <header className="mb-24">
        <h1 className="text-ink">Travel</h1>
        <p className="text-muted text-lg max-w-xl">
          Notes and impressions from different corners of the world. No travel hacks, just observations.
        </p>
      </header>

      <div className="flex flex-col">
        {allTravel.map((post) => (
          post.metadata.banner && (
            <link 
              key={`preload-${post.slug}`} 
              rel="preload" 
              as="image" 
              href={post.metadata.banner} 
            />
          )
        ))}
        {allTravel.map((post) => (
          <Card
            key={post.slug}
            year={new Date(post.metadata.date).getFullYear().toString()}
            title={post.metadata.title}
            href={`/travel/${post.slug}`}
          />
        ))}
      </div>
    </div>
  )
}
