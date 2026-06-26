import type { Metadata } from 'next'
import Link from 'next/link'
import { sections } from '@/lib/topics'

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
  { heightClass: 'visBarH60', colorClass: 'visBarPink' },
  { heightClass: 'visBarH90', colorClass: 'visBarBlue' },
  { heightClass: 'visBarH45', colorClass: 'visBarPurple' },
  { heightClass: 'visBarH75', colorClass: 'visBarGreen' },
  { heightClass: 'visBarH55', colorClass: 'visBarYellow' },
  { heightClass: 'visBarH80', colorClass: 'visBarAccent' },
]

export default function HomePage() {
  return (
    <>
      <section aria-label="Hero" className="hero gridHint">
        <div className="heroInner">
          <div className="heroLeft">
            <span className="heroTag">free &amp; beginner friendly</span>
            <h1 className="heroTitle">
              We hold your hand through{' '}
              <span className="heroHighlightPink">every</span>
              {' '}DSA concept,{' '}
              <span className="heroHighlightBlue">step by step.</span>
            </h1>
            <p className="heroDesc">
              No jumps. No what is this moments. Just clear friendly explanations
              and interactive visualizations until you truly get it.
            </p>
            <nav aria-label="Primary actions" className="heroBtns">
              <Link href="/learn" className="btnPink">
                Start learning
              </Link>
              <Link href="/visualizer" className="btnBlue">
                Open visualizer
              </Link>
            </nav>

            <div className="emailRow">
              <span className="emailLabel">Get notified when new articles drop →</span>
              <div className="emailFields">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="emailInput"
                />
                <button type="button" className="emailBtn">Subscribe</button>
              </div>
            </div>
          </div>

          <div className="visPreview" aria-hidden="true">
            <span className="visPreviewLabel">visualizer</span>
            <div className="visBars">
              {VIZ_BARS.map((bar, i) => (
                <div key={i} className={`visBar ${bar.heightClass} ${bar.colorClass}`} />
              ))}
            </div>
            <div className="visCaption">
              <span className="visCaptionStep">step 3 of 8</span>
              <span className="visCaptionDots">
                <span className="visCaptionDotActive" />
                <span className="visCaptionDot" />
                <span className="visCaptionDot" />
              </span>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="How it works" className="howItWorks">
        <div className="howItWorksInner">
          <p className="sectionTag">How it works</p>
          <div className="promiseBox">
            <h2 className="promiseTitle">Every article = one oh I get it moment.</h2>
            <p className="promiseDesc">
              We write every article like a patient friend sitting next to you — no
              jumps, no confusion, until it actually clicks.
            </p>
          </div>
          <div className="steps">
            <article className="stepCardPink">
              <span className="stepNum">01</span>
              <h3 className="stepTitle">Read the article</h3>
              <p className="stepDesc">
                Written like a patient friend sitting next to you. No textbook
                voice, ever.
              </p>
            </article>
            <article className="stepCardBlue">
              <span className="stepNum">02</span>
              <h3 className="stepTitle">Watch it move</h3>
              <p className="stepDesc">
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
          className={`topicSection ${section.color === 'pink' ? 'topicSectionPink' : 'topicSectionBlue'}`}
        >
          <div className="topicSectionInner">
            <div className="sectionHeader">
              <h2 className="sectionTitle">{section.title}</h2>
              <div className="sectionLine" aria-hidden="true" />
              <span className="sectionCount">
                {section.topics.length} articles
              </span>
            </div>
            <div className="topicList">
              {section.topics.map((topic, idx) => (
                <div
                  key={topic.slug}
                  className={`topicRow${idx === section.topics.length - 1 ? ' topicRowLast' : ''}`}
                >
                  <div className="topicCheckbox" aria-hidden="true" />
                  <div className="topicInfo">
                    <span className="topicName">{topic.title}</span>
                    {!topic.comingSoon && (
                      <span className="topicSubtitle">
                        {topic.readTime} read
                      </span>
                    )}
                  </div>
                  {topic.hasVisualizer && !topic.comingSoon && (
                    <span className="pillBlue">visualizer</span>
                  )}
                  {topic.comingSoon && (
                    <span className="pillSoon">coming soon</span>
                  )}
                  {!topic.comingSoon && (
                    <span className="topicArrow" aria-hidden="true">
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
