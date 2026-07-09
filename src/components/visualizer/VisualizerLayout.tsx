import Link from 'next/link'
import type { Visualizer } from '@/lib/visualizers'
import { visualizerCategories } from '@/lib/visualizers'
import { VisualizerSidebar } from './VisualizerSidebar'
import { VisualizerMobileSelect } from './VisualizerMobileSelect'
import { ArrayVisualizer } from './ArrayVisualizer'
import { LinearSearchVisualizer } from './LinearSearchVisualizer'
import { BinarySearchVisualizer } from './BinarySearchVisualizer'
import { StackVisualizer } from './StackVisualizer'
import { GraphVisualizer } from './GraphVisualizer'
import { SortingVisualizer } from './SortingVisualizer'
import { KMPVisualizer } from './KMPVisualizer'

interface Props {
  active: Visualizer
  articleSlugs: string[]
}

export function VisualizerLayout({ active, articleSlugs }: Props) {
  const hasArticle = articleSlugs.includes(active.articleSlug)

  return (
    <div className="visualizerLayout">
      <VisualizerMobileSelect categories={visualizerCategories} activeId={active.id} />

      <div className="vizGrid">
        <aside className="visualizerSidebar">
          <VisualizerSidebar
            categories={visualizerCategories}
            activeId={active.id}
          />
        </aside>

        <main className="visualizerMain">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link href="/visualizer" className="breadcrumbLink">
              Visualizer
            </Link>
            <span className="breadcrumbSep">·</span>
            <span className="breadcrumbSection">{active.category}</span>
            <span className="breadcrumbSep">·</span>
            <span className="breadcrumbCurrent">{active.title}</span>
          </nav>

          <div className="visualizerHeader">
            <p className="visualizerTag">{active.category}</p>
            <h1 className="visualizerTitle">{active.title}</h1>
            {hasArticle && (
              <Link
                href={`/learn/${active.articleSlug}`}
                className="readArticleLink"
              >
                read the article on {active.title.toLowerCase()}
              </Link>
            )}
          </div>

          {active.id === 'array' ? (
            <ArrayVisualizer />
          ) : active.id === 'stack' ? (
            <StackVisualizer />
          ) : active.id === 'linear-search' ? (
            <LinearSearchVisualizer />
          ) : active.id === 'binary-search' ? (
            <BinarySearchVisualizer />
          ) : active.category === 'Sorting' ? (
            <SortingVisualizer algorithmId={active.id} />
          ) : active.category === 'Graph algorithms' ? (
            <GraphVisualizer algorithm={active.id} />
          ) : active.id === 'kmp' ? (
            <KMPVisualizer />
          ) : (
            <div className="visualizerCard">
              <p className="visualizerCardLabel">{active.title.toLowerCase()}</p>

              <div className="placeholderBars" aria-hidden="true">
                <div className="placeholderBar placeholderBarC1 placeholderBarH1" />
                <div className="placeholderBar placeholderBarC2 placeholderBarH2" />
                <div className="placeholderBar placeholderBarC3 placeholderBarH3" />
                <div className="placeholderBar placeholderBarC4 placeholderBarH4" />
                <div className="placeholderBar placeholderBarC5 placeholderBarH5" />
                <div className="placeholderBar placeholderBarC6 placeholderBarH6" />
                <div className="placeholderBar placeholderBarC7 placeholderBarH7" />
              </div>

              <div className="statusBar">
                — click play to start the visualization —
              </div>

              <div className="visControls">
                <button type="button" className="visBtnPlay">
                  ▶ Play
                </button>
                <button type="button" className="visBtnStep">
                  Next step
                </button>
                <button type="button" className="visBtnReset">
                  Reset
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
