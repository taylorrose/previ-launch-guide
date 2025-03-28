'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useParams } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { remToPx } from '@/lib/remToPx'

/* -------------------------------------------
   Utilities
------------------------------------------- */
function useInitialValue(value, condition = true) {
  const initialValue = useRef(value).current
  return condition ? initialValue : value
}

export function useCurrentHash() {
  const [currentHash, setCurrentHash] = useState('')
  const router = useRouter()

  useEffect(() => {
    const updateHash = () => setCurrentHash(window.location.hash)

    updateHash()

    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args)
      updateHash()
    }

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      updateHash()
    }

    window.addEventListener('popstate', updateHash)

    return () => {
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
      window.removeEventListener('popstate', updateHash)
    }
  }, [router])

  return currentHash
}

export function useActiveSection(sectionIds, offset = 120) {
  const [activeSection, setActiveSection] = useState(sectionIds[0])

  useEffect(() => {
    const handleScroll = () => {
      let current = sectionIds[0]
      for (let id of sectionIds) {
        const section = document.getElementById(id)
        if (section && window.scrollY + offset >= section.offsetTop) {
          current = id
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset])

  return activeSection
}

function NavLink({ href, children, active = false, isSubsection = false }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex py-1 pr-3 text-sm transition',
        isSubsection ? 'pl-8' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white bg-zinc-200/25'
          : 'text-zinc-900 dark:text-white'
      )}
    >
      <span className="truncate">{children}</span>
    </Link>
  )
}

/* -------------------------------------------
   Flatten the navigation items so we can
   easily compute active index for pages & subsections
------------------------------------------- */
function flattenNavItems(group, code) {
  const items = []
  group.links.forEach((link) => {
    const mainHref = `/${code}/${link.href.replace('./', '')}`
    items.push({
      mainHref,
      subsectionId: null,
      title: link.title,
    })
    if (link.sections) {
      link.sections.forEach((section) => {
        items.push({
          mainHref,
          subsectionId: section.id,
          title: section.title,
        })
      })
    }
  })
  return items.map((item, index) => ({ ...item, index }))
}

/* -------------------------------------------
   useActiveNavItem
   - Determines which item is active based on
     pathname + hash + visible sections.
------------------------------------------- */
function useActiveNavItem(group) {
  const { code } = useParams()
  const pathname = usePathname()
  const currentHash = useCurrentHash()
  const visibleSections = useSectionStore((s) => s.visibleSections)

  const items = React.useMemo(() => flattenNavItems(group, code), [group, code])

  let activeIndex = -1

  items.forEach((item) => {
    if (pathname === item.mainHref) {
      if (item.subsectionId) {
        const hashMatches = currentHash === `#${item.subsectionId}`
        const scrolledIntoView = visibleSections.includes(item.subsectionId)
        if (hashMatches || scrolledIntoView) {
          activeIndex = item.index
        }
      } else {
        if (activeIndex === -1) {
          activeIndex = item.index
        }
      }
    }
  })

  return { items, activeIndex }
}

/* -------------------------------------------
   ActivePageMarker
   - Renders a highlight bar next to the
     current active item in the group
------------------------------------------- */
function ActivePageMarker({ group }) {
  const { activeIndex } = useActiveNavItem(group)
  const isPresent = useIsPresent()

  const itemHeight = remToPx(2)
  const offset = remToPx(0.25)

  const top = activeIndex === -1 ? -9999 : offset + activeIndex * itemHeight
  const height = itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: activeIndex === -1 ? 0 : 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute left-2 w-px bg-emerald-500"
      style={{ top, height }}
    />
  )
}

/* -------------------------------------------
   NavigationGroup
------------------------------------------- */
function NavigationGroup({ group, className }) {
  const { code } = useParams()
  const pathname = usePathname()
  const currentHash = useCurrentHash()
  const visibleSections = useSectionStore((s) => s.visibleSections)

  return (
    <li className={clsx('relative mt-6', className)}>
      <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">
        {group.title}
      </h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={false}>
          <ActivePageMarker group={group} />
        </AnimatePresence>
        <ul>
          {group.links.map((link) => {
            const linkPath = `/${code}/${link.href.replace('./', '')}`
            let isActivePage = pathname === linkPath

            // ─────────────────────────────────────────────────────
            //  Here's the ONLY change:
            //  If a subsection is active, don't highlight the parent
            // ─────────────────────────────────────────────────────
            if (isActivePage && link.sections?.length > 0) {
              const anySubsectionActive = link.sections.some((section) => {
                const hashMatch = currentHash === `#${section.id}`
                return hashMatch || visibleSections.includes(section.id)
              })
              if (anySubsectionActive) {
                isActivePage = false
              }
            }
            // ─────────────────────────────────────────────────────

            return (
              <li key={link.href} className="relative">
                <NavLink href={linkPath} active={isActivePage}>
                  {link.title}
                </NavLink>
                {link.sections?.length > 0 && (
                  <ul>
                    {link.sections.map((section) => {
                      const isSubActive =
                        pathname === linkPath &&
                        (currentHash === `#${section.id}` ||
                          visibleSections.includes(section.id))

                      return (
                        <li key={section.id}>
                          <NavLink
                            href={`${linkPath}#${section.id}`}
                            isSubsection
                            active={isSubActive}
                          >
                            {section.title}
                          </NavLink>
                        </li>
                      )
                    })}
                  </ul>
                )}
                {/*{pathname === linkPath && link.sections?.length > 0 && (*/}
                {/*  <ul>*/}
                {/*    {link.sections.map((section) => {*/}
                {/*      const isSubActive =*/}
                {/*        currentHash === `#${section.id}` ||*/}
                {/*        visibleSections.includes(section.id)*/}

                {/*      return (*/}
                {/*        <li key={section.id}>*/}
                {/*          <NavLink*/}
                {/*            href={`${linkPath}#${section.id}`}*/}
                {/*            isSubsection*/}
                {/*            active={isSubActive}*/}
                {/*          >*/}
                {/*            {section.title}*/}
                {/*          </NavLink>*/}
                {/*        </li>*/}
                {/*      )*/}
                {/*    })}*/}
                {/*  </ul>*/}
                {/*)}*/}
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

/* -------------------------------------------
   Navigation data & top-level nav
------------------------------------------- */
export const navigation = [
  {
    title: 'Rollout',
    links: [
      { title: 'Introduction', href: './introduction' },
      { title: 'Quickstart', href: './quickstart' },
      {
        title: 'Communication Templates',
        href: './comms',
        sections: [
          { id: 'email-communication', title: 'Emails' },
          { id: 'slack-and-teams-posts', title: 'Slack / Teams Posts' },
          { id: 'sms-sends', title: 'SMS Sends' },
          { id: 'printable-materials-desk-drops', title: 'Desk Drops' },
        ],
      },
    ],
  },
  {
    title: 'Benefits',
    links: [
      { title: 'Employee Pricing',
        href: './overview',
        sections: [
          {id: 'wireless-phone-plans', title: 'Phone Plans'},
          {id: 'home-and-auto-insurance', title: 'Home & Auto Insurance'},
          {id: 'the-drop', title: 'The Drop'},
          {id: 'support', title: 'Support'},
        ]
      },
    ],
  },
]

function TopLevelNavItem({ href, children }) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">Get Started</TopLevelNavItem>
        <TopLevelNavItem href="#">Quick Start</TopLevelNavItem>
        <TopLevelNavItem href="#">Benefits</TopLevelNavItem>

        {navigation.map((group, index) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={index === 0 ? 'md:mt-0' : ''}
          />
        ))}

        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  )
}