import { type NextRequest, NextResponse } from "next/server"

interface ServiceTab {
  id: string
  title: string
  number: string
  heading: string
  description: string[]
  image: string
}

interface DivisionDetailContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  about: {
    badge: string
    title: string
    description: string[]
  }
  services: {
    badge: string
    title: string
    subtitle: string
    tabs: ServiceTab[]
  }
}

const divisionContents: Record<string, DivisionDetailContent> = {
  "kisan-plantiq": {
    hero: {
      title: "Intelligent Greens.\nSustainable Tomorrow.",
      subtitle: "Through sustainable farming and smart collaboration, we grow more than crops — we grow impact.",
      backgroundImage: "/images/plantiq-hero.png",
    },
    about: {
      badge: "About KISAN PLANTIQ",
      title: "Intelligent Greens. Sustainable Tomorrow.",
      description: [
        "We specialize in the large-scale supply of Agro Forestry Plants, Fruit Plants, and Landscaping Greens, catering to both urban infrastructure projects and agriculture development initiatives across India.",
        "Unlike traditional suppliers, Kisan PLANTIQ integrates innovation into every green solution. While we produce select premium species in our own facilities, we've also built strategic partnerships with India's most reputed nurseries, ensuring consistent quality and an unmatched variety of plant species.",
      ],
    },
    services: {
      badge: "Our Services",
      title: "End-to-End Plant Supply\n& Green Solutions\nAcross India",
      subtitle:
        "At Kisan PLANTIQ, we go beyond being a traditional plant supplier — we deliver intelligent, reliable, and technology-enabled green solutions across all verticals of India's growing ecosystem.",
      tabs: [
        {
          id: "nationwide-plant-supply",
          title: "Nationwide Plant Supply",
          number: "01",
          heading: "National wide\nPlant Supply",
          description: [
            "We provide a comprehensive range of Agro Forestry Plants, Fruit Plants, Ornamental, and Landscape Plants, sourced through our own production units and a vast network of India's most reputed nurseries.",
            "Our supply chain ensures quality consistency, on-time delivery, and custom project-based sourcing anywhere across India.",
            "From government projects to private developments — we deliver nature with precision.",
          ],
          image: "/images/plantiq-service-1.png",
        },
        {
          id: "strategic-nursery-partnerships",
          title: "Strategic Nursery Partnerships",
          number: "02",
          heading: "Strategic Nursery\nPartnerships",
          description: [
            "We've built long-term partnerships with India's most trusted and certified nurseries to ensure premium quality plants across all categories.",
            "This network allows us to source rare species, fulfill bulk orders, and maintain consistent supply throughout the year.",
            "Our partnerships span across multiple states, giving us unmatched reach and reliability.",
          ],
          image: "/images/plantiq-service-2.png",
        },
        {
          id: "smart-agro-urban-greening",
          title: "Smart Agro & Urban Greening Projects",
          number: "03",
          heading: "Smart Agro & Urban\nGreening Projects",
          description: [
            "We execute end-to-end greening projects for urban landscapes, highways, industrial campuses, and residential developments.",
            "Our smart agro solutions integrate technology with traditional farming practices for maximum efficiency and sustainability.",
            "From concept to completion, we handle planning, procurement, planting, and maintenance.",
          ],
          image: "/images/plantiq-service-3.png",
        },
        {
          id: "customer-care-support",
          title: "24*7 Customer Care & Expert Support",
          number: "04",
          heading: "24*7 Customer Care\n& Expert Support",
          description: [
            "Our dedicated support team is available round-the-clock to address queries, provide guidance, and resolve issues promptly.",
            "Expert horticulturists and agronomists are on standby to offer technical advice and best practices.",
            "We believe in building lasting relationships through exceptional service and support.",
          ],
          image: "/images/plantiq-service-4.png",
        },
        {
          id: "knowledge-training",
          title: "Knowledge & Training Initiatives",
          number: "05",
          heading: "Knowledge & Training\nInitiatives",
          description: [
            "We conduct regular training programs, workshops, and knowledge-sharing sessions for farmers, nursery owners, and agricultural professionals.",
            "Our initiatives cover modern cultivation techniques, sustainable practices, and market-ready production methods.",
            "Empowering India's green workforce with skills and knowledge for a sustainable future.",
          ],
          image: "/images/plantiq-service-5.png",
        },
      ],
    },
  },
  "kisan-agriq": {
    hero: {
      title: "Smart Agriculture.\nIntelligent Farming.",
      subtitle: "Leveraging AI and data analytics to transform agricultural practices across India.",
      backgroundImage: "/images/division-agriq.png",
    },
    about: {
      badge: "About KISAN AGRIQ",
      title: "Smart Agriculture. Intelligent Farming.",
      description: [
        "Kisan AGRIQ is the corporate agriculture intelligence division, bringing cutting-edge technology to farming.",
        "We provide data-driven insights, precision farming solutions, and AI-powered agricultural management systems.",
      ],
    },
    services: {
      badge: "Our Services",
      title: "Corporate Agriculture\nIntelligence Solutions",
      subtitle: "Transforming agriculture through technology and innovation.",
      tabs: [
        {
          id: "precision-farming",
          title: "Precision Farming",
          number: "01",
          heading: "Precision\nFarming",
          description: [
            "Advanced sensors and IoT devices for real-time crop monitoring.",
            "Data-driven decision making for optimal resource utilization.",
          ],
          image: "/images/division-agriq.png",
        },
      ],
    },
  },
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const content = divisionContents[slug]

  if (!content) {
    return NextResponse.json({ error: "Division not found" }, { status: 404 })
  }

  return NextResponse.json({ content })
}
