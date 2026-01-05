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
  const backgroundImage = divisionsContent?.backgroundImage
  const title = divisionsContent?.title || "SPECIALIZED DIVISIONS. UNIFIED PURPOSE"
  const badge = divisionsContent?.badge || "Our Divisions"
  const description =
    divisionsContent?.description ||
    "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission — to make India's green and agricultural future intelligent, sustainable, and globally competitive."
  const divisions = divisionsContent?.items || [
    {
      id: 1,
      image: "/images/kisan-plantiq.png",
      name: "Kisan Plantiq",
      subtitle: "Description here",
      link: "#",
    },
    {
      id: 2,
      image: "/images/kisan-plantiq.png",
      name: "Kisan Plantiq",
      subtitle: "Description here",
      link: "#",
    },
        {
      id: 3,
      image: "/images/kisan-plantiq.png",
      name: "Kisan Plantiq",
      subtitle: "Description here",
      link: "#",
    },
    {
      id: 4,
      image: "/images/kisan-plantiq.png",
      name: "Kisan Plantiq",
      subtitle: "Description here",
      link: "#",
    },
  ]
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
    <section ref={sectionRef} className="py-24 bg-[var(--divisions-bg)]" id="divisions"
    style={
      {
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }>
      <div className="max-w-300 mx-auto px-5">
        <div className="flex flex-col lg:flex-row justify-center gap-4 items-center">
          {/* Info */}
          <div className="animate-on-scroll basis-1/2">
            <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-1 rounded-full text-lg font-bold mb-4">
             <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {badge}
            </span>
            <h2 className="text-3xl font-bold mb-5 whitespace-pre-line">{title.replace(". ", ".\n")}</h2>
            <p className="opacity-80 text-gray-400 leading-relaxed mb-8 text-xl">{description}</p>
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--primary-green)] text-white rounded-lg font-medium text-sm hover:bg-white/90 transition-all duration-300"
            >
              {ctaText}
            </Link>
          </div>

          {/* Cards */}
          <div className="flex flex-wrap gap-3 justify-center items-center animate-on-scroll basis-1/2">
            {divisions.map((division: any) => (
              <Link href={division.link || "#"} key={division.id} className="text-center w-50 group bg-white border border-gray-200 rounded-2xl p-2">
                <div className="w-full h-37.5 mx-auto mb-4 rounded-2xl overflow-hidden">
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
