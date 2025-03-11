"use client"

import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/Button"

export default function EnterCodeForm() {
  const [inputValue, setInputValue] = useState("")
  const router = useRouter()

  const inputRef = useRef(null)

  // Focus the input as soon as the component mounts
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleSubmit(e) {
    e.preventDefault()
    if (inputValue.trim()) {
      router.push(`/${inputValue.trim()}/introduction`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="not-prose space-x-3">
      <input
        ref={inputRef}
        type="text"
        placeholder="Enter code..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="
          rounded
          bg-white pl-3 text-lg text-zinc-700
          ring-1 ring-zinc-900/10 transition-colors
          placeholder:text-zinc-500
          dark:bg-white/2 dark:text-zinc-100 dark:ring-white/10
          hover:ring-zinc-900/20
        "
      />
      <Button type="submit">Submit Access Code</Button>
    </form>
  )
}
