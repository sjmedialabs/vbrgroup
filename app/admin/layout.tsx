import type React from "react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is on login page
  const isLoginPage = false // Will be determined by the actual page

  return <div className="min-h-screen bg-gray-50">{children}</div>
}
