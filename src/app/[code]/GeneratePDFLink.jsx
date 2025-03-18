// src/app/[code]/GeneratePDFLink.jsx
'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/Button'

export function GeneratePDFLink({ children }) {
  const { code } = useParams()
  const url = `https://api.urlbox.com/v1/vGsAgTEIiyqn96rI/pdf?url=https%3A%2F%2Fwww.previ.guide%2F${code}%2Fpdf-preview&width=2550&height=3300&pdf_page_size=letter&pdf_background=true&pdf_dpi=300&pdf_margin=default&full_width=true&pdf_auto_crop=true`

  return (
    <div className="not-prose">
      <Button href={url} variant="text" arrow="right" target="_blank">
        Download Printable Desk Drop Flyer
      </Button>
    </div>
  )
}


