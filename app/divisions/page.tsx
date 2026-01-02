"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Division {
  id: string
  name: string
  subtitle: string
  description: string
  image: string
  logo: string
  link: string
  features: string[]
}

interface DivisionsContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
  }
  divisions: Division[]
}

export default function DivisionsPage() {
  const [content, setContent] = useState<DivisionsContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/pages/divisions/content?tenant=kisan-plant-technologies")
        const data = await res.json()
        setContent(data.content)
      } catch (error) {
        console.error("Error fetching divisions content:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d8a39]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Banner */}
      <section className="relative h-[300px] md:h-[400px] w-full">
        <Image
          src={content?.hero?.backgroundImage || "/images/Divisions.png"}
          alt="Divisions"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{content?.hero?.title || "Divisions"}</h1>
        </div>
      </section>

      {/* Divisions Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-base font-bold px-4 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {content?.intro?.badge || "Our Divisions"}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-1 whitespace-pre-line">
            {content?.intro?.title || "SPECIALIZED DIVISIONS.\nUNIFIED PURPOSE"}
          </h2>

          {/* Description */}
          <p className="text-gray-600 text-center text-lg max-w-4xl mx-auto mb-16 leading-relaxed">
            {content?.intro?.description ||
              "Our divisions operate under specialized brands, each engineered to address a specific sector while sharing one unified mission — to make India's green and agricultural future intelligent, sustainable, and globally competitive."}
          </p>

          {/* Divisions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {content?.divisions?.slice(0, 6).map((division) => (
              <Link href={division.link || "#"} key={division.id} className="group">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 p-4">
                  {/* Division Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={division.image || "/placeholder.svg?height=200&width=300&query=agriculture"}
                      alt={division.name}
                      fill
                      className="object-cover rounded-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Division Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-[#2d8a39] mb-2 group-hover:text-[#236b2d] transition-colors">
                      {division.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{division.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
