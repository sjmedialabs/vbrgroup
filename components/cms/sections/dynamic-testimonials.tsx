"use client"

import { useState } from "react"
import Image from "next/image"
import type { PageSection } from "@/lib/db/schemas"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

interface DynamicTestimonialsProps {
  content: PageSection["content"]
}

export function DynamicTestimonials({ content }: DynamicTestimonialsProps) {
  const testimonials = content.testimonials || []
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 2 >= testimonials.length ? 0 : prev + 2))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, testimonials.length - 2) : prev - 2))
  }

  if (testimonials.length === 0) return null

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + 2)

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {content.badge && <p className="text-[#2d8a39] font-medium mb-2">{content.badge}</p>}

        {content.title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">{content.title}</h2>}

        <div className="grid md:grid-cols-2 gap-6">
          {visibleTestimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>

              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2d8a39]">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prevSlide}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
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
