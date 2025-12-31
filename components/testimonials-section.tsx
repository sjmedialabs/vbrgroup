"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const testimonialsContent = data?.content?.testimonials
  const title = testimonialsContent?.title || "Built on Trust."
  const subtitle = testimonialsContent?.subtitle || "Proven by Results."
  const badge = testimonialsContent?.badge || "Voices of Trust"
  const testimonials = testimonialsContent?.items || []

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

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : testimonials.length - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < testimonials.length - 1 ? prev + 1 : 0))
  }

  return (
    <section ref={sectionRef} className="py-24">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="mb-10">
          <p className="text-[var(--primary-green)] text-sm font-medium mb-2">{badge}</p>
          <h2 className="text-3xl font-bold whitespace-pre-line">
            {title}
            {"\n"}
            {subtitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.slice(0, 2).map((testimonial: any) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 animate-on-scroll"
            >
              <p className="text-sm text-[var(--text-gray)] leading-relaxed mb-5 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <svg key={i} viewBox="0 0 24 24" className="w-4 h-4 fill-[#ffc107]">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] rounded-full object-cover"
                  />
                  <div>
                    <h5 className="text-base font-semibold text-[var(--name-blue)]">{testimonial.name}</h5>
                    <p className="text-[13px] text-[var(--text-gray)]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-[var(--primary-green)] hover:text-[var(--primary-green)] transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
