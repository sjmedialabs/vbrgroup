import Header from "@/components/header"
import HeroCarousel from "@/components/hero-carousel"
import AboutSection from "@/components/about-section"
import DivisionsSection from "@/components/divisions-section"
import SustainabilitySection from "@/components/sustainability-section"
import ProjectsSection from "@/components/projects-section"
import TestimonialsSection from "@/components/testimonials-section"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroCarousel />
      <AboutSection />
      <DivisionsSection />
      <SustainabilitySection />
      <ProjectsSection />
      <TestimonialsSection />
      <Footer />
    </>
  )
}
