"use client"

import Image from "next/image"
import useSWR from "swr"
import Header from "@/components/header"
import Footer from "@/components/footer"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Section {
  id: string
  title: string
  description: string[]
  image: string
  layout: "text-left" | "image-left"
}

interface SustainabilityContent {
  hero: {
    title: string
    backgroundImage: string
  }
  sections: Section[]
}

export default function SustainabilityPage() {
  const { data } = useSWR<{ content: SustainabilityContent }>(
    "/api/pages/sustainability/content?tenant=kisan-plant-technologies",
    fetcher,
  )

  const content = data?.content

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with green gradient background */}
      <section className="relative h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Green gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2d8a39] via-[#4a9f55] to-[#6ab344]" />
          {/* Background image with overlay */}
          <Image
            src={
              content?.hero?.backgroundImage ||
              "/placeholder.svg?height=450&width=1920&query=sustainability green hands plant"
            }
            alt="Sustainability"
            fill
            className="object-cover mix-blend-overlay opacity-80"
            priority
          />
        </div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-5xl md:text-7xl font-light italic" style={{ fontFamily: "serif" }}>
            {content?.hero?.title || "Sustainability"}
          </h1>
        </div>
      </section>

      {/* Content Sections */}
      <div className="py-16 md:py-24">
        {content?.sections?.map((section, index) => (
          <section key={section.id} className={`py-12 md:py-16 ${index % 2 === 1 ? "bg-white" : "bg-white"}`}>
            <div className="max-w-[1200px] mx-auto px-5">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  section.layout === "image-left" ? "" : ""
                }`}
              >
                {/* Text Content */}
                <div className={`space-y-6 ${section.layout === "image-left" ? "lg:order-2" : "lg:order-1"}`}>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#2d8a39] whitespace-pre-line leading-tight">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.description.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Image */}
                <div className={`${section.layout === "image-left" ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="relative h-[280px] md:h-[350px] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={section.image || "/placeholder.svg"}
                      alt={section.title.replace("\n", " ")}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      <Footer />
    </div>
  )
}
