// src/components/VideoPlayer.jsx
'use client'

export function VideoPlayer({ videoPath, width = '640', ...props }) {
  return (
    <div className="my-16 border border-zinc-100 dark:border-zinc-800 rounded-lg p-4">
      <video
        src={videoPath}
        width={width}
        controls
        className="w-full rounded-md shadow-lg"
        {...props}
      />
    </div>
  )
}
