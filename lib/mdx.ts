import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export async function getMDXData(type: 'work' | 'travel') {
  const dir = path.join(contentDirectory, type)
  
  if (!fs.existsSync(dir)) {
    return []
  }

  const files = fs.readdirSync(dir)

  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = path.join(dir, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      const slug = file.replace(/\.mdx$/, '')

      return {
        slug,
        metadata: data,
        content,
      }
    })
    .filter((post) => !post.metadata.draft) // Exclude drafts
    .sort((a, b) => new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime())
}

export async function getMDXBySlug(type: 'work' | 'travel', slug: string) {
  const filePath = path.join(contentDirectory, type, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    slug,
    metadata: data,
    content,
  }
}
