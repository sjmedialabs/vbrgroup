"use client"

import type React from "react"
import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import { useWebsite } from "@/lib/contexts/website-context"
import { Loader2 } from "lucide-react"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { currentWebsite, isLoading } = useWebsite()
  const pathname = usePathname()
  const router = useRouter()

  // Pages that don't require a website to be selected
  const exemptPaths = ["/admin/dashboard/select-website", "/admin/dashboard/websites"]

  useEffect(() => {
    if (!isLoading && !currentWebsite && !exemptPaths.some((p) => pathname.startsWith(p))) {
      router.push("/admin/dashboard/select-website")
    }
  }, [isLoading, currentWebsite, pathname, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#2d8a39]" />
      </div>
    )
  }

  // If no website selected and not on exempt path, show loading while redirecting
  if (!currentWebsite && !exemptPaths.some((p) => pathname.startsWith(p))) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#2d8a39]" />
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
