import Image from 'next/image'
import brandedBg from '@/images/light-background.svg'

export function HeroPattern() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
                src={brandedBg}
                alt="Branded background"
                fill
                quality={100}
                className="object-cover opacity-60 pointer-events-none"
            />
            <div
                className="absolute inset-0"
                style={{
                    background: `
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
            )`,
                    backgroundRepeat: 'no-repeat, no-repeat',
                    backgroundSize: '100% 100%, 100% 100%',
                }}
            />
        </div>
    )
}