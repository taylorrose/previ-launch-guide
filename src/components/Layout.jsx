"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

import Image from "next/image"
import previLogoDarkTiny from "@/images/logos/previ_logo_dark_medium.png"
import previLogoLightTiny from "@/images/logos/previ_logo_light_medium.png"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Navigation } from "@/components/Navigation"
import { SectionProvider } from "@/components/SectionProvider"
import { HeroPattern } from "@/components/HeroPattern"

export function Layout({ children, allSections }) {
    const pathname = usePathname()
    const segments = pathname.split("/").filter(Boolean)
    const hideNav = segments.length <= 1
    const containerClasses = hideNav
        ? "h-full"
        : "h-full lg:ml-72 xl:ml-80"

    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === "dark"
    const logoSrc = isDark ? previLogoLightTiny : previLogoDarkTiny

    return (
        <SectionProvider sections={allSections[pathname] ?? []}>
            <div className={containerClasses}>
                <motion.header
                    layoutScroll
                    className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
                >
                    <div
                        className={
                            hideNav
                                ? "contents lg:pointer-events-auto lg:block lg:overflow-y-auto lg:px-6 lg:pt-4 lg:pb-8"
                                : "contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 xl:w-80 lg:dark:border-white/10"
                        }
                    >
                        <div className="hidden lg:flex">
                            <Link href="/" aria-label="Home">
                                <Image
                                    src={logoSrc}
                                    alt="Previ Logo"
                                    className="h-6 w-auto"
                                    priority
                                />
                                <p>Launch Guide</p>
                            </Link>
                        </div>

                        <Header />
                        {!hideNav && (
                            <Navigation className="hidden lg:mt-10 lg:block" />
                        )}
                    </div>
                </motion.header>

                <HeroPattern
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        zIndex: -1
                    }}
                />

                <div className="relative flex h-full flex-col px-4 pt-14 sm:px-6 lg:px-8">
                    <main className="flex-auto">{children}</main>
                    <Footer />
                </div>
            </div>
        </SectionProvider>
    )
}
