"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import useSWR from "swr"
import type { Branding, NavigationMenu } from "@/lib/db/schemas"
import { ChevronDown } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const { data: brandingData } = useSWR<{ branding: Branding }>(
    "/api/branding?tenant=kisan-plant-technologies",
    fetcher,
  )
  const { data: navData } = useSWR<{ navigation: NavigationMenu }>(
    "/api/navigation?tenant=kisan-plant-technologies&location=header",
    fetcher,
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const branding = brandingData?.branding
  const navigation = navData?.navigation

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "p-0" : "p-4 px-8"}`}>
      <header
        className={`bg-white shadow-lg transition-all duration-300 ${
          isScrolled ? "rounded-none" : "rounded-[20px] max-w-[1400px] mx-auto"
        }`}
      >
        <div className="max-w-341.5 mx-auto px-6">
          <div className="grid-cols-12 items-center h-[100px] w-full grid">
            {/* Brand - Logo on left */}
            <div className="col-span-2">  
            <Link href="/" className="flex items-center gap-3">
              <Image
                src={branding?.headerLogo || "/images/logo-header.png"}
                alt={branding?.siteTitle || "VBR Group"}
                width={50}
                height={50}
                className="h-[50px] w-auto"
              />
            </Link>
            </div>
            <div className=" col-span-9">
            {/* Navigation - Right side */}
            <nav className="hidden lg:flex items-center gap-8 lg:justify-around">
              {navigation?.items.map((item) => (
                <NavItem
                  key={item.id}
                  href={item.url}
                  label={item.label}
                  classname={"font-bold"}
                  isActive={
                    pathname === item.url ||
                    pathname.startsWith(item.url + "/") ||
                    (item.url === "/" && pathname === "/")
                  }
                  hasDropdown={item.children && item.children.length > 0}
                  isDivisions={item.label.toLowerCase() === "divisions"}
                  isAbout={item.label.toLowerCase() === "about"}
                  
                >
                  {item.children && item.children.length > 0 && (
                    <Dropdown
                      items={item.children}
                      isDivisions={item.label.toLowerCase() === "divisions"}
                      isAbout={item.label.toLowerCase() === "about"}
                    />
                  )}
                </NavItem>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              <span className="w-6 h-0.5 bg-[var(--text-dark)]" />
              <span className="w-6 h-0.5 bg-[var(--text-dark)]" />
              <span className="w-6 h-0.5 bg-[var(--text-dark)]" />
            </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4">
              <nav className="flex flex-col">
                {navigation?.items.map((item) => (
                  <div key={item.id}>
                    {item.children && item.children.length > 0 ? (
                      <>
                        <button
                          className={`w-full px-5 py-3 text-sm font-medium flex items-center justify-between ${
                            pathname === item.url || pathname.startsWith(item.url + "/")
                              ? "text-[var(--primary-green)]"
                              : "text-[var(--text-dark)] hover:text-[var(--primary-green)]"
                          }`}
                          onClick={() => setOpenMobileDropdown(openMobileDropdown === item.id ? null : item.id)}
                        >
                          {item.label}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${openMobileDropdown === item.id ? "rotate-180" : ""}`}
                          />
                        </button>
                        {openMobileDropdown === item.id && (
                          <div className="bg-gray-50 py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.url}
                                className={`block px-8 py-2 text-sm ${
                                  pathname === child.url
                                    ? "text-[var(--primary-green)]"
                                    : "text-[var(--text-gray)] hover:text-[var(--primary-green)]"
                                }`}
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.url}
                        className={`px-5 py-3 text-sm font-medium block ${
                          pathname === item.url
                            ? "text-[var(--primary-green)]"
                            : "text-[var(--text-dark)] hover:text-[var(--primary-green)]"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

function NavItem({
  href,
  label,
  isActive,
  hasDropdown,
  isDivisions,
  isAbout,
  children,
}: {
  href: string
  label: string
  isActive: boolean
  hasDropdown?: boolean
  isDivisions?: boolean
  isAbout?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="relative group">
      <Link
        href={href}
        className={`text-[13px] font-extrabold py-2 uppercase tracking-wide transition-colors duration-300 ${
          isActive ? "text-blue-500" : "text-[var(--text-dark)] hover:text-[var(--primary-green)]"
        } ${hasDropdown ? "group-hover:text-[var(--primary-green)]" : ""}`}
      >
        {label}
      </Link>
      {hasDropdown && children}
    </div>
  )
}

function Dropdown({
  items,
  isDivisions,
  isAbout,
}: {
  items: { id: string; label: string; url: string; order: number }[]
  isDivisions?: boolean
  isAbout?: boolean
}) {
  const sortedItems = [...items].sort((a, b) => a.order - b.order)

  if (isAbout) {
    return (
      <div className="absolute top-full left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-2 p-4 min-w-[200px]">
        {/* Arrow */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white/95" />
        <div className="flex flex-col gap-2">
          {sortedItems.map((item, index) => (
            <DropdownLink
              key={item.id}
              href={item.url}
              label={item.label}
              active={item.label.toLowerCase() === "leadership"}
            />
          ))}
        </div>
      </div>
    )
  }

  const leftColumn = isDivisions ? sortedItems.slice(0, 5) : sortedItems.slice(0, Math.ceil(sortedItems.length / 2))
  const rightColumn = isDivisions ? sortedItems.slice(5) : sortedItems.slice(Math.ceil(sortedItems.length / 2))

  return (
    <div
      className={`absolute top-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 mt-2 ${
        isDivisions ? "left-1/2 -translate-x-1/2 p-6 min-w-[560px]" : "left-1/2 -translate-x-1/2 p-6 min-w-[400px]"
      }`}
    >
      {/* Arrow */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white/95" />

      <div className="flex gap-6">
        {/* Columns */}
        <div className="flex gap-8 flex-1">
          <div className="flex flex-col gap-3">
            {leftColumn.map((item, index) => (
              <DropdownLink key={item.id} href={item.url} label={item.label} active={index === 0 && isDivisions} />
            ))}
          </div>
          {rightColumn.length > 0 && (
            <div className="flex flex-col gap-3">
              {rightColumn.map((item) => (
                <DropdownLink key={item.id} href={item.url} label={item.label} />
              ))}
            </div>
          )}
        </div>

        {/* Image - only show for divisions */}
        {isDivisions && (
          <div className="w-[160px] h-[160px] rounded-[12px_40px_12px_12px] overflow-hidden flex-shrink-0">
            <Image
              src="/images/division-plantiq.png"
              alt="Division"
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
    </div>
  )
}

function DropdownLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors duration-300 hover:text-[var(--primary-green)] ${
        active ? "text-[var(--primary-green)]" : "text-[var(--text-dark)]"
      }`}
    >
      <span className={active ? "text-[var(--primary-green)]" : "text-[var(--text-gray)]"}>–</span>
      {label}
    </Link>
  )
}
