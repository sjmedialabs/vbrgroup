"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useWebsite } from "@/lib/contexts/website-context"
import {
  LayoutDashboard,
  ImageIcon,
  Globe,
  MessageSquare,
  Briefcase,
  Palette,
  Navigation,
  ChevronDown,
  ChevronRight,
  Wrench,
  Home,
  Users,
  FolderKanban,
  Leaf,
  Phone,
  Plus,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import type { Tenant } from "@/lib/db/schemas"

const mainNavigation = [{ name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }]

// Predefined pages - each page has unique sections
const pagesNavigation = [
  { name: "Home", href: "/admin/dashboard/pages/home", icon: Home },
  { name: "About", href: "/admin/dashboard/pages/about", icon: Users },
  { name: "Leadership", href: "/admin/dashboard/pages/about/leadership", icon: Users },
  { name: "Services", href: "/admin/dashboard/pages/services", icon: Wrench },
  { name: "Projects", href: "/admin/dashboard/pages/projects", icon: FolderKanban },
  { name: "Sustainability", href: "/admin/dashboard/pages/sustainability", icon: Leaf },
  { name: "Career", href: "/admin/dashboard/pages/career", icon: Briefcase },
  { name: "Contact", href: "/admin/dashboard/pages/contact", icon: Phone },
]

const cmsNavigation = [
  { name: "Media Library", href: "/admin/dashboard/media", icon: ImageIcon },
  { name: "Branding", href: "/admin/dashboard/branding", icon: Palette },
  { name: "Navigation", href: "/admin/dashboard/navigation", icon: Navigation },
]

const managementNavigation = [
  { name: "Leads", href: "/admin/dashboard/leads", icon: MessageSquare },
  { name: "Careers", href: "/admin/dashboard/careers", icon: Briefcase },
]

const adminNavigation = [{ name: "All Websites", href: "/admin/dashboard/websites", icon: Globe }]

interface Division {
  id: string
  slug: string
  name: string
}

export function AdminSidebar() {
  const pathname = usePathname()
  const { currentWebsite, setCurrentWebsite } = useWebsite()
  const [websites, setWebsites] = useState<Tenant[]>([])
  const [divisions, setDivisions] = useState<Division[]>([])
  const [divisionsOpen, setDivisionsOpen] = useState(false)

  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => setWebsites(data.tenants || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (currentWebsite?.slug) {
      fetch(`/api/divisions?tenant=${currentWebsite.slug}`)
        .then((res) => res.json())
        .then((data) => {
          setDivisions(data.divisions || [])
          // Auto-open if we're on a division page
          if (pathname.startsWith("/admin/dashboard/pages/divisions/") && pathname !== "/admin/dashboard/pages/divisions") {
            setDivisionsOpen(true)
          }
        })
        .catch(console.error)
    }
  }, [currentWebsite?.slug, pathname])

  const NavLink = ({
    item,
  }: { item: { name: string; href: string; icon: React.ComponentType<{ className?: string }> } }) => {
    const isActive =
      pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href + "/"))
    const isExactDashboard = item.href === "/admin/dashboard" && pathname === "/admin/dashboard"

    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive || isExactDashboard
            ? "bg-green-50 text-green-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </Link>
    )
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <Image src="/images/logo-footer.png" alt="VBR CMS" width={120} height={48} className="h-10 w-auto" />
        </Link>
      </div>

      {/* Website Selector */}
      <div className="p-4 border-b border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className="flex items-center justify-between gap-3 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: currentWebsite?.theme?.primaryColor || "#2d8a39" }}
                >
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div className="text-left min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {currentWebsite?.name || "Select Website"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{currentWebsite?.slug || "No website selected"}</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {websites.map((website) => (
              <DropdownMenuItem
                key={website._id}
                onClick={() => setCurrentWebsite(website)}
                className={cn(currentWebsite?.slug === website.slug && "bg-green-50")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center"
                    style={{ backgroundColor: website.theme?.primaryColor || "#2d8a39" }}
                  >
                    <Globe className="h-3 w-3 text-white" />
                  </div>
                  <span className="truncate">{website.name}</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard/websites" className="flex items-center gap-3">
                <Globe className="h-4 w-4" />
                Manage Websites
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {currentWebsite && (
          <>
            {mainNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">Pages</p>
            {pagesNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            {/* Divisions Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setDivisionsOpen(!divisionsOpen)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname.startsWith("/admin/dashboard/pages/divisions")
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <FolderKanban className="h-5 w-5" />
                <span className="flex-1 text-left">Divisions</span>
                {divisionsOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {divisionsOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                  <Link
                    href="/admin/dashboard/pages/divisions"
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === "/admin/dashboard/pages/divisions"
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    Divisions Page
                  </Link>

                  {divisions.map((division) => (
                    <Link
                      key={division.id || division.slug}
                      href={`/admin/dashboard/pages/divisions/${division.slug}`}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-sm transition-colors truncate",
                        pathname === `/admin/dashboard/pages/divisions/${division.slug}`
                          ? "bg-green-50 text-green-700 font-medium"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      )}
                      title={division.name}
                    >
                      {division.name}
                    </Link>
                  ))}

                  <Link
                    href="/admin/dashboard/pages/divisions/new"
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      pathname === "/admin/dashboard/pages/divisions/new"
                        ? "bg-green-50 text-green-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    Create New
                  </Link>
                </div>
              )}
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">CMS</p>
            {cmsNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">Management</p>
            {managementNavigation.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </>
        )}

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">Administration</p>
        {adminNavigation.map((item) => (
          <NavLink key={item.name} item={item} />
        ))}
      </nav>
    </aside>
  )
}
