'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('https://formspree.io/f/xkolaelj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="emailLabel">You&apos;re subscribed! We&apos;ll notify you when new articles drop.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="emailFields">
      <input
        type="email"
        placeholder="your@email.com"
        className="emailInput"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit" className="emailBtn" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'error' && <p style={{ color: 'red', fontSize: '0.8rem' }}>Something went wrong. Try again.</p>}
    </form>
  )
}
