"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react"

// Twitter/X icon component
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

interface ContactContent {
  hero: {
    title: string
    backgroundImage: string
  }
  phoneBar: {
    tollFree: { label: string; number: string }
    customerCare: { label: string; number: string }
  }
  officeAddresses: {
    title: string
    offices: Array<{
      type: string
      name: string
      address?: string
      city?: string
      isHeadOffice: boolean
    }>
  }
  contactInfo: {
    mediaEnquiries: { label: string; email: string }
    contactNumbers: { label: string; numbers: string[] }
    emails: { label: string; addresses: string[] }
  }
  socialMedia: {
    title: string
    channels: Array<{ name: string; url: string }>
  }
}

function OfficeCard({ office }: { office: ContactContent["officeAddresses"]["offices"][0] }) {
  const [isHovered, setIsHovered] = useState(false)

  // Head office always shows full address
  const showFullAddress = office.isHeadOffice || isHovered

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`border rounded-2xl p-6 text-center transition-all duration-300 min-h-[140px] flex flex-col justify-center ${
        office.isHeadOffice
          ? "bg-[#4a8c3f] text-white border-[#4a8c3f]"
          : isHovered
            ? "bg-[#4a8c3f] text-white border-[#4a8c3f]"
            : "bg-white border-gray-200"
      }`}
    >
      <h3 className={`font-semibold text-lg mb-2 ${office.isHeadOffice || isHovered ? "text-white" : "text-gray-900"}`}>
        {office.type}
      </h3>
      {showFullAddress ? (
        <>
          <p className={office.isHeadOffice || isHovered ? "text-white/90" : "text-gray-600"}>
            {office.name}
            {office.name !== "Hyderabad" &&
            office.name !== "Vishakapatnam" &&
            office.name !== "Vijayawada" &&
            office.name !== "Karimnagar" &&
            office.name !== "Warangal"
              ? ""
              : ""}
          </p>
          {office.address && (
            <p className={office.isHeadOffice || isHovered ? "text-white/90" : "text-gray-600"}>{office.address}</p>
          )}
          {office.city && (
            <p className={office.isHeadOffice || isHovered ? "text-white/90" : "text-gray-600"}>{office.city}</p>
          )}
        </>
      ) : (
        <p className="text-gray-600">{office.name}</p>
      )}
    </div>
  )
}

export default function ContactPage() {
  const [content, setContent] = useState<ContactContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/pages/contact/content")
        const data = await res.json()
        setContent(data.content)
      } catch (error) {
        console.error("Failed to fetch contact content:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-5 h-5" />
      case "twitter":
        return <XIcon />
      case "instagram":
        return <Instagram className="w-5 h-5" />
      case "linkedin":
        return <Linkedin className="w-5 h-5" />
      case "youtube":
        return <Youtube className="w-5 h-5" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-green)]"></div>
        </div>
        <Footer />
      </>
    )
  }

  if (!content) return null

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative h-[350px] md:h-[400px] overflow-hidden">
        <Image src="/images/contact-hero.jpg" alt="Contact Us" fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl text-white font-serif italic">{content.hero.title}</h1>
        </div>
        {/* QR Code placeholder in bottom right */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg p-2 shadow-lg">
          <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Phone Bar */}
      <section className="flex flex-col md:flex-row">
        <div className="flex-1 bg-[#2d5a27] text-white py-4 px-6 text-center">
          <span className="font-medium">{content.phoneBar.tollFree.label}</span>{" "}
          <span>{content.phoneBar.tollFree.number}</span>
        </div>
        <div className="flex-1 bg-[#4a8c3f] text-white py-4 px-6 text-center">
          <span className="font-medium">{content.phoneBar.customerCare.label}</span>{" "}
          <span>{content.phoneBar.customerCare.number}</span>
        </div>
      </section>

      {/* Office Addresses */}
      <section className="py-16 px-5 bg-[#f5f5f5]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium text-center mb-12">{content.officeAddresses.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.officeAddresses.offices.map((office, index) => (
              <OfficeCard key={index} office={office} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Box */}
      <section className="py-8 px-5">
        <div className="max-w-4xl mx-auto border border-gray-200 rounded-lg overflow-hidden">
          {/* Media Enquiries */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-lg">
              <span className="font-bold">{content.contactInfo.mediaEnquiries.label}</span>{" "}
              <span className="text-gray-600">Email id:</span>
              <Link
                href={`mailto:${content.contactInfo.mediaEnquiries.email}`}
                className="text-gray-800 hover:text-[var(--primary-green)]"
              >
                {content.contactInfo.mediaEnquiries.email}
              </Link>
            </p>
          </div>

          {/* Contact Number */}
          <div className="p-6 border-b border-gray-200">
            <p className="text-lg">
              <span className="font-bold">{content.contactInfo.contactNumbers.label}</span>{" "}
              <span className="text-gray-800">{content.contactInfo.contactNumbers.numbers.join(" , ")}</span>
            </p>
          </div>

          {/* Emails */}
          <div className="p-6">
            <p className="text-lg mb-1">
              <span className="font-bold">{content.contactInfo.emails.label}</span>{" "}
              <Link
                href={`mailto:${content.contactInfo.emails.addresses[0]}`}
                className="text-gray-800 hover:text-[var(--primary-green)]"
              >
                {content.contactInfo.emails.addresses[0]},
              </Link>
            </p>
            {content.contactInfo.emails.addresses.slice(1).map((email, index) => (
              <p key={index} className="text-lg">
                <Link href={`mailto:${email}`} className="text-gray-800 hover:text-[var(--primary-green)]">
                  {email}
                </Link>
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Channels */}
      <section className="py-16 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-medium tracking-wider mb-10">{content.socialMedia.title}</h2>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {content.socialMedia.channels.map((channel, index) => (
              <Link
                key={index}
                href={channel.url}
                className="flex items-center gap-2 text-gray-700 hover:text-[var(--primary-green)] transition-colors"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    channel.name.toLowerCase() === "facebook"
                      ? "bg-[#1877f2] text-white"
                      : channel.name.toLowerCase() === "twitter"
                        ? "bg-black text-white"
                        : channel.name.toLowerCase() === "instagram"
                          ? "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white"
                          : channel.name.toLowerCase() === "linkedin"
                            ? "bg-[#0a66c2] text-white"
                            : channel.name.toLowerCase() === "youtube"
                              ? "bg-[#ff0000] text-white"
                              : "bg-gray-200"
                  }`}
                >
                  {getSocialIcon(channel.name)}
                </span>
                <span className="font-medium">{channel.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
