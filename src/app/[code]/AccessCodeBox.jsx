"use client"

import { useParams } from "next/navigation"
import { Button } from "@/components/Button.jsx"

export function AccessCodeBox() {
  const { code } = useParams()
  const displayUrl = `https://previ.com/access/${code}`

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={displayUrl}
        readOnly
        className="
          w-full h-8
          rounded
          bg-white pr-3 pl-3 text-sm text-zinc-700
          ring-1 ring-zinc-900/10 transition-colors
          placeholder:text-zinc-500
          dark:bg-white/5 dark:text-zinc-300 dark:ring-white/10
          focus:outline-none
          hover:ring-zinc-900/20
        "
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
