"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function SustainabilitySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const sustainabilityContent = data?.content?.sustainability
  const title = sustainabilityContent?.title || "EMPOWERING AGRICULTURE TO ACHIEVE SUSTAINABILITY GOALS"
  const badge = sustainabilityContent?.badge || "Sustainability"
  const features = sustainabilityContent?.features || []
  const videoUrl = sustainabilityContent?.videoUrl || ""
  const mainImage = sustainabilityContent?.image || "/images/banner-4.png"
  const stats = sustainabilityContent?.stats || { value: "20+", label: "Integrated Green Technology" }
  const ctaText = sustainabilityContent?.ctaText || "Know More"
  const ctaLink = sustainabilityContent?.ctaLink || "/sustainability"

  const getYoutubeThumbnail = (url: string) => {
    if (!url) return "/placeholder.svg"
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11
      ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
      : "/placeholder.svg"
  }

  const getYoutubeId = (url: string) => {
    if (!url) return null
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

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
    <section ref={sectionRef} className="py-12 lg:py-24" id="sustainability">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-center">
          {/* Content */}
          <div className="animate-on-scroll">
            <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-1 rounded-full text-lg font-bold mb-4">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              {badge}
            </span>
            <h2 className="text-3xl font-extrabold uppercase whitespace-pre-line">
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
                  <h4 className="text-xl font-bold text-[var(--primary-green)] mb-1">{feature.title}</h4>
                  <p className="text-base text-gray-400 leading-relaxed">{feature.description}</p>
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
          <div className="relative h-112.5 animate-on-scroll">
            <div className="absolute hidden md:block top-0 md:right-10 lg:right-2 w-full md:w-140 lg:w-120 h-80 lg:h-72 rounded-2xl overflow-hidden shadow-lg">
             <Image src={mainImage || "/placeholder.svg"} alt="Green field" fill className="object-cover" />
            </div>

            <div className="absolute top-0 md:top-50 lg:top-40 left-0 md:left-4 lg:-left-16 xl:left-0 w-full md:w-60 h-70 rounded-2xl overflow-hidden shadow-lg bg-black">
              {!isPlaying ? (
                <div className="relative w-full h-full cursor-pointer group" onClick={() => setIsPlaying(true)}>
                  <Image src={getYoutubeThumbnail(videoUrl)} alt="Video thumbnail" fill className="object-cover" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-15 h-15 bg-white rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="fill-[var(--primary-green)] ml-1">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>
              ) : (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}?autoplay=1`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>

            <div className="absolute bottom-12.5 md:bottom-0 lg:bottom-12.5 right-5 md:right-20 lg:right-5 bg-white p-5 rounded-2xl shadow-lg text-center w-50">
              <Image
                src={stats.icon || "/images/smart-tech.png"}
                alt="Badge"
                width={50}
                height={50}
                className="w-14 h-16 mx-auto mb-2"
              />
              <h5 className="text-4xl font-extrabold text-[var(--primary-green)]">{stats.value}</h5>
              <p className="text-sm font-medium mt-1">{stats.label}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
