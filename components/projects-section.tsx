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
  const projects = projectsContent?.items || [
    {
      _id: "1",
      image: "/images/project-1.png",
      title: "Project 1",
      location: "Location 1",
      description: "Description 1",
    },
    {
      _id: "2",
      image: "/images/project-2.png",
      title: "Project 2",
      location: "Location 2",
      description: "Description 2",
    },
  ]
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
    <section ref={sectionRef} className="py-12 lg:py-24 bg-[var(--bg-cream)]" id="projects">
      <div className="max-w-[1200px] mx-auto px-5">
        <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-1 rounded-full text-lg font-bold mb-4">
          <span className="w-1.5 h-1.5 bg-white rounded-full" />
          {badge}
        </span>
        <h2 className="text-3xl font-extrabold max-w-md mb-10 uppercase whitespace-pre-line">
          {title.replace(" AND ", "\nAND ")}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mb-10">
          {projects.map((project: any, index: number) => (
            <div key={project._id || index}>
              <div className="h-70 rounded-[12px_70px_12px_12px] overflow-hidden mb-4">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={300}
                  height={280}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="text-lg font-bold text-[var(--primary-green)]">{project.title}</h4>
              <p className="text-[13px] font-semibold mb-1">{project.location}</p>
              <p className="text-[13px] text-gray-400 leading-tight line-clamp-3">{project.description}</p>
            </div>
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
