'use client'

import { useEffect } from 'react'

export function CopyCodeBlocks() {
  useEffect(() => {
    const wrappers = document.querySelectorAll<HTMLElement>('.codeBlockWrapper')
    wrappers.forEach(wrapper => {
      if (wrapper.querySelector('.copyCodeBtn')) return
      const code = wrapper.querySelector('code')
      if (!code) return

      const btn = document.createElement('button')
      btn.className = 'copyCodeBtn'
      btn.textContent = 'Copy'
      btn.setAttribute('aria-label', 'Copy code')
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(code.textContent ?? '').then(() => {
          btn.textContent = 'Copied!'
          setTimeout(() => { btn.textContent = 'Copy' }, 2000)
        })
      })
      wrapper.appendChild(btn)
    })
  }, [])

  return null
}
