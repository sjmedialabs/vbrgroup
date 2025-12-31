import type { Page, PageSection } from "@/lib/db/schemas"
import { DynamicHero } from "./sections/dynamic-hero"
import { DynamicAbout } from "./sections/dynamic-about"
import { DynamicDivisions } from "./sections/dynamic-divisions"
import { DynamicSustainability } from "./sections/dynamic-sustainability"
import { DynamicProjects } from "./sections/dynamic-projects"
import { DynamicTestimonials } from "./sections/dynamic-testimonials"

interface DynamicPageProps {
  page: Page
}

export function DynamicPage({ page }: DynamicPageProps) {
  return (
    <>
      {page.sections?.map((section) => (
        <DynamicSection key={section.id} section={section} />
      ))}
    </>
  )
}

function DynamicSection({ section }: { section: PageSection }) {
  switch (section.type) {
    case "hero":
      return <DynamicHero content={section.content} />
    case "about":
      return <DynamicAbout content={section.content} />
    case "divisions":
      return <DynamicDivisions content={section.content} />
    case "sustainability":
      return <DynamicSustainability content={section.content} />
    case "projects":
      return <DynamicProjects content={section.content} />
    case "testimonials":
      return <DynamicTestimonials content={section.content} />
    case "custom":
      return <section className="py-16" dangerouslySetInnerHTML={{ __html: section.content.html || "" }} />
    default:
      return null
  }
}
