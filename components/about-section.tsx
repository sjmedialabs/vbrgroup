"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const aboutContent = data?.content?.about
  const title = aboutContent?.title || "Built on Quality. Driven by Innovation"
  const badge = aboutContent?.badge || "About Kisan Plant Technologies Pvt. Ltd."
  const description =
    aboutContent?.description ||
    "exists to reimagine India's green future through intelligent technology and sustainable innovation —building ecosystems that perform today and endure for generations."
  const features = aboutContent?.features || []
  const ctaText = aboutContent?.ctaText || "Explore More"
  const ctaLink = aboutContent?.ctaLink || "/about"

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

  return (
    <section ref={sectionRef} className="py-24 text-center" id="about">
      <div className="max-w-[1200px] mx-auto px-5">
        <p className="text-[var(--primary-green)] text-base font-medium animate-on-scroll">{badge}</p>
        <h2 className="text-4xl font-bold animate-on-scroll mt-1">{title}</h2>
        <p className="max-w-[1120px] text-[var(--text-gray)] leading-relaxed text-2xl mt-1 animate-on-scroll">
          {description}
        </p>

        <div className="flex flex-wrap justify-center gap-12 md:gap-16 mb-4 animate-on-scroll">
          {features.map((feature: any) => (
            <>
              <div key={feature.id}>
                <div className="flex flex-col items-center gap-3">
                  <Image
                    src={feature.icon || "/placeholder.svg"}
                    alt={feature.description || feature.title}
                    width={50}
                    height={50}
                    className="w-[50px] h-[50px] object-contain"
                  />
                  {feature.title && <span className="text-2xl font-bold text-[var(--text-dark)]">{feature.title}</span>}
                  <span className="text-[13px] text-[var(--text-gray)]">{feature.description}</span>
                </div>
              </div>
            </>
          ))}
        </div>
              <div className={"w-full py-6"}>
                  <div className="flex flex-wrap items-center justify-between gap-2 px-4 max-w-4xl mx-auto">

                    {/* Item 1 */}
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-bold text-[#82a97a]">20+</span>
                      <span className="text-gray-800 font-bold">Of Experience</span>
                    </div>

                    <div className="hidden md:block h-14 w-px bg-gray-300" />

                    {/* Item 2 */}
                    <div className="flex flex-col items-center">
                      <img src="/images/map.png" alt="India" className="h-13 w-12" />
                      <span className="text-gray-800 font-bold">Pan-India Network</span>
                    </div>

                    <div className="hidden md:block h-14 w-px bg-gray-300" />

                    {/* Item 3 */}
                    <div className="flex flex-col items-center">
                      <img src="/images/bulb.png" alt="Smart Tech" className="h-12 w-11" />
                      <span className="text-gray-800 font-bold">Smart Tech</span>
                    </div>

                    <div className="hidden md:block h-14 w-px bg-gray-300" />

                    {/* Item 4 */}
                    <div className="flex flex-col items-center">
                      <img src="/images/headphone.png" alt="Support" className="h-12 w-10" />
                      <span className="text-gray-800 font-bold">24×7 Support</span>
                    </div>

                    <div className="hidden md:block h-14 w-px bg-gray-300" />

                    {/* Item 5 */}
                    <div className="flex flex-col items-center">
                      <img src="/images/Vector.png" alt="Trust" className="h-12 w-10" />
                      <span className="text-gray-800 font-bold">Trust & Quality</span>
                    </div>
                  </div>
                </div>
        <Link
          href={ctaLink}
          className="inline-flex items-center gap-2 px-7 mt-6 py-3.5 bg-[var(--primary-green)] text-white rounded-lg font-medium text-sm hover:bg-[var(--primary-green-dark)] hover:-translate-y-0.5 transition-all duration-300 animate-on-scroll"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  )
}
