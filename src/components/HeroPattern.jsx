import Image from 'next/image'
import brandedBg from '@/images/light-background.png'

export function HeroPattern() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <Image
                src={brandedBg}
                alt="Branded background"
                fill
                quality={100}
                className="object-cover opacity-50 pointer-events-none"
            />
        </div>
    )
}