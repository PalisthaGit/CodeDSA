import type { Metadata } from 'next'
import Link from 'next/link'
import { sections } from '@/lib/topics'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'DSANotes — Learn DSA free, step by step',
  description:
    'Learn data structures and algorithms with clear explanations and interactive visualizers. Free forever. No jumps, no confusion — just clear learning until you get it.',
  keywords: [
    'DSA',
    'data structures',
    'algorithms',
    'learn DSA free',
    'DSA visualizer',
    'beginner DSA',
    'arrays',
    'sorting',
    'graphs',
  ],
  openGraph: {
    title: 'DSANotes — Learn DSA free, step by step',
    description:
      'Learn data structures and algorithms with clear explanations and interactive visualizers. Free forever. No jumps, no confusion — just clear learning until you get it.',
    type: 'website',
  },
}

const VIZ_BARS = [
  { heightClass: styles.barH60, colorClass: styles.barPink },
  { heightClass: styles.barH90, colorClass: styles.barBlue },
  { heightClass: styles.barH45, colorClass: styles.barPurple },
  { heightClass: styles.barH75, colorClass: styles.barGreen },
  { heightClass: styles.barH55, colorClass: styles.barYellow },
  { heightClass: styles.barH80, colorClass: styles.barAccent },
]

export default function HomePage() {
  return (
    <>
      <section aria-label="Hero" className={`${styles.hero} grid-hint`}>
        <div className={styles.heroInner}>
          <div className={styles.heroText}>
            <span className={styles.heroTag}>free &amp; beginner friendly</span>
            <h1 className={styles.heroTitle}>
              We hold your hand through{' '}
              <span className={styles.highlightPink}>every</span>
              {' '}DSA concept,{' '}
              <span className={styles.highlightBlue}>step by step.</span>
            </h1>
            <p className={styles.heroDesc}>
              No jumps. No what is this moments. Just clear friendly explanations
              and interactive visualizations until you truly get it.
            </p>
            <nav aria-label="Primary actions" className={styles.heroButtons}>
              <Link href="/learn" className={styles.btnPrimary}>
                Start learning
              </Link>
              <Link href="/visualizer" className={styles.btnSecondary}>
                Open visualizer
              </Link>
            </nav>

            <div className={styles.emailRow}>
              <span className={styles.emailLabel}>Get notified when new articles drop →</span>
              <div className={styles.emailFields}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className={styles.emailInput}
                />
                <button type="button" className={styles.emailBtn}>Subscribe</button>
              </div>
            </div>
          </div>

          <div className={styles.visualizerPreview} aria-hidden="true">
            <span className={styles.vizLabel}>visualizer</span>
            <div className={styles.vizBarsWrapper}>
              {VIZ_BARS.map((bar, i) => (
                <div key={i} className={`${styles.vizBar} ${bar.heightClass} ${bar.colorClass}`} />
              ))}
            </div>
            <div className={styles.vizFooter}>
              <span className={styles.vizStep}>step 3 of 8</span>
              <span className={styles.vizDots}>
                <span className={styles.vizDotActive} />
                <span className={styles.vizDot} />
                <span className={styles.vizDot} />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="How it works" className={styles.howItWorks}>
        <div className={styles.howItWorksInner}>
          <p className={styles.howItWorksLabel}>How it works</p>
          <div className={styles.promiseBox}>
            <h2 className={styles.promiseTitle}>Every article = one oh I get it moment.</h2>
            <p className={styles.promiseDesc}>
              We write every article like a patient friend sitting next to you — no
              jumps, no confusion, until it actually clicks.
            </p>
          </div>
          <div className={styles.stepCards}>
            <article className={styles.stepCardPink}>
              <span className={styles.stepNumber}>01</span>
              <h3 className={styles.stepTitle}>Read the article</h3>
              <p className={styles.stepDesc}>
                Written like a patient friend sitting next to you. No textbook
                voice, ever.
              </p>
            </article>
            <article className={styles.stepCardBlue}>
              <span className={styles.stepNumber}>02</span>
              <h3 className={styles.stepTitle}>Watch it move</h3>
              <p className={styles.stepDesc}>
                See the algorithm run step by step in the interactive visualizer.
              </p>
            </article>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          aria-label={section.title}
          className={`${styles.topicSection} ${
            section.color === 'pink' ? styles.topicSectionPink : styles.topicSectionBlue
          }`}
        >
          <div className={styles.topicSectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.sectionLine} aria-hidden="true" />
              <span className={styles.articleCount}>
                {section.topics.length} articles
              </span>
            </div>
            <div className={styles.topicList}>
              {section.topics.map((topic, idx) => (
                <div
                  key={topic.slug}
                  className={`${styles.topicRow} ${
                    idx === section.topics.length - 1 ? styles.topicRowLast : ''
                  }`}
                >
                  <div className={styles.checkbox} aria-hidden="true" />
                  <div className={styles.topicInfo}>
                    <span className={styles.topicTitle}>{topic.title}</span>
                    {!topic.comingSoon && (
                      <span className={styles.topicReadTime}>
                        {topic.readTime} read
                      </span>
                    )}
                  </div>
                  {topic.hasVisualizer && !topic.comingSoon && (
                    <span className={styles.pillVisualizer}>visualizer</span>
                  )}
                  {topic.comingSoon && (
                    <span className={styles.pillComingSoon}>coming soon</span>
                  )}
                  {!topic.comingSoon && (
                    <span className={styles.topicArrow} aria-hidden="true">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}
