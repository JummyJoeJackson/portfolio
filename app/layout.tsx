import type { Metadata } from 'next'
import Image from 'next/image'
import './globals.css'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: {
    template: '%s | Diego Gonzalez',
    default: 'Diego Gonzalez — SWE & DS',
  },
  description: 'Personal website of Diego Gonzalez, a Mathematics student at the University of Waterloo specializing in Software Engineering and Data Science.',
  openGraph: {
    title: 'Diego Gonzalez',
    description: 'Software Engineering & Data Science',
    url: 'https://diegogonzalez.tech',
    siteName: 'Diego Gonzalez',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased selection:bg-rule/30">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main>{children}</main>
          <footer className="py-12 container-wide text-muted text-sm mono uppercase tracking-widest flex flex-row items-center justify-center gap-4">
            <span>&copy; {new Date().getFullYear()} Diego Gonzalez. Last Updated: 12:23 PM, June 4th.</span>
              <div className="flex items-center gap-2">
                <a href="https://math-webring.vercel.app/#diegogonzalez.tech?nav=prev">←</a>
                <a href="https://math-webring.vercel.app/#diegogonzalez.tech" target="_blank">
                  <Image
                    src="https://math-webring.vercel.app/math-webring-pink.svg"
                    alt="Math Webring"
                    width={25}
                    height={25}
                    unoptimized
                  />
                </a>
                <a href="https://math-webring.vercel.app/#diegogonzalez.tech?nav=next">→</a>
              </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
