"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/Button"
import { employerData } from "@/data/employerData"

export default function PrePopCodeForm() {
  const router = useRouter()
  const { code } = useParams()

  const [inputValue, setInputValue] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [hasCheckedCode, setHasCheckedCode] = useState(false)

  // 1. On mount or code change, decide if we auto-redirect or show the form
  useEffect(() => {
    if (!code) {
      // No code param => show blank form
      setHasCheckedCode(true)
      return
    }

    // If there's a code, let's see if it's valid
    const trimmed = code.trim().toLowerCase()
    const employer = employerData.find(
      (entry) => entry.access_code?.toLowerCase() === trimmed
    )

    if (employer) {
      // Code is valid => immediately redirect to /{code}/introduction
      router.replace(`/${code}/introduction`)
    } else {
      // Code is invalid => populate form and show error
      setInputValue(code)
      setErrorMessage(`"${code}" is not a valid access code.`)
      setHasCheckedCode(true)
    }
  }, [code, router])

  function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage("") // reset any previous error

    const trimmed = inputValue.trim()
    if (!trimmed) {
      setErrorMessage("Please enter a code.")
      return
    }

    // Validate again on submit
    const employer = employerData.find(
      (entry) => entry.access_code?.toLowerCase() === trimmed.toLowerCase()
    )

    if (!employer) {
      setErrorMessage(`"${trimmed}" is not a valid access code.`)
      return
    }

    // Valid => navigate
    router.push(`/${trimmed}/introduction`)
  }

  // 2. If we haven't finished checking the code param yet, you could show a loading or return null
  if (!hasCheckedCode) {
    return null // or <p>Loading...</p>
  }

  // 3. Otherwise, show the form (either because code was invalid or code was absent)
  return (
    <form onSubmit={handleSubmit} className="not-prose space-y-3">
      <div>
        <input
          type="text"
          placeholder="Enter or update access code..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setErrorMessage("")
          }}
          className="rounded border border-gray-300 p-2 w-80"
        />
      </div>

      {errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <Button type="submit">Go to Introduction</Button>
    </form>
  )
}
