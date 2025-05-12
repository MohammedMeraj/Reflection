// app/whatsapp/page.tsx
'use client'
// test
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function WhatsAppSenderPage() {
  const [message, setMessage] = useState(
    `todays attendance:\npresent-20\nabsent-90\nheirarchy-59`
  )
  const [numbers, setNumbers] = useState('') // e.g. "15551234567,441234567890"

  const handleSend = () => {
    const list = numbers
      .split(',')
      .map(n => n.trim())
      .filter(n => n)

    if (list.length) {
      // send one chat per number
      list.forEach(num => {
        const url = `whatsapp://send?phone=${num}&text=${encodeURIComponent(message)}`
        window.open(url, '_blank')
      })
    } else {
      // open share dialog to pick group/person
      const url = `whatsapp://send?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>WhatsApp Sender</h1>

      <label>Message:</label>
      <textarea
        rows={6}
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
      />

      <label style={{ marginTop: '1rem', display: 'block' }}>
        Recipients (comma-separated E.164 numbers):
      </label>
      <input
        type="text"
        value={numbers}
        placeholder="15551234567,441234567890"
        onChange={e => setNumbers(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
      />

      <Button onClick={handleSend} style={{ marginTop: '1rem' }}>
        Send via WhatsApp
      </Button>
    </div>
  )
}
