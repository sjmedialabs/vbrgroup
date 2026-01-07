"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import useSWR from "swr"
import Header from "@/components/header"
import Footer from "@/components/footer"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface AboutPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  subNav: {
    id: string
    label: string
    href: string
  }[]
  story: {
    badge: string
    title: string
    paragraphs: string[]
    features: {
      id: string
      icon: string
      value?: string
      label: string
    }[]
  }
  cards: {
    id: string
    title: string
    description: string
    link: string
    linkText: string
  }[]
  whyChooseUs: {
    badge: string
    title: string
    description: string
    features: {
      id: string
      icon: string
      title: string
      description: string
    }[]
  }
  growth: {
    badge: string
    title: string
    description: string
    backgroundImage: string
    stats: {
      id: string
      value: string
      label: string
    }[]
  }
}

function SubNavTabs({
  tabs,
  currentPath,
}: { tabs: { id: string; label: string; href: string }[]; currentPath: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-full mx-auto max-w-fit px-2 py-2 flex gap-2">
      {tabs.map((tab) => {
        const isActive = currentPath === tab.href || (currentPath === "/about" && tab.href === "/about")
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              isActive ? "text-[#2d8a39]" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

export default function AboutPage() {
  const pathname = usePathname()
  const { data, isLoading } = useSWR<{ content: AboutPageContent }>(
    "/api/pages/about/content?tenant=kisan-plant-technologies",
    fetcher,
  )

  const content = data?.content

  // Default content matching the design exactly
  const pageContent = content

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2d8a39]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with Sub-Navigation */}
      <section className="relative h-[400px] flex flex-col">
        <div className="absolute inset-0 z-0">
          <Image
            src={pageContent.hero?.backgroundImage || "/images/about-hero.jpg"}
            alt="About Us"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>


        <div className="relative z-10 flex-1 flex items-center justify-center">
          <h1 className="text-5xl md:text-6xl font-light text-white">
            {pageContent.hero?.title || "About us"}
          </h1>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 gap-8 lg:gap-0 lg:grid-cols-3">
            {/* Left Column - Badge, Title, Features */}
            <div className="col-span-1">
              <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-base px-4 py-1 font-bold rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {pageContent.story?.badge || "Our Story"}
              </span>
              <h2 className="text-3xl md:text-3xl font-bold text-[#1a1a1a] leading-tight mb-10">
                {pageContent.story?.title || "Innovation, Intelligent Systems, And Sustainable Practices."}
              </h2>

              <div className="grid grid-cols-3 gap-8 mt-8">
                {(pageContent.story?.features || defaultContent.story.features).slice(0, 3).map((feature) => (
                  <div key={feature.id} className="text-center">
                    <div className="flex flex-col items-center mb-2">
                      {feature.value && (
                        <span className="text-3xl font-bold text-[#1a1a1a] flex items-baseline">
                          {feature.value}
                          <span className="text-xl ml-0.5">+</span>
                        </span>
                      )}
                      {!feature.value && (
                        <div className="w-12 h-12 flex items-center justify-center">
                          <Image
                            src={feature.icon || "/placeholder.svg?height=48&width=48&query=icon"}
                            alt={feature.label}
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{feature.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-8 mt-8 max-w-[280px]">
                {(pageContent.story?.features || defaultContent.story.features).slice(3, 5).map((feature) => (
                  <div key={feature.id} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Image
                          src={feature.icon || "/placeholder.svg?height=48&width=48&query=icon"}
                          alt={feature.label}
                          width={48}
                          height={48}
                          className="object-contain"
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{feature.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Paragraphs */}
            <div className="space-y-5 col-span-2 lg:ml-16">
              {(pageContent.story?.paragraphs || defaultContent.story.paragraphs).map((para, idx) => (
                <p key={idx} className="text-gray-600 leading-relaxed text-justify text-sm">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(pageContent.cards || defaultContent.cards).map((card) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-[#2d8a39] mb-1">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">{card.description}</p>
                <Link
                  href={card.link}
                  className="text-[#1a1a1a] font-medium text-xs underline underline-offset-4 hover:text-[#2d8a39] transition-colors"
                >
                  {card.linkText}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-center">
            {/* Left Column */}
            <div className="col-span-2 pr-4">
              <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white font-bold text-base px-4 py-1 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {pageContent.whyChooseUs?.badge || "Why Choose Us"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-6">
                {pageContent.whyChooseUs?.title || "We don't just garden we grow happiness"}
              </h2>
              <p className="text-gray-500 leading-relaxed text-justify">
                {pageContent.whyChooseUs?.description ||
                  "We bring creativity, care, and quality to every space. With a passion for greenery, we turn garden dreams into reality — beautifully and reliably."}
              </p>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="grid grid-cols-1 col-span-3 sm:grid-cols-2 gap-8">
              {(pageContent.whyChooseUs?.features || defaultContent.whyChooseUs.features).map((feature) => (
                <div key={feature.id}>
                    <div className="flex flex-row gap-2 items-center">
                  <div className="w-18 h-14 bg-[#2d8a39] rounded-md flex items-center justify-center">
                  
                    <Image
                      src={feature.icon || "/placeholder.svg?height=28&width=28&query=white icon"}
                      alt={feature.title}
                      width={28}
                      height={28}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <h4 className="text-[#2d8a39] font-semibold mb-2 text-base">{feature.title}</h4></div>
                  <p className="text-gray-500 text-sm line-clamp-3 mt-1 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Growth in Numbers Section */}
      <section className="py-16">
        <div className="max-w-[1200px] mx-auto px-5">
          <div
            className="relative rounded-3xl overflow-hidden py-16 px-8 md:px-12"
                    style={{
                        backgroundImage: "url('/uploads/bottomGreenImage.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
          >
            <div className="flex flex-col md:flex-row gap-12 items-center">
              {/* Left - Text */}
              <div className="text-white basis-2/5 pr-4">
                <span className="inline-flex items-center font-bold gap-2 bg-white backdrop-blur-sm text-[#2d8a39] text-base px-4 py-1 rounded-full mb-4">
                  <span className="w-1.5 h-1.5 bg-[#2d8a39]  rounded-full"></span>
                  {pageContent.growth?.badge || "Our Growth in Numbers"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  {pageContent.growth?.title || "Our Growth in Numbers"}
                </h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  {pageContent.growth?.description ||
                    "A quick look at our journey through numbers — projects completed, gardens transformed, and clients satisfied"}
                </p>
              </div>
               <div>     <div className="h-40 w-px bg-gray-200 basis-1/5 hidden md:block"></div></div>
              {/* Right - Stats */}
              <div className="grid grid-cols-2 gap-8 basis-2/5">
                {(pageContent.growth?.stats || defaultContent.growth.stats).map((stat) => (
                  <div key={stat.id} className="text-center text-white">
                    <p className="text-4xl md:text-5xl font-light mb-2">{stat.value}</p>
                    <p className="text-white/80 font-semibold text-base">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
