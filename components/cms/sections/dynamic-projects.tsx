import Image from "next/image"
import Link from "next/link"
import type { PageSection } from "@/lib/db/schemas"

interface DynamicProjectsProps {
  content: PageSection["content"]
}

export function DynamicProjects({ content }: DynamicProjectsProps) {
  return (
    <section className="py-20 bg-[#f5f3ed]">
      <div className="container mx-auto px-4">
        {content.badge && (
          <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#2d8a39] text-white rounded-full">
            {content.badge}
          </span>
        )}

        {content.title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">{content.title}</h2>}

        {content.projects && content.projects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {content.projects.map((project) => (
              <div key={project.id} className="group">
                <div
                  className="aspect-square rounded-2xl overflow-hidden mb-4"
                  style={{ borderRadius: "12px 70px 12px 12px" }}
                >
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold text-[#2d8a39] text-lg">{project.title}</h3>
                <p className="text-sm font-medium text-gray-900">{project.location}</p>
                <p className="text-gray-600 text-sm mt-2">{project.description}</p>
              </div>
            ))}
          </div>
        )}

        {content.buttonText && (
          <Link
            href={content.buttonLink || "#"}
            className="inline-block px-6 py-3 bg-[#2d8a39] hover:bg-[#236b2d] text-white rounded-lg font-medium transition-colors"
          >
            {content.buttonText}
          </Link>
        )}
      </div>
    </section>
  )
}
