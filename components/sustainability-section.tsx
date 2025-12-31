"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SustainabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const sustainabilityContent = data?.content?.sustainability
  const title = sustainabilityContent?.title || "EMPOWERING AGRICULTURE TO ACHIEVE SUSTAINABILITY GOALS"
  const badge = sustainabilityContent?.badge || "Sustainability"
  const features = sustainabilityContent?.features || []
  const mainImage = sustainabilityContent?.image || "/images/banner-4.png"
  const stats = sustainabilityContent?.stats || { value: "20+", label: "Integrated Green Technology" }
  const ctaText = sustainabilityContent?.ctaText || "Know More"
  const ctaLink = sustainabilityContent?.ctaLink || "/sustainability"

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
    <section ref={sectionRef} className="py-24" id="sustainability">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-on-scroll">
            <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-2 rounded-full text-[13px] font-medium mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {badge}
            </span>
            <h2 className="text-3xl font-extrabold mb-8 uppercase whitespace-pre-line">
              {title.replace(" TO ", "\nTO ")}
            </h2>

            {features.map((feature: any) => (
              <div key={feature.id} className="flex gap-4 py-5 border-b border-gray-200 last:border-b-0">
                <Image
                  src={feature.icon || "/placeholder.svg"}
                  alt={feature.title}
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain flex-shrink-0"
                />
                <div>
                  <h4 className="text-base font-semibold text-[var(--primary-green)] mb-1">{feature.title}</h4>
                  <p className="text-[13px] text-[var(--text-gray)] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}

            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--primary-green)] text-white rounded-lg font-medium text-sm hover:bg-[var(--primary-green-dark)] hover:-translate-y-0.5 transition-all duration-300 mt-5"
            >
              {ctaText}
            </Link>
          </div>

          {/* Images */}
          <div className="relative h-[450px] animate-on-scroll">
            <div className="absolute top-0 right-0 w-[320px] h-[220px] rounded-2xl overflow-hidden shadow-lg">
              <Image src="/images/banner-4.png" alt="Tractor in field" fill className="object-cover" />
            </div>

            <div className="absolute top-[120px] left-0 w-[280px] h-[280px] rounded-2xl overflow-hidden shadow-lg">
              <Image src={mainImage || "/placeholder.svg"} alt="Green field" fill className="object-cover" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center cursor-pointer shadow-xl">
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[var(--primary-green)] ml-1">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-[50px] right-5 bg-white p-5 rounded-2xl shadow-lg text-center w-[160px]">
              <Image
                src="/images/smart-tech.png"
                alt="Badge"
                width={50}
                height={50}
                className="w-[50px] h-[50px] mx-auto mb-2"
              />
              <h5 className="text-3xl font-bold text-[var(--text-dark)]">{stats.value}</h5>
              <p className="text-xs text-[var(--text-gray)]">{stats.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
