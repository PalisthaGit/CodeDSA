import styles from './InfoBox.module.css'

type InfoBoxVariant = 'yellow' | 'pink' | 'blue'

interface InfoBoxProps {
  variant: InfoBoxVariant
  children: React.ReactNode
}

const LABELS: Record<InfoBoxVariant, string> = {
  yellow: '💡 Good to know',
  pink: '⚠️ Common mistake',
  blue: '📌 Remember this',
}

export function InfoBox({ variant, children }: InfoBoxProps) {
  return (
    <div className={`${styles.infoBox} ${styles[variant]}`}>
      <span className={styles.label}>{LABELS[variant]}</span>
      <div className={styles.body}>{children}</div>
    </div>
  )
}
