const FOOTER_LINKS = ['About', 'Contact', 'Privacy policy', 'Terms of use']

export function Footer() {
  return (
    <footer
      style={{
        background: '#FFF0F5',
        borderTop: '1.5px solid #F4A7B9',
        padding: '24px 32px',
      }}
    >
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <span className="text-[22px]">
          <span style={{ color: '#2D2D2D' }}>DSA</span>
          <span style={{ color: '#90C8F0' }}>Notes</span>
        </span>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {FOOTER_LINKS.map((label) => (
            <a
              key={label}
              href="#"
              className="text-[13px] text-text-muted"
            >
              {label}
            </a>
          ))}
        </div>

        <span className="text-text-muted">free, always.</span>
      </div>
    </footer>
  )
}
