"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Linkedin, Youtube, X } from "lucide-react"

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

function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("submitting")

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, source: "contact-popup" }),
      })

      if (res.ok) {
        setStatus("success")
        setTimeout(() => {
          onClose()
          setStatus("idle")
          setFormData({ name: "", email: "", phone: "", company: "", subject: "", message: "" })
        }, 3000)
      } else {
        setStatus("error")
      }
    } catch (error) {
      setStatus("error")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-[#4a8c3f]">Enquiry Now</h2>

          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600">We have received your enquiry and will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="name" placeholder="Name *" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a8c3f] focus:border-transparent outline-none transition-all" />
                <input type="email" name="email" placeholder="Email *" required value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a8c3f] focus:border-transparent outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a8c3f] focus:border-transparent outline-none transition-all" />
                <input type="text" name="company" placeholder="Company" value={formData.company} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a8c3f] focus:border-transparent outline-none transition-all" />
              </div>
              <input type="text" name="subject" placeholder="Subject *" required value={formData.subject} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a8c3f] focus:border-transparent outline-none transition-all" />
              <textarea name="message" placeholder="Message *" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a8c3f] focus:border-transparent outline-none transition-all resize-none" />

              {status === "error" && <p className="text-red-500 text-sm text-center">Failed to submit. Please try again.</p>}

              <button type="submit" disabled={status === "submitting"} className="w-full bg-[#4a8c3f] text-white font-semibold py-3 rounded-lg hover:bg-[#3d7a32] transition-colors disabled:opacity-70 disabled:cursor-not-allowed">{status === "submitting" ? "Submitting..." : "Submit Enquiry"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const defaultContactContent = {
  hero: {
    title: "Let's Build the Future Together",
    backgroundImage: "/images/contact-hero.jpg",
  },
  phoneBar: {
    tollFree: { label: "Toll Free No:", number: "1800-123456-123789" },
    customerCare: { label: "Customer Care Number:", number: "1800-425-9339" },
  },
  officeAddresses: {
    title: "Our Office Addresses",
    offices: [
      {
        type: "Head Office",
        name: "VBR Towers, Knoledge Towers",
        address: "Madhapur, Raidurg,",
        city: "Telangana - 500008",
        isHeadOffice: true,
      },
      {
        type: "Branch-1",
        name: "Hyderabad",
        address: "Plot No. 45, Tech Park",
        city: "Hyderabad - 500081",
        isHeadOffice: false,
      },
      {
        type: "Branch-2",
        name: "Vishakapatnam",
        address: "Door No. 12-5-8, MVP Colony",
        city: "Vishakapatnam - 530017",
        isHeadOffice: false,
      },
      {
        type: "Branch-3",
        name: "Vijayawada",
        address: "Opp. PVP Square, MG Road",
        city: "Vijayawada - 520010",
        isHeadOffice: false,
      },
      {
        type: "Branch-4",
        name: "Karimnagar",
        address: "Near Clock Tower, Jagtial Road",
        city: "Karimnagar - 505001",
        isHeadOffice: false,
      },
      {
        type: "Branch-5",
        name: "Warangal",
        address: "Hanamkonda Main Road",
        city: "Warangal - 506001",
        isHeadOffice: false,
      },
    ],
  },
  contactInfo: {
    mediaEnquiries: { label: "Media Enquiries :", email: "enquiry@kisanplanttechnologies.com" },
    contactNumbers: { label: "Contact Number:", numbers: ["+91-9848123456", "99491237894"] },
    emails: { label: "Email:", addresses: ["info@kisanplanttechnologies.com", "Support@kisanplanttechnologies.com"] },
  },
  socialMedia: {
    title: "SOCIAL MEDIA CHANNELS",
    channels: [
      { name: "Facebook", url: "#" },
      { name: "Twitter", url: "#" },
      { name: "Instagram", url: "#" },
      { name: "Linkedin", url: "#" },
      { name: "youtube", url: "#" },
    ],
  },
}
export default function ContactPage() {
  const [content, setContent] = useState<ContactContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch("/api/pages/contact/content?tenant=kisan-plant-technologies")
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

  if (loading || !content) return null

  const getSocialIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "facebook":
        return <Image src="/images/FACEBOOK2.png" alt="Facebook" width={24} height={24} className="w-5 h-5" />
      case "twitter":
        return <Image src="/images/TWITTER2.png" alt="TEITTER" width={24} height={24} className="w-5 h-5" />
      case "instagram":
        return <Image src="/images/INSTAGRAM2.png" alt="INSTAGRAM" width={24} height={24} className="w-5 h-5" />
      case "linkedin":
        return <Image src="/images/LINKEDLN2.png" alt="LINKEDIN" width={24} height={24} className="w-5 h-5" />
      case "youtube":
        return <Image src="/images/YOUTUBE2.png" alt="YOUTUBE" width={24} height={24} className="w-7 h-5" />
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
      <section className="relative h-[350px] md:h-[400px] overflow-hidden flex justify-center items-center text-center">
        <Image src={content.hero.backgroundImage || "/images/contact-hero.jpg"} alt="Contact Us" fill className="object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl text-white">{content.hero.title}</h1>
        </div>
        {/* QR Code placeholder in bottom right */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-lg hover:scale-105 transition-transform cursor-pointer z-10"
        >
          <div className=" flex flex-col items-center justify-center">
            <Image src="/images/enquiry.png" alt="Enquiry" width={24} height={24} className="w-8 h-8" />
            <p className="text-[6px] font-bold mt-1">Enquiry Now</p>
          </div>
        </button>
      </section>

      {/* Phone Bar */}
      <section className="flex flex-col md:flex-row">
        <div className="flex-1 bg-[#4a8c3f] text-white py-4 px-6 text-center">
          <span className="font-medium">{content.phoneBar.tollFree.label}</span>{" "}
          <span>{content.phoneBar.tollFree.number}</span>
        </div>
        <div className="flex-1 bg-blue-900 text-white py-4 px-6 text-center">
          <span className="font-medium">{content.phoneBar.customerCare.label}</span>{" "}
          <span>{content.phoneBar.customerCare.number}</span>
        </div>
      </section>

      {/* Office Addresses */}
      <section className="py-8 lg:py-16 px-5 bg-[#f5f5f5]">
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
                className="flex items-center gap-1 text-gray-700 hover:text-[var(--primary-green)] transition-colors"
              >
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center`}
                >
                  {getSocialIcon(channel.name)}
                </span>
                <span className="font-medium">{channel.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ContactModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <Footer />
    </>
  )
}
