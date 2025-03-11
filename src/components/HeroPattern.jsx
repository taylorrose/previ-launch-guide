"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import lightBg from "@/images/light-background.svg"
import darkBg from "@/images/dark-background.svg"

export function HeroPattern() {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === "dark"

    const bgSrc = isDark ? darkBg : lightBg

    const lightGradient = `
    linear-gradient(
      to bottom,
      transparent 10%,
      rgba(255,255,255,0.6) 25%,
      rgba(255,255,255,0.9) 40%,
      rgba(255,255,255,1) 55%,
      rgba(255,255,255,1) 100%
    ),
    linear-gradient(
      to right,
      rgba(255,255,255,1) 0%,
      transparent 20%,
      transparent 80%,
      rgba(255,255,255,1) 100%
    )
  `

    const darkGradient = `
    linear-gradient(
      to bottom,
      transparent 10%,
      rgba(24,24,27,0.6) 25%,
      rgba(24,24,27,0.9) 40%,
      rgba(24,24,27,1) 55%,
      rgba(24,24,27,1) 100%
    ),
    linear-gradient(
      to right,
      rgba(24,24,27,1) 0%,
      transparent 20%,
      transparent 80%,
      rgba(24,24,27,1) 100%
    )
  `

    const gradient = isDark ? darkGradient : lightGradient

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
                src={bgSrc}
                alt="Branded background"
                fill
                quality={100}
                className="object-cover opacity-60 pointer-events-none"
            />
            <div
                className="absolute inset-0"
                style={{
                    background: gradient,
                    backgroundRepeat: "no-repeat, no-repeat",
                    backgroundSize: "100% 100%, 100% 100%"
                }}
            />
        </div>
    )
}
