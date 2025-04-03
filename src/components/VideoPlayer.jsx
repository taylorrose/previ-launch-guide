// src/components/VideoPlayer.jsx
'use client'

import { useCallback } from 'react'
import { Button } from '@/components/Button.jsx' // Adjust path if needed

export function VideoPlayer({
                              videoPath = '/videos/traeger_teaser.mp4',
                              width = '640px',
                              ...props
                            }) {
  // Copies link to clipboard
  const handleShare = useCallback(() => {
    const absoluteUrl = `${window.location.origin}${videoPath}`
    navigator.clipboard.writeText(absoluteUrl).then(() => {
      alert(`Copied link to clipboard:\n${absoluteUrl}`)
    })
  }, [videoPath])

  return (
    <div className="rounded-lg">
      {/* The video */}
      <video
        src={videoPath}
        style={{ width }}
        controls
        className="rounded-md shadow-lg"
        {...props}
      />

      <div className="not-prose mt-6 mb-4 flex gap-3">
        {/* 1) Download Button:
            Use href + download to force the file to download
         */}
        <Button href={videoPath} download arrow="down">
          <>Download Video File</>
        </Button>

        {/* 2) Share Button:
            On click, copy the absolute link to the clipboard
         */}
        {/*<Button onClick={handleShare} variant="outline" arrow="right">*/}
        {/*  <>Copy Video Link</>*/}
        {/*</Button>*/}
      </div>
    </div>
  )
}
