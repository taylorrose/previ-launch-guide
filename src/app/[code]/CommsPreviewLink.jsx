'use client'

import { useParams } from 'next/navigation'
import { Button } from '@/components/Button'

export function CommsPreviewLink({
                                   path,
                                   campaign = 'relaunch',
                                   commsNumber,
                                   label = 'View Template',
                                   variant = 'text',
                                   arrow = 'right',
                                   targetBlank = true,
                                   className = '',
                                 }) {
  const { code } = useParams()
  const url = `${path}/${campaign}${commsNumber}`

  return (
    <div className={`not-prose ${className}`}>
      <Button href={url} variant={variant} arrow={arrow} target={targetBlank ? '_blank' : '_self'}>
        {label}
      </Button>
    </div>
  )
}
