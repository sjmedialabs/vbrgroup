"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import type { PageSection } from "@/lib/db/schemas"

interface DynamicHeroProps {
  content: PageSection["content"]
}

export function DynamicHero({ content }: DynamicHeroProps) {
  const slides = content.slides || []
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  const slide = slides[currentSlide]

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Background Images */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={s.image || "/placeholder.svg"}
            alt={s.title}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
        <div className="max-w-4xl">
          {slide.badge && (
            <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-white/10 backdrop-blur rounded-full">
              {slide.badge}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">{slide.subtitle}</p>

          <div className="flex items-center justify-center gap-4">
            {slide.buttonPrimaryText && (
              <a
                href={slide.buttonPrimaryLink || "#"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d8a39] hover:bg-[#236b2d] rounded-lg font-medium transition-colors"
              >
                {slide.buttonPrimaryText}
              </a>
            )}
            {slide.buttonSecondaryText && (
              <a
                href={slide.buttonSecondaryLink || "#"}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                {slide.buttonSecondaryText}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
