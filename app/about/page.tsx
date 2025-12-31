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
  const defaultContent: AboutPageContent = {
    hero: {
      title: "About us",
      backgroundImage: "/images/about-hero.jpg",
    },
    subNav: [
      { id: "who-we-are", label: "Who We are", href: "/about" },
      { id: "vision-mission", label: "Vision & Mission", href: "/about/vision-mission" },
      { id: "leadership", label: "Leadership", href: "/about/leadership" },
    ],
    story: {
      badge: "Our Story",
      title: "Innovation, Intelligent Systems, And Sustainable Practices.",
      paragraphs: [
        "Kisan Plant Technologies Pvt. Ltd. is a pioneering agri-technology enterprise based in India, committed to transforming the agricultural ecosystem through innovation, intelligent systems, and sustainable practices. We are among the first organizations in the country to deliver a fully integrated, technology-enabled farming ecosystem—offering end-to-end agricultural solutions under one unified platform.",
        "Our comprehensive capabilities span the entire agricultural lifecycle, from land fencing and borewell installation to scientific soil testing, land preparation, plantation, irrigation, and crop maintenance. By consolidating these critical services, we enable farmers, developers, and institutions to manage farms more efficiently, transparently, and profitably.",
        "At the core of our operations is a data-driven approach to agriculture. We begin with precision land development and soil analysis to establish the right foundation for productivity. This is supported by the supply of premium-quality plants, along with the integration of AI-based monitoring systems, IoT-enabled irrigation controls, and drone-assisted field inspections—ensuring continuous performance tracking from planting through harvest.",
        "Kisan Plant Technologies delivers end-to-end farm management solutions by combining deep agricultural expertise with advanced engineering and digital technologies. Our multidisciplinary team of agronomists, engineers, and field specialists works closely with clients to achieve measurable improvements in yield optimization, water efficiency, cost control, and long-term profitability.",
      ],
      features: [
        { id: "f1", icon: "/images/icons/experience-icon.svg", value: "20", label: "Of Experience" },
        { id: "f2", icon: "/images/icons/pan-india-icon.svg", label: "Pan-India Network" },
        { id: "f3", icon: "/images/icons/smart-tech-icon.svg", label: "Smart Tech" },
        { id: "f4", icon: "/images/icons/support-icon.svg", label: "24×7 Support" },
        { id: "f5", icon: "/images/icons/trust-icon.svg", label: "Trust & Quality" },
      ],
    },
    cards: [
      {
        id: "c1",
        title: "What we do",
        description:
          "At Kisan Plant Technologies, we specialize in delivering end-to-end green solutions that combine advanced horticultural practices with large-scale plant supply and project execution.",
        link: "/services",
        linkText: "Our Solutions",
      },
      {
        id: "c2",
        title: "Our impact",
        description:
          "To become India's most trusted and innovative green technology company, enabling sustainable ecosystems and greener environments through intelligent plant solutions and responsible practices.",
        link: "/projects",
        linkText: "Our Projects",
      },
      {
        id: "c3",
        title: "Our Mission",
        description:
          "To provide superior-quality plants and integrated green solutions through innovation, expertise, and sustainability. To empower customers with reliable supply, expert support, and long-term plant success across India.",
        link: "/contact",
        linkText: "Contact us",
      },
    ],
    whyChooseUs: {
      badge: "Why Choose Us",
      title: "We don't just garden we grow happiness",
      description:
        "We bring creativity, care, and quality to every space. With a passion for greenery, we turn garden dreams into reality — beautifully and reliably.",
      features: [
        {
          id: "w1",
          icon: "/images/icons/garden-icon.svg",
          title: "Expertise in Garden & Landscape Design",
          description:
            "Our experienced team brings creativity and horticultural knowledge to craft beautiful, functional outdoor spaces.",
        },
        {
          id: "w2",
          icon: "/images/icons/customized-icon.svg",
          title: "Customized Solutions for Every Space",
          description: "We tailor every project to your style, space, and needs — no two gardens are ever the same.",
        },
        {
          id: "w3",
          icon: "/images/icons/reliable-icon.svg",
          title: "Reliable Service with Lasting Results",
          description:
            "From design to maintenance, we deliver high-quality, sustainable results you can enjoy season after season.",
        },
        {
          id: "w4",
          icon: "/images/icons/eco-icon.svg",
          title: "Eco-Friendly and Sustainable Materials",
          description: "We prioritize native plants and sustainable materials to enhance your outdoor living space.",
        },
      ],
    },
    growth: {
      badge: "Our Growth in Numbers",
      title: "Our Growth in Numbers",
      description:
        "A quick look at our journey through numbers — projects completed, gardens transformed, and clients satisfied",
      backgroundImage: "/images/growth-bg.jpg",
      stats: [
        { id: "s1", value: "98%", label: "Client Satisfaction" },
        { id: "s2", value: "10k", label: "Projects Complete" },
        { id: "s3", value: "300+", label: "Trees & Plants" },
        { id: "s4", value: "20+", label: "Expert Team" },
      ],
    },
  }

  const pageContent = content || defaultContent

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
          <h1 className="text-5xl md:text-6xl font-light italic font-serif text-white">
            {pageContent.hero?.title || "About us"}
          </h1>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Badge, Title, Features */}
            <div>
              <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-sm px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {pageContent.story?.badge || "Our Story"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-10">
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
            <div className="space-y-5">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(pageContent.cards || defaultContent.cards).map((card) => (
              <div
                key={card.id}
                className="border border-gray-200 rounded-3xl p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-4">{card.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{card.description}</p>
                <Link
                  href={card.link}
                  className="text-[#1a1a1a] font-medium text-sm underline underline-offset-4 hover:text-[#2d8a39] transition-colors"
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div>
              <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-sm px-4 py-2 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                {pageContent.whyChooseUs?.badge || "Why Choose Us"}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] leading-tight mb-6">
                {pageContent.whyChooseUs?.title || "We don't just garden we grow happiness"}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {pageContent.whyChooseUs?.description ||
                  "We bring creativity, care, and quality to every space. With a passion for greenery, we turn garden dreams into reality — beautifully and reliably."}
              </p>
            </div>

            {/* Right Column - Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {(pageContent.whyChooseUs?.features || defaultContent.whyChooseUs.features).map((feature) => (
                <div key={feature.id}>
                  <div className="w-14 h-14 bg-[#2d8a39] rounded-xl flex items-center justify-center mb-4">
                    <Image
                      src={feature.icon || "/placeholder.svg?height=28&width=28&query=white icon"}
                      alt={feature.title}
                      width={28}
                      height={28}
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                  <h4 className="text-[#2d8a39] font-semibold mb-2 text-sm">{feature.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
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
              background: "linear-gradient(135deg, #2d8a39 0%, #1e5f28 50%, #174a1f 100%)",
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Text */}
              <div className="text-white">
                <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full mb-6">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  {pageContent.growth?.badge || "Our Growth in Numbers"}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {pageContent.growth?.title || "Our Growth in Numbers"}
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {pageContent.growth?.description ||
                    "A quick look at our journey through numbers — projects completed, gardens transformed, and clients satisfied"}
                </p>
              </div>

              {/* Right - Stats */}
              <div className="grid grid-cols-2 gap-8">
                {(pageContent.growth?.stats || defaultContent.growth.stats).map((stat) => (
                  <div key={stat.id} className="text-center text-white">
                    <p className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</p>
                    <p className="text-white/80 text-sm">{stat.label}</p>
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
