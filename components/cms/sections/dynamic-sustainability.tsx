import Image from "next/image"
import type { PageSection } from "@/lib/db/schemas"

interface DynamicSustainabilityProps {
  content: PageSection["content"]
}

export function DynamicSustainability({ content }: DynamicSustainabilityProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            {content.badge && (
              <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#2d8a39] text-white rounded-full">
                {content.badge}
              </span>
            )}

            {content.title && <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{content.title}</h2>}

            {content.features && content.features.length > 0 && (
              <div className="space-y-6">
                {content.features.map((feature) => (
                  <div key={feature.id} className="flex gap-4">
                    <div className="w-12 h-12 flex-shrink-0">
                      <Image
                        src={feature.icon || "/placeholder.svg"}
                        alt={feature.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#2d8a39] mb-1">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {content.buttonText && (
              <a
                href={content.buttonLink || "#"}
                className="inline-block mt-8 px-6 py-3 bg-[#2d8a39] hover:bg-[#236b2d] text-white rounded-lg font-medium transition-colors"
              >
                {content.buttonText}
              </a>
            )}
          </div>

          {/* Right Images */}
          {content.images && content.images.length > 0 && (
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {content.images.slice(0, 3).map((img, index) => (
                  <div
                    key={img.id}
                    className={`rounded-2xl overflow-hidden shadow-lg ${index === 0 ? "col-span-2" : ""}`}
                  >
                    <Image
                      src={img.src || "/placeholder.svg"}
                      alt={img.alt || "Image"}
                      width={index === 0 ? 600 : 300}
                      height={index === 0 ? 400 : 200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
