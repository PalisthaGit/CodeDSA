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

const CLASSES: Record<InfoBoxVariant, string> = {
  yellow: 'infoBox infoBoxYellow',
  pink: 'infoBox infoBoxPink',
  blue: 'infoBox infoBoxBlue',
}

export function InfoBox({ variant, children }: InfoBoxProps) {
  return (
    <div className={CLASSES[variant]}>
      <span className="infoBoxLabel">{LABELS[variant]}</span>
      <div className="infoBoxText">{children}</div>
    </div>
  )
}
