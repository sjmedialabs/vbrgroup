"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { data } = useSWR<{ content: any }>("/api/pages/home/content?tenant=kisan-plant-technologies", fetcher)

  const projectsContent = data?.content?.projects
  const title = projectsContent?.title || "CULTIVATED WITH PRECISION AND INNOVATION"
  const badge = projectsContent?.badge || "Our Projects"
  const projects = projectsContent?.items || []
  const ctaText = projectsContent?.ctaText || "View all Project"
  const ctaLink = projectsContent?.ctaLink || "/projects"

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
    <section ref={sectionRef} className="py-24 bg-[var(--bg-cream)]" id="projects">
      <div className="max-w-[1200px] mx-auto px-5">
        <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-2 rounded-full text-[13px] font-medium mb-4">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          {badge}
        </span>
        <h2 className="text-3xl font-extrabold mb-10 uppercase whitespace-pre-line">
          {title.replace(" AND ", "\nAND ")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {projects.map((project: any) => (
            <Link href={project.link || "#"} key={project.id} className="animate-on-scroll group">
              <div className="h-[280px] rounded-[12px_70px_12px_12px] overflow-hidden mb-4">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={300}
                  height={280}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-base font-semibold text-[var(--primary-green)] mb-1">{project.title}</h4>
              <p className="text-[13px] font-semibold text-[var(--text-dark)] mb-2">{project.location}</p>
              <p className="text-[13px] text-[var(--text-gray)] leading-relaxed">{project.description}</p>
            </Link>
          ))}
        </div>

        <Link
          href={ctaLink}
          className="inline-flex items-center gap-2 px-7 py-3.5 bg-[var(--primary-green)] text-white rounded-lg font-medium text-sm hover:bg-[var(--primary-green-dark)] hover:-translate-y-0.5 transition-all duration-300"
        >
          {ctaText}
        </Link>
      </div>
    </section>
  )
}
