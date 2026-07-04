'use client'

import { useState, useEffect } from 'react'
import type { ArticleHeading } from '@/lib/articles'

interface StickySidebarProps {
  headings: ArticleHeading[]
}

export function StickySidebar({ headings }: StickySidebarProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <aside className="stickySidebar">
      <div className="onThisPage">
        <p className="onThisPageLabel">On this page</p>
        <ul className="onThisPageList">
          {headings.map((heading, i) => {
            const isActive = activeId === heading.id
            return (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`onThisPageItem${isActive ? ' onThisPageItemActive' : ''}`}
                >
                  {heading.text}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}
