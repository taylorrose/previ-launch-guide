// src/app/[code]/GeneratePDFLink.jsx
'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/Button'

export function GeneratePDFLink({ children }) {
  const { code } = useParams()
  const url = `../pdf/${code}.pdf`

  return (
    <div className="not-prose">
      <Button href={url} variant="text" arrow="right" target="_blank">
        Flyer Template
      </Button>
    </div>
  )
}


