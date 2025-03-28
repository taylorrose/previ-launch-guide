import { forwardRef } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import { motion, useScroll, useTransform } from 'framer-motion'
// Remove if not needed: import { Logo } from '@/components/Logo'

// 1) Import your PNG
import Image from 'next/image'
import previLogoDarkTiny from '@/images/logos/previ_logo_dark_medium.png'

import { Button } from '@/components/Button'
import {
  MobileNavigation,
  useIsInsideMobileNavigation,
} from '@/components/MobileNavigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { MobileSearch, Search } from '@/components/Search'
import { ThemeToggle } from '@/components/ThemeToggle'
import { HeroPattern } from '@/components/HeroPattern'


function TopLevelNavItem({ href, children }) {
  return (

      <li>
        <Link
            href={href}
            className="text-sm/5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          {children}
        </Link>
      </li>
  )
}

export const Header = forwardRef(function Header({ className, ...props }, ref) {
  let { isOpen: mobileNavIsOpen } = useMobileNavigationStore()
  let isInsideMobileNavigation = useIsInsideMobileNavigation()

  let { scrollY } = useScroll()
  let bgOpacityLight = useTransform(scrollY, [0, 72], [0.5, 0.9])
  let bgOpacityDark = useTransform(scrollY, [0, 72], [0.2, 0.8])

  return (

      <motion.div
          {...props}
          ref={ref}
          className={clsx(
              className,
              'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80',
              !isInsideMobileNavigation && 'backdrop-blur-xs dark:backdrop-blur-sm',
              isInsideMobileNavigation
                  ? 'bg-white dark:bg-zinc-900'
                  : 'bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]',
          )}
          style={{
            '--bg-opacity-light': bgOpacityLight,
            '--bg-opacity-dark': bgOpacityDark,
          }}
      >
        <div
            className={clsx(
                'absolute inset-x-0 top-full h-px transition',
                (isInsideMobileNavigation || !mobileNavIsOpen) &&
                'bg-zinc-900/7.5 dark:bg-white/7.5'
            )}
        />
        {/*<Search />*/}
        <div className="flex items-center gap-5 lg:hidden">
          <MobileNavigation />
          {/* 2) Render your PNG instead of <Logo /> */}
          <Link href="/" aria-label="Home">
            <Image
                src={previLogoDarkTiny}
                alt="Previ Logo"
                className="h-6 w-auto"
                priority // optional optimization for images above-the-fold
            />
            <p>Launch Guide</p>
          </Link>
        </div>
        <div className="flex items-center gap-5">
          <nav className="hidden md:block">
            <ul role="list" className="flex items-center gap-8">
              <TopLevelNavItem href="./introduction">Rollout</TopLevelNavItem>
              <TopLevelNavItem href="./overview">Benefits</TopLevelNavItem>
              <TopLevelNavItem href="./overview#support">Support</TopLevelNavItem>
            </ul>
          </nav>
          <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
          <div className="flex gap-4">
            {/*<MobileSearch />*/}
             <ThemeToggle />
          </div>
          <div className="hidden min-[416px]:contents">
            <Button href="./quickstart" arrow="right">Launch Previ</Button>
          </div>
        </div>
      </motion.div>
  )
})
