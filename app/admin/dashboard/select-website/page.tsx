"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Loader2, Plus, ArrowRight } from "lucide-react"
import { useWebsite } from "@/lib/contexts/website-context"
import type { Tenant } from "@/lib/db/schemas"
import Link from "next/link"

export default function SelectWebsitePage() {
  const [websites, setWebsites] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const { setCurrentWebsite } = useWebsite()
  const router = useRouter()

  useEffect(() => {
    fetch("/api/tenants")
      .then((res) => res.json())
      .then((data) => setWebsites(data.tenants || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSelectWebsite = (website: Tenant) => {
    setCurrentWebsite(website)
    router.push("/admin/dashboard")
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2d8a39]" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Select a Website</h1>
        <p className="text-gray-500 mt-2">Choose a website to manage from the dashboard</p>
      </div>

      {websites.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Globe className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mt-4">No websites yet</h3>
            <p className="text-gray-500 mt-2">Create your first website to get started</p>
            <Link href="/admin/dashboard/websites">
              <Button className="mt-6 bg-[#2d8a39] hover:bg-[#236b2d]">
                <Plus className="mr-2 h-4 w-4" />
                Create Website
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {websites.map((website) => (
            <Card
              key={website._id}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => handleSelectWebsite(website)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: website.theme?.primaryColor || "#2d8a39" }}
                  >
                    {website.settings?.logo ? (
                      <img
                        src={website.settings.logo || "/placeholder.svg"}
                        alt={website.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Globe className="h-7 w-7 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{website.name}</CardTitle>
                    <CardDescription>{website.domain || website.slug}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  variant="ghost"
                  className="w-full justify-between group-hover:bg-green-50 group-hover:text-green-700"
                >
                  Manage Website
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Add Website Card */}
          <Link href="/admin/dashboard/websites">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-dashed border-2 h-full">
              <CardContent className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Plus className="h-7 w-7 text-gray-400" />
                </div>
                <p className="font-medium text-gray-600 mt-4">Add New Website</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}
    </div>
  )
}
