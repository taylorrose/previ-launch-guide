"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'

export default function EnterCodeForm() {
  const [inputValue, setInputValue] = useState('')
  const router = useRouter()

  function handleSubmit(e) {
    e.preventDefault()
    // If user typed "XYZ", we redirect them to "/XYZ/introduction"
    if (inputValue.trim()) {
      router.push(`/${inputValue.trim()}/rollout/introduction`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose space-x-3">
      <input
        type="text"
        placeholder="Enter text..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border p-2"
      />
      <Button type="submit">Enter Access Code</Button>
    </form>
  )
}