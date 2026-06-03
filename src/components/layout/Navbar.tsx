'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Learn', href: '/learn' },
  { label: 'Visualizer', href: '/visualizer' },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 flex h-[52px] w-full items-center justify-between border-b border-[#F0EDF8] bg-white px-4 sm:px-8">
      <Link href="/" className="text-[22px]">
        <span className="text-text-primary">DSA</span>
        <span className="text-blue-border">Notes</span>
      </Link>

      <div className="flex items-center gap-2">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={isActive ? 'text-text-primary' : 'text-text-muted'}
              style={
                isActive
                  ? {
                      background: '#FFE4ED',
                      border: '1.5px solid #F4A7B9',
                      borderRadius: '20px',
                      padding: '4px 14px',
                    }
                  : undefined
              }
            >
              {label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
