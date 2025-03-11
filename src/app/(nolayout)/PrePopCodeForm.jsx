"use client"

import { useRef, useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { employerData } from "@/data/employerData"

export default function PrePopCodeForm() {
  const router = useRouter()
  const { code } = useParams()

  const [inputValue, setInputValue] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [hasCheckedCode, setHasCheckedCode] = useState(false)

  const inputRef = useRef(null)

  // Check code on mount or code change
  useEffect(() => {
    if (!code) {
      // No code => just show the form (blank)
      setHasCheckedCode(true)
      return
    }

    const trimmed = code.trim().toLowerCase()
    const employer = employerData.find(
        (entry) => entry.access_code?.toLowerCase() === trimmed
    )

    if (employer) {
      // Valid => immediately redirect
      router.replace(`/${code}/introduction`)
    } else {
      // Invalid => show form with error
      setInputValue(code)
      setErrorMessage(`"${code}" is not a valid access code.`)
      setHasCheckedCode(true)
    }
  }, [code, router])

  // Once form is visible (hasCheckedCode = true), auto-focus the input
  useEffect(() => {
    if (hasCheckedCode && inputRef.current) {
      inputRef.current.focus()
    }
  }, [hasCheckedCode])

  function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage("")

    const trimmed = inputValue.trim()
    if (!trimmed) {
      setErrorMessage("Please enter a code.")
      return
    }

    const employer = employerData.find(
        (entry) => entry.access_code?.toLowerCase() === trimmed.toLowerCase()
    )

    if (!employer) {
      setErrorMessage(`"${trimmed}" is not a valid access code.`)
      return
    }

    router.push(`/${trimmed}/introduction`)
  }

  // If we haven’t finished checking the code param, show null or a loader
  if (!hasCheckedCode) {
    return null
  }

  // Show the form (invalid code or no code scenario)
  return (
      <form onSubmit={handleSubmit} className="not-prose space-y-3">
        <div>
          <input
              ref={inputRef}
              type="text"
              placeholder="Enter or update access code..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setErrorMessage("")
              }}
              className="
            rounded
            bg-white pl-3 text-lg text-zinc-700
            ring-1 ring-zinc-900/10 transition-colors
            placeholder:text-zinc-500
            dark:bg-white/2 dark:text-zinc-100 dark:ring-white/10
            hover:ring-zinc-900/20
          "
          />
        </div>

        {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
        )}

        <Button type="submit">Go to Introduction</Button>
      </form>
  )
}
