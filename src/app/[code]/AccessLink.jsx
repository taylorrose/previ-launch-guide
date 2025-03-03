// src/app/[code]/AccessLink.jsx
'use client'

import { useParams } from 'next/navigation'

export function AccessLink({ children }) {
    const { code } = useParams()
    const url = `https://previ.com/access/${code}`

    return (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    )
}
