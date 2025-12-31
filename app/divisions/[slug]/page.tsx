"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface ServiceTab {
  id: string
  title: string
  number: string
  heading: string
  description: string[]
  image: string
}

interface DivisionDetailContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  about: {
    badge: string
    title: string
    description: string[]
  }
  services: {
    badge: string
    title: string
    subtitle: string
    tabs: ServiceTab[]
  }
}

export default function DivisionDetailPage() {
  const params = useParams()
  const slug = params.slug as string

  const [content, setContent] = useState<DivisionDetailContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/pages/divisions/${slug}/content`)
        if (res.ok) {
          const data = await res.json()
          setContent(data.content)
        }
      } catch (error) {
        console.error("Error fetching division content:", error)
      } finally {
        setLoading(false)
      }
    }
    if (slug) {
      fetchContent()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2d8a39]"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Division not found</p>
      </div>
    )
  }

  const currentService = content.services.tabs[activeTab]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full">
        <Image
          src={content.hero.backgroundImage || "/placeholder.svg"}
          alt={content.hero.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 max-w-6xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white whitespace-pre-line leading-tight max-w-lg">
              {content.hero.title}
            </h1>
            <p className="text-white/90 mt-4 max-w-md text-sm md:text-base">{content.hero.subtitle}</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-20 bg-[#f8f8f8]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-sm font-medium px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              {content.about.badge}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content.about.title}</h2>

          {/* Description Paragraphs */}
          <div className="space-y-4">
            {content.about.description.map((paragraph, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Services Header */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-12">
            <div>
              {/* Badge */}
              <div className="flex mb-4">
                <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-sm font-medium px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  {content.services.badge}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 whitespace-pre-line leading-tight">
                {content.services.title}
              </h2>
            </div>

            {/* Subtitle */}
            <p className="text-gray-600 max-w-md lg:text-right">{content.services.subtitle}</p>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 mb-12 overflow-x-auto">
            <div className="flex gap-6 md:gap-8 min-w-max">
              {content.services.tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`pb-4 text-sm font-medium whitespace-nowrap transition-colors relative ${
                    activeTab === index ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.title}
                  {activeTab === index && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2d8a39]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text Content */}
            <div>
              {/* Large Number */}
              <span className="text-[120px] md:text-[150px] font-bold text-gray-100 leading-none block -mb-8">
                {currentService.number}
              </span>

              {/* Heading */}
              <h3 className="text-2xl md:text-3xl font-bold text-[#2d8a39] whitespace-pre-line leading-tight mb-6">
                {currentService.heading}
              </h3>

              {/* Description Paragraphs */}
              <div className="space-y-4">
                {currentService.description.map((paragraph, index) => (
                  <p key={index} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative h-[350px] md:h-[450px] rounded-2xl overflow-hidden">
              <Image
                src={currentService.image || "/placeholder.svg"}
                alt={currentService.heading}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
