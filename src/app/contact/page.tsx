import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — DSANotes',
  description: 'Found a mistake in an article? Have a suggestion? Just want to say hi? We read every message and try to respond within 2–3 business days.',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
}

const content = fs.readFileSync(
  path.join(process.cwd(), 'src/content/contact.html'),
  'utf-8'
)

export default function ContactPage() {
  return (
    <div className="contactPage">
      <div className="contactInner" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
