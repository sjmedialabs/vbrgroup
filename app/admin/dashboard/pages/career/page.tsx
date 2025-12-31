"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebsite } from "@/lib/contexts/website-context"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CareerPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  intro: {
    badge: string
    title: string
    description: string
  }
  benefits: {
    title: string
    items: { id: string; icon: string; title: string; description: string }[]
  }
  culture: {
    title: string
    description: string
    images: string[]
  }
}

export default function CareerPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<CareerPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/career/content?tenant=${currentWebsite?.slug}`)
      const data = await res.json()
      setContent(data.content)
    } catch (error) {
      console.error("Error fetching content:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content || !currentWebsite) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/career/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Career page saved" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Please select a website first</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Career Page</h2>
          <p className="text-gray-500 mt-1">Manage career page content for {currentWebsite.name}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="culture">Culture</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Page Title</Label>
                <Input
                  value={content?.hero?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, title: e.target.value } } : prev))
                  }
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content?.hero?.backgroundImage || ""}
                onChange={(url) =>
                  setContent((prev) => (prev ? { ...prev, hero: { ...prev.hero, backgroundImage: url } } : prev))
                }
                tenant={currentWebsite.slug}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="intro">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content?.intro?.badge || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, badge: e.target.value } } : prev))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content?.intro?.title || ""}
                  onChange={(e) =>
                    setContent((prev) => (prev ? { ...prev, intro: { ...prev.intro, title: e.target.value } } : prev))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.intro?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, intro: { ...prev.intro, description: e.target.value } } : prev,
                    )
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <Card>
            <CardHeader>
              <CardTitle>Benefits Section</CardTitle>
              <CardDescription>Why join us - benefits and perks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title</Label>
                <Input
                  value={content?.benefits?.title || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, benefits: { ...prev.benefits, title: e.target.value } } : prev,
                    )
                  }
                />
              </div>
              <p className="text-sm text-gray-500">
                Benefits items can be managed in the Careers section under Management.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="culture">
          <Card>
            <CardHeader>
              <CardTitle>Culture Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content?.culture?.title || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, culture: { ...prev.culture, title: e.target.value } } : prev,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.culture?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, culture: { ...prev.culture, description: e.target.value } } : prev,
                    )
                  }
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
