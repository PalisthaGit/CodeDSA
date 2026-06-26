import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — DSANotes',
  description: 'How DSANotes collects, uses, and protects your personal data.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'src/content/privacy.html'),
  'utf-8'
)

export default function PrivacyPage() {
  return (
    <div className="legalPage">
      <div className="legalInner" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
