'use client'

import { useState, useEffect } from 'react'
import type { ArticleSection } from '@/lib/articles'
import styles from './StickySidebar.module.css'

interface StickySidebarProps {
  sections: ArticleSection[]
}

export function StickySidebar({ sections }: StickySidebarProps) {
  const [activeId, setActiveId] = useState<string>('')

  const headings = sections
    .filter(s => s.type === 'h2')
    .map(s => ({ id: s.id, heading: s.content ?? '' }))

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
    <aside className={styles.sticky}>
      <div className={styles.note}>
        <p className={styles.noteLabel}>On this page</p>
        <ul className={styles.sectionList}>
          {headings.map(heading => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`${styles.sectionLink} ${activeId === heading.id ? styles.sectionLinkActive : ''}`}
              >
                <span className={styles.dash}>—</span>
                {heading.heading}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}
