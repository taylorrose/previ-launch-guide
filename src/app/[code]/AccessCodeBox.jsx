"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/Button.jsx"

export function AccessCodeBox() {
  const { code } = useParams()
  const displayUrl = `https://previ.com/access/${code}`

  return (
    <div className="space-y-2">
      <input
        id="access-url"
        type="text"
        value={displayUrl}
        readOnly
        className="w-full rounded border border-gray-300 p-2"
      />
      <div className="not-prose">
        <Button
          href={displayUrl}
          target="_blank"
          variant="text"
          arrow="right"
        >
          <>Visit Enrollment Page</>
        </Button>
      </div>
    </div>
  )
}
