// src/app/[code]/AccessLink.jsx
'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/Button'

export function AccessLink({ children }) {
    const { code } = useParams()
    const url = `https://previ.com/access/${code}`

    return (
      <div className="not-prose">
        <Button href={url} variant="text" arrow="right">
          {children}
        </Button>
      </div>
    )
}


