"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const aboutContent = data?.content?.about
  const title = aboutContent?.title || "Built on Quality. Driven by Innovation"
  const badge = aboutContent?.badge || "About Kisan Plant Technologies Pvt. Ltd."
  const description =
    aboutContent?.description ||
    "exists to reimagine India's green future through intelligent technology and sustainable innovation —building ecosystems that perform today and endure for generations."
  const features = aboutContent?.features || []
  const ctaText = aboutContent?.ctaText || "Explore More"
  const ctaLink = aboutContent?.ctaLink || "/about"

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
    <section ref={sectionRef} className="py-24 text-center" id="about">
      <div className="max-w-[1200px] mx-auto px-5">
        <p className="text-[var(--primary-green)] text-sm font-medium mb-2 animate-on-scroll">{badge}</p>
        <h2 className="text-4xl font-bold mb-5 animate-on-scroll">{title}</h2>
        <p className="max-w-[800px] mx-auto text-[var(--text-gray)] leading-relaxed mb-12 animate-on-scroll">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-12 md:gap-16 mb-10 animate-on-scroll">
          {features.map((feature: any) => (
            <div key={feature.id} className="flex flex-col items-center gap-3">
              <Image
                src={feature.icon || "/placeholder.svg"}
                alt={feature.description || feature.title}
                width={50}
                height={50}
                className="w-[50px] h-[50px] object-contain"
              />
              {feature.title && <span className="text-2xl font-bold text-[var(--text-dark)]">{feature.title}</span>}
              <span className="text-[13px] text-[var(--text-gray)]">{feature.description}</span>
            </div>
          ))}
        </div>

        <Link
          href={ctaLink}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--primary-green)] text-white rounded-lg font-medium text-sm hover:bg-[var(--primary-green-dark)] hover:-translate-y-0.5 transition-all duration-300 animate-on-scroll"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  )
}
