'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Learn', href: '/learn' },
  { label: 'Visualizer', href: '/visualizer' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 flex h-[52px] w-full items-center justify-between border-b border-purple-border bg-background px-4 sm:px-8">
      <Link href="/" className="text-[22px]">
        <span className="text-text-primary">DSA</span>
        <span className="text-blue-border">Notes</span>
      </Link>

      <div className="flex items-center gap-2">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? `text-text-primary ${styles.linkActive}` : 'text-text-muted'}
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
