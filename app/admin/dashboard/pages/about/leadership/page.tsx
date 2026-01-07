"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebsite } from "@/lib/contexts/website-context"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LeadershipPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  content: {
    badge: string
    title: string
    paragraphs: string[]
    image: string
  }
}

export default function LeadershipPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<LeadershipPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/about/leadership/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/about/leadership/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Leadership page saved" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const addParagraph = () => {
    if (!content) return
    setContent({
      ...content,
      content: {
        ...content.content,
        paragraphs: [...content.content.paragraphs, ""],
      },
    })
  }

  const removeParagraph = (index: number) => {
    if (!content) return
    setContent({
      ...content,
      content: {
        ...content.content,
        paragraphs: content.content.paragraphs.filter((_, i) => i !== index),
      },
    })
  }

  const updateParagraph = (index: number, value: string) => {
    if (!content) return
    const newParagraphs = [...content.content.paragraphs]
    newParagraphs[index] = value
    setContent({
      ...content,
      content: {
        ...content.content,
        paragraphs: newParagraphs,
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Leadership Page</h2>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="content">Content Section</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                  placeholder="Our Leadership"
                />
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <ImageUploadField
                  value={content.hero.backgroundImage}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, backgroundImage: url },
                    })
                  }
                  label="Upload Hero Background"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Section */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input
                  value={content.content.badge}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      content: { ...content.content, badge: e.target.value },
                    })
                  }
                  placeholder="Leadership"
                />
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.content.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      content: { ...content.content, title: e.target.value },
                    })
                  }
                  placeholder="Visionary Leaders Driving Innovation"
                />
              </div>

              <div className="space-y-2">
                <Label>Image</Label>
                <ImageUploadField
                  value={content.content.image}
                  onChange={(url) =>
                    setContent({
                      ...content,
                      content: { ...content.content, image: url },
                    })
                  }
                  label="Upload Content Image"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Paragraphs</Label>
                  <Button onClick={addParagraph} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Paragraph
                  </Button>
                </div>

                {content.content.paragraphs.map((paragraph, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Paragraph {index + 1}</Label>
                      {content.content.paragraphs.length > 1 && (
                        <Button onClick={() => removeParagraph(index)} size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                    <Textarea
                      value={paragraph}
                      onChange={(e) => updateParagraph(index, e.target.value)}
                      placeholder="Enter paragraph content..."
                      rows={4}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
