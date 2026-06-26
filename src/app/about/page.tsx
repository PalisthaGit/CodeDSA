import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About — DSANotes',
  description: 'DSANotes is a free DSA learning site built to make data structures and algorithms make sense — starting from zero assumptions.',
  alternates: { canonical: '/about' },
  robots: { index: true, follow: true },
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'src/content/about.html'),
  'utf-8'
)

export default function AboutPage() {
  return (
    <div className="aboutPage">
      <div className="aboutInner" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
