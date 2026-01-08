"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectCategory {
  id: string
  name: string
  order: number
}

interface Project {
  id: string
  title: string
  location: string
  description: string
  image: string
  categoryId: string
  link?: string
}

interface ProjectsPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
  }
  categories: ProjectCategory[]
  projects: Project[]
}

export default function ProjectsPage() {
  const [content, setContent] = useState<ProjectsPageContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string>("")

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/pages/projects/content?tenant=kisan-plant-technologies")
      const data = await res.json()
      setContent(data.content)
      // Set first category as active
      if (data.content?.categories?.length > 0) {
        setActiveCategory(data.content.categories[0].id)
      }
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = content?.projects?.filter((p) => p.categoryId === activeCategory) || []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d8a39]"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[350px]">
        <Image
          src={content?.hero?.backgroundImage || "/images/project-banner.png"}
          alt="Projects Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">{content?.hero?.title || "Projects"}</h1>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-12 lg:py-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-base font-bold px-4 py-1 rounded-full mb-8">
            <span className="w-2 h-2 bg-white rounded-full"></span>
            {content?.intro?.badge || "Our Project"}
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{content?.intro?.title}</h2>

          {/* Description */}
          <p className="text-gray-500 leading-relaxed max-w-4xl mx-auto">{content?.intro?.description}</p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3">
            {content?.categories
              ?.sort((a, b) => a.order - b.order)
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                    activeCategory === category.id
                      ? "bg-[#2d8a39] text-white"
                      : "bg-white text-gray-400 border border-gray-300 hover:border-[#2d8a39] hover:text-[#2d8a39]",
                  )}
                >
                  {category.name}
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {filteredProjects.map((project) => (
              <div key={project.id} className="group">
                {/* Image */}
                <div className="relative aspect-[4/5] rounded-lg overflow-hidden mb-4">
                  <Image
                    src={project.image || "/placeholder.svg?height=400&width=300&query=agriculture project"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-[#2d8a39] mb-1">{project.title}</h3>
                  <p className="text-sm font-medium text-gray-900 mb-2">{project.location}</p>
                  <p className="text-sm text-gray-600 line-clamp-3">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects found in this category.</p>
            </div>
          )}

          {/* View All Button */}
          {/* {filteredProjects.length > 0 && (
            <div className="mt-10">
              <Button variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-100 bg-transparent">
                View all Project
              </Button>
            </div>
          )} */}
        </div>
      </section>

      <Footer />
    </main>
  )
}
