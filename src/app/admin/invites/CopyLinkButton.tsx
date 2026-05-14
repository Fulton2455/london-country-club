'use client'

import { useState } from 'react'

export default function CopyLinkButton({ token }: { token: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${window.location.origin}/join/${token}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs uppercase tracking-widest bg-[#1a2e1a] text-[#e8dfc8] px-3 py-1.5 rounded hover:bg-[#2a3e2a] transition-colors flex-shrink-0"
    >
      {copied ? '✓ Copied' : 'Copy Link'}
    </button>
  )
}