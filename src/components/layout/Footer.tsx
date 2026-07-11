'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FeedbackForm } from "../FeedbackForm"

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
]

export function Footer() {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <footer className="footer">
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <span className="footerLogo">
          DSA<span className="footerLogoAccent">Notes</span>
        </span>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {FOOTER_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="text-[13px] text-text-muted">
              {label}
            </Link>
          ))}

          <button
            onClick={() => setFeedbackOpen(true)}
            aria-label="Open feedback form"
            className="
               text-[13px] text-text-muted border border-text-muted rounded px-2 py-1
            "
          >
            Send Feedback
          </button>
        </div>

          

        <span className="text-text-muted">free, always.</span>
      </div>

          

      <FeedbackForm
        isOpen={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </footer>
  )
}