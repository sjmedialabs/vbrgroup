import Image from "next/image"
import Link from "next/link"
import type { PageSection } from "@/lib/db/schemas"

interface DynamicDivisionsProps {
  content: PageSection["content"]
}

export function DynamicDivisions({ content }: DynamicDivisionsProps) {
  return (
    <section
      className="py-20"
      style={{
        background: "linear-gradient(135deg, #1e3a1e 0%, #2d4a2d 100%)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Content */}
          <div className="text-white">
            {content.badge && (
              <span className="inline-block px-4 py-1 mb-4 text-sm font-medium bg-[#2d8a39] rounded-full">
                {content.badge}
              </span>
            )}

            {content.title && <h2 className="text-3xl md:text-4xl font-bold mb-6">{content.title}</h2>}

            {content.description && <p className="text-white/80 mb-8">{content.description}</p>}

            <Link
              href="#"
              className="inline-block px-6 py-3 border border-white/30 hover:bg-white/10 rounded-lg font-medium transition-colors"
            >
              Explore our Divisions
            </Link>
          </div>

          {/* Divisions Grid */}
          {content.divisions && content.divisions.length > 0 && (
            <div className="grid grid-cols-2 gap-6">
              {content.divisions.map((division) => (
                <Link key={division.id} href={division.link || "#"} className="group text-center text-white">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white/10">
                    <Image
                      src={division.image || "/placeholder.svg"}
                      alt={division.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{division.title}</h3>
                  <p className="text-sm text-white/70">{division.subtitle}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
