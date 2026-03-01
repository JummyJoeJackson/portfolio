import { MetadataRoute } from 'next'
import { getMDXData } from '@/lib/mdx'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://diegogonzalez.tech'

  const work = await getMDXData('work')
  const travel = await getMDXData('travel')

  const workRoutes = work.map((post) => ({
    url: `${baseUrl}/work/${post.slug}`,
    lastModified: new Date(post.metadata.date),
  }))

  const travelRoutes = travel.map((post) => ({
    url: `${baseUrl}/travel/${post.slug}`,
    lastModified: new Date(post.metadata.date),
  }))

  const routes = ['', '/work', '/travel', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }))

  return [...routes, ...workRoutes, ...travelRoutes]
}
