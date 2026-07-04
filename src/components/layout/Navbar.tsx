'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useMobileSidebar } from '@/lib/MobileSidebarContext'

const NAV_LINKS = [
  { label: 'Learn', href: '/learn' },
  { label: 'Visualizer', href: '/visualizer' },
]

export function Navbar() {
  const pathname = usePathname()
  const { setOpen: setSidebarOpen } = useMobileSidebar()

  const isLearnPage = pathname.startsWith('/learn/')

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname, setSidebarOpen])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-purple-border bg-background">
      <div className="flex h-[52px] w-full items-center justify-between px-4 sm:px-8">
        {/* Left side: sidebar hamburger (learn pages only, hidden on desktop) + logo */}
        <div className="flex items-center gap-2">
          {isLearnPage && (
            <button
              className="navHamburger flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-md hover:bg-purple-light transition-colors duration-200"
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Open topics menu"
            >
              <span className="block w-5 h-[2px] bg-text-primary rounded" />
              <span className="block w-5 h-[2px] bg-text-primary rounded" />
              <span className="block w-5 h-[2px] bg-text-primary rounded" />
            </button>
          )}
          <Link href="/" className="text-[22px]">
            <span className="text-text-primary">DSA</span>
            <span className="text-blue-border">Notes</span>
          </Link>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                className={isActive ? 'text-text-primary navLinkActive' : 'text-text-muted hover:text-text-primary py-1.5 px-3 rounded-full transition-colors duration-200'}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
