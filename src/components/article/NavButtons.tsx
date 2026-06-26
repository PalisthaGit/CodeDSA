import Link from 'next/link'

interface NavButtonsProps {
  prevSlug?: string
  prevTitle?: string
  nextSlug?: string
  nextTitle?: string
}

export function NavButtons({ prevSlug, prevTitle, nextSlug, nextTitle }: NavButtonsProps) {
  return (
    <div className="navBtns">
      {prevSlug ? (
        <Link href={`/learn/${prevSlug}`} className="navBtnPrev">
          <span className="navBtnLabel">← previous</span>
          <span className="navBtnTitle">{prevTitle}</span>
        </Link>
      ) : (
        <div />
      )}
      {nextSlug ? (
        <Link
          href={`/learn/${nextSlug}`}
          className={`navBtnNext${!prevSlug ? ' navBtnPushRight' : ''}`}
        >
          <span className="navBtnLabel">next →</span>
          <span className="navBtnTitle">{nextTitle}</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  )
}
