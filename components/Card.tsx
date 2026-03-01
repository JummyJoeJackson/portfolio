import Link from 'next/link'

interface CardProps {
  year: string
  title: string
  href: string
  description?: string
}

const Card = ({ year, title, href, description }: CardProps) => {
  return (
    <Link href={href} className="group block py-6 border-b border-rule last:border-0 hover:bg-rule/5 transition-colors px-4 -mx-4">
      <div className="flex justify-between items-baseline gap-4">
        <div className="flex gap-12 items-baseline">
          <span className="text-sm mono text-muted w-12 shrink-0">{year}</span>
          <div className="flex flex-col">
            <h3 className="text-xl font-display font-medium group-hover:text-ink transition-colors">
              {title}
            </h3>
            {description && (
              <p className="text-muted text-sm mt-1 mb-0 max-w-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>
        <span className="text-xl text-muted group-hover:text-ink transition-transform duration-200 group-hover:translate-x-1">
          &rarr;
        </span>
      </div>
    </Link>
  )
}

export default Card
