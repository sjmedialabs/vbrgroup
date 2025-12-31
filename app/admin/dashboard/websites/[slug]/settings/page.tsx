"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Save, Globe, Palette, Shield, Database } from "lucide-react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import type { Tenant } from "@/lib/db/schemas"
import Link from "next/link"

export default function WebsiteSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [website, setWebsite] = useState<Tenant | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    primaryColor: "#2d8a39",
    secondaryColor: "#1e3a1e",
    logo: "",
    favicon: "",
    // SEO Settings
    siteTitle: "",
    siteDescription: "",
    // Analytics
    googleAnalyticsId: "",
    facebookPixelId: "",
    // Security
    enableCaptcha: false,
    captchaSiteKey: "",
  })

  useEffect(() => {
    fetchWebsite()
  }, [slug])

  const fetchWebsite = async () => {
    try {
      const res = await fetch(`/api/tenants/${slug}`)
      const data = await res.json()

      if (data.tenant) {
        setWebsite(data.tenant)
        setFormData({
          name: data.tenant.name || "",
          domain: data.tenant.domain || "",
          primaryColor: data.tenant.theme?.primaryColor || "#2d8a39",
          secondaryColor: data.tenant.theme?.secondaryColor || "#1e3a1e",
          logo: data.tenant.settings?.logo || "",
          favicon: data.tenant.settings?.favicon || "",
          siteTitle: data.tenant.settings?.siteTitle || data.tenant.name || "",
          siteDescription: data.tenant.settings?.siteDescription || "",
          googleAnalyticsId: data.tenant.settings?.googleAnalyticsId || "",
          facebookPixelId: data.tenant.settings?.facebookPixelId || "",
          enableCaptcha: data.tenant.settings?.enableCaptcha || false,
          captchaSiteKey: data.tenant.settings?.captchaSiteKey || "",
        })
      }
    } catch (error) {
      console.error("Error fetching website:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/tenants/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          domain: formData.domain,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          logo: formData.logo,
          favicon: formData.favicon,
        }),
      })

      if (res.ok) {
        alert("Settings saved successfully!")
      } else {
        const data = await res.json()
        alert(data.error || "Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!website) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Website not found</p>
        <Link href="/admin/dashboard/websites">
          <Button variant="outline" className="mt-4 bg-transparent">
            Back to Websites
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard/websites">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">{website.name} Settings</h2>
          <p className="text-gray-500 mt-1">Manage settings for this website</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-gray-100">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic website information and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Website Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain</Label>
                  <Input
                    id="domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title (SEO)</Label>
                <Input
                  id="siteTitle"
                  value={formData.siteTitle}
                  onChange={(e) => setFormData({ ...formData, siteTitle: e.target.value })}
                  placeholder="My Website - Tagline"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description (SEO)</Label>
                <Input
                  id="siteDescription"
                  value={formData.siteDescription}
                  onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                  placeholder="A brief description of your website"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="primaryColor"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <ImageUploadField
                label="Website Logo"
                value={formData.logo}
                onChange={(url) => setFormData({ ...formData, logo: url })}
                type="logo"
              />

              <ImageUploadField
                label="Favicon"
                value={formData.favicon}
                onChange={(url) => setFormData({ ...formData, favicon: url })}
                type="icon"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics & Tracking</CardTitle>
              <CardDescription>Configure analytics and tracking codes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                <Input
                  id="googleAnalyticsId"
                  value={formData.googleAnalyticsId}
                  onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-gray-500">Enter your Google Analytics 4 Measurement ID</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                <Input
                  id="facebookPixelId"
                  value={formData.facebookPixelId}
                  onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
                  placeholder="XXXXXXXXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security options for your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable CAPTCHA on Forms</Label>
                  <p className="text-xs text-gray-500">Protect forms from spam and bots</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.enableCaptcha}
                  onChange={(e) => setFormData({ ...formData, enableCaptcha: e.target.checked })}
                  className="w-4 h-4"
                />
              </div>

              {formData.enableCaptcha && (
                <div className="space-y-2">
                  <Label htmlFor="captchaSiteKey">reCAPTCHA Site Key</Label>
                  <Input
                    id="captchaSiteKey"
                    value={formData.captchaSiteKey}
                    onChange={(e) => setFormData({ ...formData, captchaSiteKey: e.target.value })}
                    placeholder="Enter your reCAPTCHA site key"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
