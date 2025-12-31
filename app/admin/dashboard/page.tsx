"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ImageIcon, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import { useWebsite } from "@/lib/contexts/website-context"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { currentWebsite } = useWebsite()
  const [stats, setStats] = useState({
    pagesCount: 0,
    mediaCount: 0,
    leadsCount: 0,
    jobsCount: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentWebsite) return

    // Fetch stats for current website
    Promise.all([
      fetch(`/api/pages?tenant=${currentWebsite.slug}`).then((r) => r.json()),
      fetch(`/api/media?tenant=${currentWebsite.slug}`).then((r) => r.json()),
      fetch(`/api/leads?tenant=${currentWebsite.slug}`).then((r) => r.json()),
      fetch(`/api/jobs?tenant=${currentWebsite.slug}`).then((r) => r.json()),
    ])
      .then(([pagesData, mediaData, leadsData, jobsData]) => {
        setStats({
          pagesCount: pagesData.pages?.length || 0,
          mediaCount: mediaData.media?.length || 0,
          leadsCount: leadsData.leads?.length || 0,
          jobsCount: jobsData.jobs?.length || 0,
        })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [currentWebsite])

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const cards = [
    {
      title: "Total Pages",
      value: stats.pagesCount,
      icon: FileText,
      href: "/admin/dashboard/pages",
      color: "bg-blue-500",
    },
    {
      title: "Media Files",
      value: stats.mediaCount,
      icon: ImageIcon,
      href: "/admin/dashboard/media",
      color: "bg-purple-500",
    },
    {
      title: "Leads",
      value: stats.leadsCount,
      icon: MessageSquare,
      href: "/admin/dashboard/leads",
      color: "bg-green-500",
    },
    {
      title: "Job Openings",
      value: stats.jobsCount,
      icon: Briefcase,
      href: "/admin/dashboard/careers",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin</h2>
        <p className="text-gray-500 mt-1">
          Managing <span className="font-medium text-gray-700">{currentWebsite.name}</span>
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">{card.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${card.color}`}>
                      <card.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">{card.value}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link
                  href="/admin/dashboard/pages/new"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <FileText className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Create New Page</p>
                    <p className="text-sm text-gray-500">Add a new page to your website</p>
                  </div>
                </Link>
                <Link
                  href="/admin/dashboard/media"
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Upload Media</p>
                    <p className="text-sm text-gray-500">Add images and files to library</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Website</span>
                  <span className="font-medium">{currentWebsite.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Slug</span>
                  <span className="font-mono text-sm">{currentWebsite.slug}</span>
                </div>
                {currentWebsite.domain && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Domain</span>
                    <a
                      href={`https://${currentWebsite.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {currentWebsite.domain}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
