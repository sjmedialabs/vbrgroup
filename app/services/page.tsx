"use client"

import { useState } from "react"
import Image from "next/image"
import useSWR from "swr"
import Header from "@/components/header"
import Footer from "@/components/footer"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ServiceTag {
  id: string
  icon: string
  label: string
}

interface Service {
  id: string
  number: string
  title: string
  description: string
  image: string
  tags: string[] | ServiceTag[]
}

interface ServicesPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
  }
  services: Service[]
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0)

  const { data } = useSWR<{ content: ServicesPageContent }>(
    "/api/pages/services/content?tenant=kisan-plant-technologies",
    fetcher,
  )

  const content = data?.content
  const services = content?.services || []
  console.log("services", services)
  const currentService = services[activeService]
  console.log("current service", currentService)


  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={content?.hero?.backgroundImage || "/images/services-banner.png"}
            alt="Services"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-light">{content?.hero?.title || "Services"}</h1>
        </div>
      </section>

      {/* Services Content Section */}
      <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-base font-bold px-4 py-1 rounded-full mb-8">
             <span className="w-2 h-2 bg-white rounded-full"></span>
              {content?.intro?.badge || "Our Services"}
            </span>
            <h2 className="text-3xl md:text-3xl font-bold text-[#1a1a1a] mb-6 leading-tight max-w-2xl justify-center mx-auto flex">
            <span>  {content?.intro?.title || "INTEGRATED AGRITECH & SUSTAINABLE GREEN SOLUTIONS"}</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content?.intro?.description ||
                "We deliver end-to-end, technology-driven agricultural and green infrastructure solutions—combining smart farming, intelligent irrigation, agri-infrastructure development, soil health, security systems, and sustainable living concepts."}
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left - Service Tabs */}
            <div className="space-y-3">
              {services.map((service, index) => (
                <button
                  key={service.id}
                  onClick={() => setActiveService(index)}
                  className={`w-full lg:max-w-md text-left px-6 py-4 rounded-lg transition-all duration-300 flex items-center gap-4 ${
                    activeService === index
                      ? "bg-[#2d8a39] text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-[#2d8a39]"
                  }`}
                >
                  <span
                    className={`text-lg font-semibold ${activeService === index ? "text-white/80" : "text-gray-500"}`}
                  >
                    {service.number}
                  </span>
                  <span className={`text-lg font-semibold ${activeService === index ? "text-white/80" : "text-gray-500"}`}>{service.title}</span>
                </button>
              ))}
            </div>

            {/* Right - Service Details */}
            {currentService && (
              <div className="space-y-6">
                {/* Service Image */}
                <div className="relative h-[300px] rounded-2xl overflow-hidden">
                  <Image
                    src={currentService.image || "/images/agreeculture.png"}
                    alt={currentService.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Service Title & Description */}
                <div>
                  <h3 className="text-2xl font-bold text-[#2d8a39] mb-1">{currentService.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{currentService.description}</p>
                </div>

                {/* Service Tags */}
                {currentService.tags && currentService.tags.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {currentService.tags.map((tag, idx) => {
                      console.log("current tag", tag)
                      const tagLabel = typeof tag === "string" ? tag : tag.label
                      const tagIcon = typeof tag === "string" ? null : tag.icon
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200"
                        >
                          <div className="rounded-full bg-[#2d8a39] p-1">
                          {tagIcon && (
                            <Image
                              src={tagIcon || "/placeholder.svg"}
                              alt={tagLabel}
                              width={18}
                              height={18}
                              className="object-contain"
                            />
                          )}</div>
                          <span className="text-sm text-gray-700">{tagLabel}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
