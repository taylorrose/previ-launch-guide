'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
import { useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function useInitialValue(value, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

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

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white',
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}
function VisibleSectionHighlight({ group }) {
  const { code } = useParams()
  const pathname = usePathname()
  const router = useRouter()

  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation(),
  )

  const [currentHash, setCurrentHash] = useState('')

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash)
    }

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

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  )

  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight

  let activePageIndex = group.links.findIndex((link) => {
    const [linkPath, linkHash] = link.href.split('#')
    const resolvedLink = `/${code}/${linkPath.replace('./', '')}`

    if (pathname !== resolvedLink) return false
    if (!linkHash && !currentHash) return true
    return currentHash === `#${linkHash}`
  })

  if (activePageIndex === -1) return null

  let top = activePageIndex * itemHeight + firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({ group }) {
  const { code } = useParams()
  const pathname = usePathname()
  const router = useRouter()
  const itemHeight = remToPx(2)
  const offset = remToPx(0.25)

  const [currentHash, setCurrentHash] = useState('')

  useEffect(() => {
    const updateHash = () => {
      setCurrentHash(window.location.hash)
    }

    updateHash() // Set hash on initial mount

    // Listen to Next.js router events
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

  let activePageIndex = group.links.findIndex((link) => {
    const [linkPath, linkHash] = link.href.split('#')
    const resolvedLink = `/${code}/${linkPath.replace('./', '')}`

    if (pathname !== resolvedLink) return false
    if (!linkHash && !currentHash) return true
    return currentHash === `#${linkHash}`
  })

  if (activePageIndex === -1) return null

  const top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-emerald-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({ group, className }) {
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [sections] = useInitialValue(
    [useSectionStore((s) => s.sections)],
    isInsideMobileNavigation,
  )

  const { code } = useParams()
  const pathname = usePathname()

  const isActiveGroup = group.links.some((link) =>
    pathname.startsWith(`/${code}/${link.href.replace('./', '')}`),
  )

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          {group.links.map((link) => {
            const linkPath = `/${code}/${link.href.replace('./', '')}`
            const active = pathname === linkPath

            return (
              <motion.li key={link.href} layout="position" className="relative">
                <NavLink href={linkPath} active={active}>
                  {link.title}
                </NavLink>
                <AnimatePresence mode="popLayout" initial={false}>
                  {active && sections.length > 0 && (
                    <motion.ul
                      role="list"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    >
                      {sections.map((section) => (
                        <li key={section.id}>
                          <NavLink
                            href={`${linkPath}#${section.id}`}
                            tag={section.tag}
                            isAnchorLink
                          >
                            {section.title}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

export const navigation = [
  {
    title: 'Rollout',
    links: [
      { title: 'Introduction', href: './introduction' },
      { title: 'Quickstart', href: './quickstart' },
      { title: 'Communication Templates', href: './comms' },
      { title: 'Emails', href: './comms#email-communication' },
      { title: 'Slack / Teams Posts', href: './comms#slack-and-teams-posts' },
      { title: 'SMS Sends', href: './comms#sms-sends' },
      { title: 'Desk Drops', href: './comms#printable-materials-desk-drops' },
    ],
  },
  {
    title: 'Benefits',
    links: [
      { title: 'Overview', href: './overview' },
      { title: 'Phone Plans', href: './wireless' },
      { title: 'Insurance', href: './insurance' },
      { title: 'Employee Store', href: './store' },
    ],
  },
]

export function Navigation(props) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">Get Started</TopLevelNavItem>
        <TopLevelNavItem href="#">Quick Start</TopLevelNavItem>
        <TopLevelNavItem href="#">Benefits</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
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
