"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import type { Branding } from "@/lib/db/schemas"
import { IMAGE_SIZE_LIMITS } from "@/lib/db/schemas"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { useWebsite } from "@/lib/contexts/website-context"

export default function BrandingPage() {
  const [branding, setBranding] = useState<Branding | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { currentWebsite } = useWebsite()

  useEffect(() => {
    if (!currentWebsite) return
    fetchBranding()
  }, [currentWebsite])

  const fetchBranding = async () => {
    if (!currentWebsite) return
    setLoading(true)
    try {
      const res = await fetch(`/api/branding?tenant=${currentWebsite.slug}`)
      const data = await res.json()
      setBranding(data.branding)
    } catch (error) {
      console.error("Error fetching branding:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!branding || !currentWebsite) return
    setSaving(true)

    try {
      await fetch(`/api/branding?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(branding),
      })
      alert("Branding saved successfully!")
    } catch (error) {
      console.error("Error saving branding:", error)
      alert("Error saving branding")
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: string, value: unknown) => {
    setBranding((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const updateContactInfo = (field: string, value: unknown) => {
    setBranding((prev) =>
      prev
        ? {
            ...prev,
            contactInfo: { ...prev.contactInfo, [field]: value },
          }
        : null,
    )
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!branding) {
    return <div className="text-center py-16">Branding not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Branding Settings</h2>
          <p className="text-gray-500 mt-1">
            Branding for <span className="font-medium">{currentWebsite.name}</span>
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logos</CardTitle>
          <CardDescription>
            Upload your header and footer logos. Max size: {IMAGE_SIZE_LIMITS.logo.maxSize / 1024}KB
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadField
            label="Header Logo"
            value={branding.headerLogo}
            onChange={(url) => updateField("headerLogo", url)}
            imageType="logo"
            aspectRatio="aspect-[3/1]"
            description="Recommended: 300x100px, PNG or SVG"
          />
          <ImageUploadField
            label="Footer Logo"
            value={branding.footerLogo}
            onChange={(url) => updateField("footerLogo", url)}
            imageType="logo"
            aspectRatio="aspect-[3/1]"
            description="Recommended: 300x100px, PNG or SVG"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favicon</CardTitle>
          <CardDescription>
            Upload your website favicon. Max size: {IMAGE_SIZE_LIMITS.icon.maxSize / 1024}KB
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ImageUploadField
            label="Favicon"
            value={branding.favicon || ""}
            onChange={(url) => updateField("favicon", url)}
            imageType="icon"
            aspectRatio="aspect-square"
            description="Recommended: 32x32px or 64x64px, PNG or ICO"
          />
        </CardContent>
      </Card>

      {/* Site Info */}
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic information about your website</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">Site Title</Label>
              <Input
                id="siteTitle"
                value={branding.siteTitle}
                onChange={(e) => updateField("siteTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input id="tagline" value={branding.tagline} onChange={(e) => updateField("tagline", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Text</Label>
            <Input
              id="footerText"
              value={branding.footerText}
              onChange={(e) => updateField("footerText", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright">Copyright Text</Label>
            <Input
              id="copyright"
              value={branding.copyright}
              onChange={(e) => updateField("copyright", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>Define your brand color palette</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="primaryColor"
                value={branding.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={branding.primaryColor}
                onChange={(e) => updateField("primaryColor", e.target.value)}
                placeholder="#2d8a39"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id="secondaryColor"
                value={branding.secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                className="w-16 h-10 p-1"
              />
              <Input
                value={branding.secondaryColor}
                onChange={(e) => updateField("secondaryColor", e.target.value)}
                placeholder="#1e3a1e"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Contact details shown in footer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Addresses (comma separated)</Label>
            <Input
              value={branding.contactInfo?.emails?.join(", ")}
              onChange={(e) =>
                updateContactInfo(
                  "emails",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
              placeholder="support@example.com, sales@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Numbers (comma separated)</Label>
            <Input
              value={branding.contactInfo?.phones?.join(", ")}
              onChange={(e) =>
                updateContactInfo(
                  "phones",
                  e.target.value.split(",").map((s) => s.trim()),
                )
              }
              placeholder="+91 98765 43210, +91 98765 43211"
            />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Textarea
              value={branding.contactInfo?.address}
              onChange={(e) => updateContactInfo("address", e.target.value)}
              placeholder="123 Main Street, City, Country"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Add your social media profiles with uploaded icons</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {branding.socialLinks?.map((link, index) => (
            <div key={link.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium capitalize">{link.platform || "New Link"}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newLinks = branding.socialLinks?.filter((_, i) => i !== index)
                    updateField("socialLinks", newLinks)
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Input
                    value={link.platform}
                    onChange={(e) => {
                      const newLinks = [...(branding.socialLinks || [])]
                      newLinks[index] = { ...link, platform: e.target.value as typeof link.platform }
                      updateField("socialLinks", newLinks)
                    }}
                    placeholder="facebook, instagram, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const newLinks = [...(branding.socialLinks || [])]
                      newLinks[index] = { ...link, url: e.target.value }
                      updateField("socialLinks", newLinks)
                    }}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
              </div>
              <ImageUploadField
                label="Icon"
                value={link.icon}
                onChange={(url) => {
                  const newLinks = [...(branding.socialLinks || [])]
                  newLinks[index] = { ...link, icon: url }
                  updateField("socialLinks", newLinks)
                }}
                imageType="icon"
                aspectRatio="aspect-square"
                description="Recommended: 64x64px, PNG or SVG"
              />
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              const newLinks = [
                ...(branding.socialLinks || []),
                { id: `social-${Date.now()}`, platform: "facebook" as const, url: "", icon: "" },
              ]
              updateField("socialLinks", newLinks)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
