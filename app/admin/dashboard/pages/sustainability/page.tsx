"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWebsite } from "@/lib/contexts/website-context"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { Loader2, Save, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Section {
  id: string
  title: string
  description: string[]
  image: string
  layout: "text-left" | "image-left"
}

interface SustainabilityPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  sections: Section[]
}

export default function SustainabilityPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<SustainabilityPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/sustainability/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/sustainability/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Sustainability page saved" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addSection = () => {
    if (!content) return
    setContent({
      ...content,
      sections: [
        ...content.sections,
        {
          id: generateId(),
          title: "",
          description: [""],
          image: "",
          layout: "text-left",
        },
      ],
    })
  }

  const removeSection = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      sections: content.sections.filter((s) => s.id !== id),
    })
  }

  const updateSection = (id: string, field: keyof Section, value: any) => {
    if (!content) return
    setContent({
      ...content,
      sections: content.sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    })
  }

  const addParagraphToSection = (sectionId: string) => {
    if (!content) return
    setContent({
      ...content,
      sections: content.sections.map((s) =>
        s.id === sectionId ? { ...s, description: [...s.description, ""] } : s,
      ),
    })
  }

  const removeParagraphFromSection = (sectionId: string, paraIndex: number) => {
    if (!content) return
    setContent({
      ...content,
      sections: content.sections.map((s) =>
        s.id === sectionId
          ? { ...s, description: s.description.filter((_, i) => i !== paraIndex) }
          : s,
      ),
    })
  }

  const updateParagraph = (sectionId: string, paraIndex: number, value: string) => {
    if (!content) return
    setContent({
      ...content,
      sections: content.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              description: s.description.map((p, i) => (i === paraIndex ? value : p)),
            }
          : s,
      ),
    })
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (!content) return null

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sustainability Page Content</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList>
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={content.hero?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      hero: { ...content.hero, title: e.target.value },
                    })
                  }
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content.hero?.backgroundImage || ""}
                onChange={(url) =>
                  setContent({
                    ...content,
                    hero: { ...content.hero, backgroundImage: url },
                  })
                }
                accept="image/*"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sections Tab */}
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.sections?.map((section, sectionIdx) => (
                <Card key={section.id}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Section {sectionIdx + 1}</h3>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeSection(section.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove Section
                      </Button>
                    </div>

                    <div>
                      <Label>Title (use \n for line breaks)</Label>
                      <Input
                        value={section.title}
                        onChange={(e) => updateSection(section.id, "title", e.target.value)}
                        placeholder="e.g., Sustainability &\nGovernment Initiatives"
                      />
                    </div>

                    <div>
                      <Label>Layout</Label>
                      <Select
                        value={section.layout}
                        onValueChange={(value) =>
                          updateSection(section.id, "layout", value as "text-left" | "image-left")
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-left">Text Left, Image Right</SelectItem>
                          <SelectItem value="image-left">Image Left, Text Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <ImageUploadField
                      label="Section Image"
                      value={section.image}
                      onChange={(url) => updateSection(section.id, "image", url)}
                      accept="image/*"
                    />

                    <div className="space-y-2">
                      <Label>Description Paragraphs</Label>
                      {section.description?.map((para, paraIdx) => (
                        <div key={paraIdx} className="flex gap-2">
                          <Textarea
                            value={para}
                            onChange={(e) => updateParagraph(section.id, paraIdx, e.target.value)}
                            rows={3}
                            placeholder={`Paragraph ${paraIdx + 1}`}
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeParagraphFromSection(section.id, paraIdx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addParagraphToSection(section.id)}
                      >
                        <Plus className="mr-2 h-4 w-4" /> Add Paragraph
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button onClick={addSection} className="w-full">
                <Plus className="mr-2 h-4 w-4" /> Add Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
