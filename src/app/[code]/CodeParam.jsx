// src/app/[code]/CodeParam.jsx
'use client'

import { useParams } from 'next/navigation'

export function CodeParam() {
  const { code } = useParams()   // or `const params = useParams()`
  return <span>{code}</span>
}

