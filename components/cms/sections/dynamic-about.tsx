import Image from "next/image"
import type { PageSection } from "@/lib/db/schemas"

interface DynamicAboutProps {
  content: PageSection["content"]
}

export function DynamicAbout({ content }: DynamicAboutProps) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 text-center">
        {content.badge && <p className="text-[#2d8a39] font-medium mb-4">{content.badge}</p>}

        {content.title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{content.title}</h2>}

        {content.description && <p className="text-gray-600 max-w-3xl mx-auto mb-12">{content.description}</p>}

        {content.stats && content.stats.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mb-12">
            {content.stats.map((stat) => (
              <div key={stat.id} className="text-center">
                <div className="w-16 h-16 mx-auto mb-3">
                  <Image
                    src={stat.icon || "/placeholder.svg"}
                    alt={stat.label}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                {stat.value && <p className="text-2xl font-bold text-gray-900">{stat.value}</p>}
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {content.buttonText && (
          <a
            href={content.buttonLink || "#"}
            className="inline-block px-8 py-3 bg-[#2d8a39] hover:bg-[#236b2d] text-white rounded-lg font-medium transition-colors"
          >
            {content.buttonText}
          </a>
        )}
      </div>
    </section>
  )
}
