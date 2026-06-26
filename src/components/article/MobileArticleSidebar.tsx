'use client'

import { useEffect } from 'react'
import { useMobileSidebar } from '@/lib/MobileSidebarContext'

interface MobileArticleSidebarProps {
  children: React.ReactNode
}

export function MobileArticleSidebar({ children }: MobileArticleSidebarProps) {
  const { open, setOpen } = useMobileSidebar()

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && (
        <div
          className="mobileSidebarOverlay"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className={`mobileSidebarDrawer${open ? ' mobileSidebarDrawerOpen' : ''}`}>
        <button
          className="mobileSidebarClose"
          onClick={() => setOpen(false)}
          aria-label="Close topics menu"
        >
          ✕
        </button>
        {children}
      </div>
    </>
  )
}
