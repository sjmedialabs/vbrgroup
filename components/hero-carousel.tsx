"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const slides = data?.content?.hero?.slides || []

  useEffect(() => {
    if (slides.length === 0) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  if (slides.length === 0) {
    return (
      <section className="relative h-screen min-h-[600px] bg-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </section>
    )
  }

  return (
    <section className="relative h-screen min-h-[100vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide: any, index: number) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/50" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-5 z-10">
        {slides.map((slide: any, index: number) => (
          <div key={slide.id} className={`${index === currentSlide ? "block animate-fade-up" : "hidden"}`}>
            {slide.badge && <p className="text-sm font-medium tracking-[2px] opacity-90">{slide.badge}</p>}
            <h1 className="text-4xl md:text-5xl font-bold leading-tighter tracking-tight uppercase">{slide.title}</h1>
            <p className="text-lg font-normal opacity-90 max-w-[600px] mx-auto mb-8">{slide.subtitle}</p>
            {/* <div className="flex gap-4 justify-center">
              {slide.ctaText && (
                <Link
                  href={slide.ctaLink || "#"}
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--primary-green)] text-white rounded-lg font-medium text-sm hover:bg-[var(--primary-green-dark)] hover:-translate-y-0.5 transition-all duration-300"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  {slide.ctaText}
                </Link>
              )}
            </div> */}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
