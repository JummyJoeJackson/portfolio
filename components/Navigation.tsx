import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const Navigation = () => {
  const navLinks = [
    { name: 'Work', href: '/work' },
    { name: 'Travel', href: '/travel' },
    { name: 'About', href: '/about' },
  ]

  return (
    <nav className="py-8 md:py-12 flex flex-col md:flex-row justify-between items-center gap-y-6 md:gap-y-0 container-wide">
      <Link href="/" className="text-xl font-display font-medium">
        Diego Gonzalez
      </Link>
      <div className="flex items-center space-x-4 md:space-x-8">
        <div className="flex space-x-4 md:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm mono uppercase tracking-widest text-muted hover:text-ink transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navigation
