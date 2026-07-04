'use client'

import { useState } from 'react'
import type { ArticleHeading } from '@/lib/articles'

interface MobileTOCToggleProps {
  headings: ArticleHeading[]
}

export function MobileTOCToggle({ headings }: MobileTOCToggleProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mobileTocToggleWrap">
      <button
        className="mobileTocBtn"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close table of contents' : 'Open table of contents'}
        aria-expanded={open}
      >
        {open ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line x1="2" y1="2" x2="14" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
            <line x1="14" y1="2" x2="2" y2="14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )}
      </button>

      {open && (
        <div className="mobileTocDropdown">
          <p className="mobileTocDropdownLabel">On this page</p>
          <ul className="mobileTocDropdownList">
            {headings.map(heading => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className="mobileTocDropdownItem"
                  onClick={() => setOpen(false)}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
