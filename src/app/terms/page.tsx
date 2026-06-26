import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use — DSANotes',
  description: 'The terms governing your use of DSANotes, a free educational platform for Data Structures and Algorithms.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'src/content/terms.html'),
  'utf-8'
)

export default function TermsPage() {
  return (
    <div className="legalPage">
      <div className="legalInner" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
