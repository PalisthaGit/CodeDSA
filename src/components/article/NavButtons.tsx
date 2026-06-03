import Link from 'next/link'
import styles from './NavButtons.module.css'

interface NavButtonsProps {
  prevSlug?: string
  prevTitle?: string
  nextSlug?: string
  nextTitle?: string
}

export function NavButtons({ prevSlug, prevTitle, nextSlug, nextTitle }: NavButtonsProps) {
  return (
    <div className={styles.navRow}>
      {prevSlug ? (
        <Link href={`/learn/${prevSlug}`} className={styles.prevBtn}>
          <span className={styles.btnLabel}>← previous</span>
          <span className={styles.btnTitle}>{prevTitle}</span>
        </Link>
      ) : (
        <div />
      )}
      {nextSlug ? (
        <Link href={`/learn/${nextSlug}`} className={`${styles.nextBtn} ${!prevSlug ? styles.pushRight : ''}`}>
          <span className={styles.btnLabel}>next →</span>
          <span className={styles.btnTitle}>{nextTitle}</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
