import type React from "react"
import { WebsiteProvider } from "@/lib/contexts/website-context"
import { DashboardShell } from "@/components/admin/dashboard-shell"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WebsiteProvider>
      <DashboardShell>{children}</DashboardShell>
    </WebsiteProvider>
  )
}
