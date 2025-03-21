'use client'
import { useEffect } from 'react'

// A small utility: which IDs do you want to watch?
// Typically, you pass them from the MDX or define them here.
const SECTION_IDS = [
  'email-communication',
  'slack-and-teams-posts',
  'sms-sends',
  'printable-materials-desk-drops',
]

export function ScrollSpy() {
  useEffect(() => {
    // Only run in the browser
    if (typeof window === 'undefined') return

    // IntersectionObserver callback:
    // entries = array of intersection changes
    // We'll find which section is in the viewport and update the hash
    function onIntersect(entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id')
          // Use replaceState so we don't push every scroll event into history
          window.history.replaceState(null, '', `#${id}`)
        }
      }
    }

    // Create the observer
    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: '-40% 0px -60% 0px',
      // This rootMargin means "40% above the viewport top
      // and 60% below the viewport bottom" to trigger a bit earlier
      threshold: 0,
    })

    // Observe each section
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  return null // No visible output
}