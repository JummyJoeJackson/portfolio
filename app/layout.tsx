import type { Metadata } from 'next'
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
          <footer className="py-24 container-wide text-muted text-sm mono uppercase tracking-widest">
            &copy; {new Date().getFullYear()} Diego Gonzalez.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
