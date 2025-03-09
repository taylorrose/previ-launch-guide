// src/app/[code]/CompanyName.jsx
'use client'
import { useParams } from 'next/navigation'
import { employerData } from '@/data/employerData'

export function CompanyName() {
  const { code } = useParams()

  // Look up the matching public_employer_name
  const match = employerData.find((entry) => entry.access_code === code)
  const employerName = match?.public_employer_name ?? 'Unknown'

  return <>{employerName}</>
}