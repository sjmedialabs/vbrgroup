import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"

export default function KisanPlantiqPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section
        className="h-[70vh] min-h-[450px] bg-cover bg-center flex items-center justify-center relative text-center"
        style={{ backgroundImage: "url('/images/banner-2.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/40" />
        <div className="relative z-10 text-white max-w-[1200px] mx-auto px-5">
          <p className="text-sm font-medium tracking-[2px] mb-2 opacity-90">KISAN PLANTIQ</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Intelligent Greens.
            <br />
            Sustainable Tomorrow.
          </h1>
          <p className="text-lg font-light opacity-90">
            Through sustainable farming and smart technology — more than crops — we grow impact.
          </p>
        </div>
      </section>

      {/* About PLANTIQ */}
      <section className="py-20 bg-[var(--bg-cream)]">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-2 rounded-full text-[13px] font-medium mb-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                About KISAN PLANTIQ
              </span>
              <h2 className="text-3xl font-bold leading-tight">
                Intelligent Greens.
                <br />
                Sustainable Tomorrow.
              </h2>
            </div>
            <div>
              <p className="text-[var(--text-gray)] leading-relaxed mb-5">
                Kisan PLANTIQ, a division of Kisan Plant Technologies Pvt. Ltd., is a leading, technology-enabled plant
                supply network serving projects across India. With over 20 years of industry experience, we deliver
                reliable, scalable, and sustainable green solutions for agriculture, infrastructure, and urban
                landscapes.
              </p>
              <div>
                <h4 className="text-[15px] font-semibold mb-4">Our Capabilities</h4>
                <ul className="list-disc pl-5 text-[var(--text-gray)] text-sm space-y-2">
                  <li>Large-Scale Plant Supply Solutions</li>
                  <li>Multi-Sector Project Support</li>
                  <li>Pan-India Sourcing & Distribution</li>
                  <li>Technology-Enabled Plant Care & Support</li>
                  <li>Sustainable Green Implementation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-10 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 bg-[var(--primary-green)] text-white px-4 py-2 rounded-full text-[13px] font-medium mb-4">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                Our Services
              </span>
              <h2 className="text-3xl font-bold">Comprehensive green solutions designed for sustainable growth.</h2>
            </div>
            <p className="text-[var(--text-gray)] leading-relaxed">
              At Kisan PLANTIQ, we go beyond being a traditional plant supplier — we deliver intelligent, reliable, and
              technology-enabled green solutions across all verticals of India&apos;s growing ecosystem.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-4 mb-10">
            {[
              "Nationwide Plant Supply",
              "Strategic Nursery Partnerships",
              "Smart Agro & Urban Greening Projects",
              "24×7 Customer Care & Expert Support",
              "Knowledge & Training Initiatives",
            ].map((tab, index) => (
              <button
                key={tab}
                className={`text-[13px] font-medium px-2 py-2.5 relative transition-colors ${
                  index === 0 ? "text-[var(--text-dark)]" : "text-[var(--text-gray)]"
                }`}
              >
                {tab}
                {index === 0 && (
                  <span className="absolute bottom-[-17px] left-0 right-0 h-[3px] bg-[var(--primary-green)]" />
                )}
              </button>
            ))}
          </div>

          {/* Service Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[80px] font-bold text-black/5 leading-none -mb-5 block">01</span>
              <h3 className="text-3xl font-semibold mb-5">
                National wide
                <br />
                Plant Supply
              </h3>
              <p className="text-[var(--text-gray)] leading-relaxed mb-4">
                We provide a comprehensive range of Agro Forestry Plants, Fruit Plants, Ornamental, and Landscape
                Plants, sourced through our own production units and a vast network of India&apos;s most reputed
                nurseries.
              </p>
              <p className="text-[var(--text-gray)] leading-relaxed mb-4">
                Our supply chain ensures quality consistency, on-time delivery, and custom project-based sourcing
                anywhere across India.
              </p>
              <p className="text-[var(--text-gray)] leading-relaxed">
                From government projects to private developments — we deliver nature with precision.
              </p>
            </div>
            <div className="rounded-[20px_80px_20px_20px] overflow-hidden shadow-lg">
              <Image
                src="/images/project-1.png"
                alt="Plant Supply"
                width={600}
                height={400}
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
