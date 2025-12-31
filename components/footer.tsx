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
    <footer className="bg-[#f5f5f5] pt-16" id="contact">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src={branding?.footerLogo || "/images/logo-footer.png"}
                alt={branding?.siteTitle || "VBR Group"}
                width={80}
                height={80}
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#2d8a39] leading-tight">KISAN PLANT</span>
                <span className="text-sm font-bold text-[#333] leading-tight">TECHNOLOGIES</span>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="text-center md:text-left">
            <h4 className="text-base font-semibold text-[#333] mb-5">Useful Links</h4>
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
            <h4 className="text-base font-semibold text-[#333] mb-5">Our Divisions</h4>
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
            <h4 className="text-base font-semibold text-[#333] mb-5">
              Connect with us on
              <br />
              social media channels
            </h4>
            <ul className="flex flex-col gap-3">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <Link
                    href={social.url}
                    target="_blank"
                    className="text-sm text-[#666] hover:text-[#2d8a39] flex items-center gap-3"
                  >
                    {social.icon === "facebook" && (
                      <span className="w-6 h-6 flex items-center justify-center text-blue-600">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </span>
                    )}
                    {social.icon === "twitter" && (
                      <span className="w-6 h-6 flex items-center justify-center text-black">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </span>
                    )}
                    {social.icon === "instagram" && (
                      <span className="w-6 h-6 flex items-center justify-center text-pink-600">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                        </svg>
                      </span>
                    )}
                    {social.icon === "linkedin" && (
                      <span className="w-6 h-6 flex items-center justify-center text-blue-700">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </span>
                    )}
                    {social.icon === "youtube" && (
                      <span className="w-6 h-6 flex items-center justify-center text-red-600">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                      </span>
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
        <p className="text-[13px] text-[#666]">
          {branding?.copyright || "© Copyright 2026 kisan agri tech. All Rights Reserved."}
        </p>
      </div>
    </footer>
  )
}
