"use client"

import useSWR from "swr"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface LeadershipContent {
  hero: {
    title: string
    backgroundImage: string
  }
  content: {
    badge: string
    title: string
    paragraphs: string[]
    image: string
  }
}

export default function LeadershipPage() {
  const { data, isLoading } = useSWR<{ content: LeadershipContent }>(
    "/api/pages/about/leadership/content?tenant=kisan-plant-technologies",
    fetcher,
  )

  const content = data?.content

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--primary-green)]"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[320px] md:h-[400px] w-full overflow-hidden">
        <Image src={content?.hero.backgroundImage || ""} alt="Leadership" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 h-full flex items-center justify-center pt-20">
          <h1 className="text-4xl md:text-5xl font-light text-white">
            {content?.hero.title}
          </h1>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 lg:py-24">
        <div className="max-w-300 mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - Text Content */}
            <div className="space-y-6">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white text-base font-bold px-4 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {content?.content.badge}
              </span>

              {/* Title */}
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-dark)] leading-tight">
                {content?.content.title}
              </h2>

              {/* Paragraphs */}
              <div className="space-y-4">
                {content?.content.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-[var(--text-gray)] md:leading-relaxed text-justify">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Right - Image */}
            <div className="relative h-full">
              <div className="relative rounded-3xl overflow-hidden h-full min-h-[400px]">
                <Image
                  src={content?.content.image || ""}
                  alt="Leadership"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
