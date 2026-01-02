"use client"

import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import type { Branding, NavigationMenu } from "@/lib/db/schemas"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Footer() {
  const { data: brandingData } = useSWR<{ branding: Branding }>(
    "/api/branding?tenant=kisan-plant-technologies",
    fetcher,
  )
  const { data: navData } = useSWR<{ header: NavigationMenu; footer: NavigationMenu }>(
    "/api/navigation?tenant=kisan-plant-technologies",
    fetcher,
  )

  const branding = brandingData?.branding
  const footerNav = navData?.footer

  const usefulLinks = footerNav?.items.filter((item) => item.group === "useful") || []
  const divisionsLinks = footerNav?.items.filter((item) => item.group === "divisions") || []
  const socialLinks = footerNav?.items.filter((item) => item.group === "social") || []

  return (
    <footer className="bg-[#f5f5f5] pt-16 rounded-3xl mx-12 mb-4" id="contact">
      <div className="max-w-300 mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          {/* Brand */}
          <div className="flex justify-center">
            <div className="flex items-center justify-center">
              <Image
                src={branding?.footerLogo || "/images/logo-footer.png"}
                alt={branding?.siteTitle || "VBR Group"}
                width={80}
                height={80}
              />
            </div>
          </div>

          {/* Useful Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-[#333] mb-5">Useful Links</h4>
            <ul className="flex flex-col gap-3">
              {usefulLinks.map((link) => (
                <li key={link.id}>
                  <Link href={link.url} className="text-sm text-[#666] hover:text-[#2d8a39]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Divisions */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-[#333] mb-5">Our Divisions</h4>
            <ul className="flex flex-col gap-3">
              {divisionsLinks.map((division) => (
                <li key={division.id}>
                  <Link href={division.url} className="text-sm text-[#666] hover:text-[#2d8a39]">
                    {division.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with us on social media channels */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-[#333] mb-5">
              Connect with us on
              <br />
              social media channels
            </h4>
            <ul className="flex flex-col gap-6">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <Link
                    href={social.url}
                    target="_blank"
                    className="text-sm text-[#666] hover:text-[#2d8a39] flex items-center gap-3"
                  >
                    {social.icon === "facebook" && (
                      <Image className="w-4 h-6" src={"/images/FACEBOOK2.png"} alt={"facebook"} width={24} height={24}>
                      </Image>
                    )}
                    {social.icon === "twitter" && (
                      <Image className="w-5 h-5" src={"/images/TWITTER2.png"} alt={"twitter"} width={24} height={24}>
                      </Image>
                    )}
                    {social.icon === "instagram" && (
                      <Image className="w-5 h-5" src={"/images/INSTAGRAM2.png"} alt={"facebook"} width={24} height={24}>
                      </Image>
                    )}
                    {social.icon === "linkedin" && (
                       <Image className="w-5 h-5" src={"/images/LINKEDLN2.png"} alt={"facebook"} width={24} height={24}>
                      </Image>
                    )}
                    {social.icon === "youtube" && (
                      <Image className="w-6 h-4" src={"/images/YOUTUBE2.png"} alt={"facebook"} width={24} height={24}>
                      </Image>
                    )}
                    {social.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 py-5 text-center">
        <p className="text-[16px] text-[#666]">
          {branding?.copyright || "© Copyright 2026 kisan agri tech. All Rights Reserved."}
        </p>
      </div>
    </footer>
  )
}
