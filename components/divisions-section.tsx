"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function DivisionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const divisionsContent = data?.content?.divisions
  const title = divisionsContent?.title || "SPECIALIZED DIVISIONS. UNIFIED PURPOSE"
  const badge = divisionsContent?.badge || "Our Divisions"
  const description =
    divisionsContent?.description ||
    "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission — to make India's green and agricultural future intelligent, sustainable, and globally competitive."
  const divisions = divisionsContent?.items || []
  const ctaText = divisionsContent?.ctaText || "Explore our Divisions"
  const ctaLink = divisionsContent?.ctaLink || "/divisions"

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll")
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-[var(--divisions-bg)] text-white" id="divisions">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-center">
          {/* Info */}
          <div className="animate-on-scroll">
            <span className="inline-flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-full text-[13px] font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {badge}
            </span>
            <h2 className="text-3xl font-bold mb-5 whitespace-pre-line">{title.replace(". ", ".\n")}</h2>
            <p className="opacity-80 leading-relaxed mb-8">{description}</p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[var(--primary-green)] rounded-lg font-medium text-sm hover:bg-white/90 transition-all duration-300"
            >
              {ctaText}
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-8 animate-on-scroll">
            {divisions.map((division: any) => (
              <Link href={division.link || "#"} key={division.id} className="text-center group">
                <div className="w-[150px] h-[150px] mx-auto mb-4 rounded-2xl overflow-hidden">
                  <Image
                    src={division.image || "/placeholder.svg"}
                    alt={division.name}
                    width={150}
                    height={150}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-base font-semibold text-[var(--primary-green)] mb-1">{division.name}</h4>
                <p className="text-xs opacity-70 whitespace-pre-line">{division.subtitle}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
