// src/app/[code]/LinkParam.jsx
'use client'

import { useParams } from 'next/navigation'

export function LinkParam() {
  const { code } = useParams()   // or `const params = useParams()`
  return <>https://previ.com/access/{code}</>
}