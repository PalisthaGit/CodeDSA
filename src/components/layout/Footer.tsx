import styles from './Footer.module.css'

const FOOTER_LINKS = ['About', 'Contact', 'Privacy policy', 'Terms of use']

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
        <span className={styles.logoText}>
          <span className={styles.logoDsa}>DSA</span>
          <span className={styles.logoNotes}>Notes</span>
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
