"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { employerData } from "@/data/employerData"

/**
 * Checks whether the [code] param is in employerData.
 * If not, redirects to "/[code]" (which is your (nolayout) route).
 */
export function ValidateCode() {
  const { code } = useParams()
  const router = useRouter()

  useEffect(() => {
    if (!code) return

    // Look for a matching code in employerData (case-insensitive)
    const trimmed = code.trim().toLowerCase()
    const isValid = employerData.some(
      (entry) => entry.access_code?.toLowerCase() === trimmed
    )

    if (!isValid) {
      // Redirect back to /[code], which triggers your nolayout page
      router.replace(`/${code}`)
    }
  }, [code, router])

  return null
}
