'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  visualizerCategories,
  findVisualizer,
  DEFAULT_VISUALIZER_ID,
} from '@/lib/visualizers'
import { VisualizerSidebar } from './VisualizerSidebar'
import styles from './VisualizerLayout.module.css'

const BUBBLE_SORT_CODE = `function bubbleSort(arr) {
  for i from 0 to n-1 {
    for j from 0 to n-i-2 {
      if arr[j] > arr[j+1] {
        swap arr[j] and arr[j+1]
      }
    }
  }
}`

export function VisualizerLayout() {
  const [activeId, setActiveId] = useState(DEFAULT_VISUALIZER_ID)
  const active = findVisualizer(activeId) ?? findVisualizer(DEFAULT_VISUALIZER_ID)!

  return (
    <div className={styles.wrapper}>
      {/* Mobile dropdown — hidden above 768px */}
      <div className={styles.mobileDropdownRow}>
        <select
          className={styles.mobileDropdown}
          value={activeId}
          onChange={(e) => setActiveId(e.target.value)}
          aria-label="Select visualizer"
        >
          {visualizerCategories.map(cat => (
            <optgroup key={cat.title} label={cat.title}>
              {cat.items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={styles.grid}>
        {/* Left sidebar */}
        <aside className={styles.sidebarCol}>
          <VisualizerSidebar
            categories={visualizerCategories}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </aside>

        {/* Main area */}
        <main className={styles.mainCol}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link href="/visualizer" className={styles.breadcrumbLink}>
              Visualizer
            </Link>
            <span className={styles.breadcrumbSep}>·</span>
            <span className={styles.breadcrumbCategory}>{active.category}</span>
            <span className={styles.breadcrumbSep}>·</span>
            <span className={styles.breadcrumbCurrent}>{active.title}</span>
          </nav>

          {/* Header */}
          <div className={styles.header}>
            <p className={styles.categoryLabel}>{active.category}</p>
            <h1 className={styles.title}>{active.title}</h1>
            <Link
              href={`/learn/${active.articleSlug}`}
              className={styles.articleLink}
            >
              read the article on {active.title.toLowerCase()}
            </Link>
          </div>

          {/* Visualizer card */}
          <div className={styles.vizCard}>
            <p className={styles.vizCardLabel}>{active.title.toLowerCase()}</p>

            {/* Placeholder bars — always bubble sort until visualizer logic lands */}
            <div className={styles.barsContainer} aria-hidden="true">
              <div className={`${styles.bar} ${styles.barColor1} ${styles.barH1}`} />
              <div className={`${styles.bar} ${styles.barColor2} ${styles.barH2}`} />
              <div className={`${styles.bar} ${styles.barColor3} ${styles.barH3}`} />
              <div className={`${styles.bar} ${styles.barColor4} ${styles.barH4}`} />
              <div className={`${styles.bar} ${styles.barColor5} ${styles.barH5}`} />
              <div className={`${styles.bar} ${styles.barColor6} ${styles.barH6}`} />
              <div className={`${styles.bar} ${styles.barColor7} ${styles.barH7}`} />
            </div>

            {/* Status bar */}
            <div className={styles.statusBar}>
              — click play to start the visualization —
            </div>

            {/* Controls */}
            <div className={styles.controls}>
              <button type="button" className={styles.btnPlay}>
                ▶ Play
              </button>
              <button type="button" className={styles.btnStep}>
                Next step
              </button>
              <button type="button" className={styles.btnReset}>
                Reset
              </button>
            </div>

            {/* Pseudocode */}
            <pre className={styles.codeBlock}>
              <code>{BUBBLE_SORT_CODE}</code>
            </pre>
          </div>
        </main>
      </div>
    </div>
  )
}
