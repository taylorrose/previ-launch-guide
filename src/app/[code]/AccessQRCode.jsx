"use client"

import { useParams } from "next/navigation"

export function AccessQRCode() {
  const { code } = useParams()

  if (!code) {
    return <p>No code found in the URL.</p>
  }

  const displayUrl = `https://previ.com/access/${code}`
  const encodedUrl = encodeURIComponent(displayUrl)
  const srcURL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`

  return (
    <img
      src={srcURL}
      alt={`QR Code for ${displayUrl}`}
      className="
        rounded
        border border-gray-300
        p-2
        shadow-md
        dark:border-white/10
      "
    />
  )
}
