import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
]

export function Footer() {
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
        </div>

        <span className="text-text-muted">free, always.</span>
      </div>
    </footer>
  )
}
