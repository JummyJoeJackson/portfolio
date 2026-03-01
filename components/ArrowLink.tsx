import Link from 'next/link'

interface ArrowLinkProps {
  href: string
  children: React.ReactNode
  external?: boolean
}

const ArrowLink = ({ href, children, external }: ArrowLinkProps) => {
  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group inline-flex items-center hover:text-muted transition-colors duration-200"
    >
      {children}
      <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        ↗
      </span>
    </Link>
  )
}

export default ArrowLink
