"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { useWebsite } from "@/lib/contexts/website-context"
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ServiceTab {
  id: string
  title: string
  number: string
  heading: string
  description: string[]
  image: string
}

interface DivisionContent {
  hero: {
    title: string
    subtitle: string
    backgroundImage: string
  }
  about: {
    badge: string
    title: string
    description: string[]
  }
  services: {
    badge: string
    title: string
    subtitle: string
    tabs: ServiceTab[]
  }
}

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export default function DivisionDetailEditor() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<DivisionContent | null>(null)
  const [divisionName, setDivisionName] = useState("")

  useEffect(() => {
    if (currentWebsite?.slug && slug) {
      fetchContent()
    }
  }, [currentWebsite?.slug, slug])

  const fetchContent = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/pages/divisions/${slug}/content?tenant=${currentWebsite?.slug}`
      )
      const data = await response.json()

      if (data.content) {
        setContent(data.content)
        // Try to get division name
        const divResponse = await fetch(`/api/divisions?tenant=${currentWebsite?.slug}`)
        const divData = await divResponse.json()
        const div = divData.divisions?.find((d: any) => d.slug === slug)
        if (div) {
          setDivisionName(div.name)
        }
      }
    } catch (error) {
      console.error("Failed to fetch content:", error)
      toast({
        title: "Error",
        description: "Failed to load division content",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!content) return

    try {
      setSaving(true)
      const response = await fetch(
        `/api/pages/divisions/${slug}/content?tenant=${currentWebsite.slug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }
      )

      if (response.ok) {
        toast({
          title: "Success",
          description: "Division content saved successfully",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Failed to save content:", error)
      toast({
        title: "Error",
        description: "Failed to save division content",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (field: keyof DivisionContent["hero"], value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    })
  }

  const updateAbout = (field: keyof DivisionContent["about"], value: string | string[]) => {
    if (!content) return
    setContent({
      ...content,
      about: { ...content.about, [field]: value },
    })
  }

  const updateServices = (field: keyof DivisionContent["services"], value: any) => {
    if (!content) return
    setContent({
      ...content,
      services: { ...content.services, [field]: value },
    })
  }

  const addServiceTab = () => {
    if (!content) return
    const newTab: ServiceTab = {
      id: generateId(),
      title: "New Service",
      number: String(content.services.tabs.length + 1).padStart(2, "0"),
      heading: "New Service",
      description: ["Service description here"],
      image: "/images/project-1.png",
    }
    updateServices("tabs", [...content.services.tabs, newTab])
  }

  const updateServiceTab = (index: number, field: keyof ServiceTab, value: any) => {
    if (!content) return
    const tabs = [...content.services.tabs]
    tabs[index] = { ...tabs[index], [field]: value }
    updateServices("tabs", tabs)
  }

  const removeServiceTab = (index: number) => {
    if (!content) return
    const tabs = content.services.tabs.filter((_, i) => i !== index)
    updateServices("tabs", tabs)
  }

  const addAboutDescription = () => {
    if (!content) return
    updateAbout("description", [...content.about.description, "New paragraph"])
  }

  const updateAboutDescription = (index: number, value: string) => {
    if (!content) return
    const desc = [...content.about.description]
    desc[index] = value
    updateAbout("description", desc)
  }

  const removeAboutDescription = (index: number) => {
    if (!content) return
    const desc = content.about.description.filter((_, i) => i !== index)
    updateAbout("description", desc)
  }

  const addTabDescription = (tabIndex: number) => {
    if (!content) return
    const tabs = [...content.services.tabs]
    tabs[tabIndex].description = [...tabs[tabIndex].description, "New paragraph"]
    updateServices("tabs", tabs)
  }

  const updateTabDescription = (tabIndex: number, descIndex: number, value: string) => {
    if (!content) return
    const tabs = [...content.services.tabs]
    tabs[tabIndex].description[descIndex] = value
    updateServices("tabs", tabs)
  }

  const removeTabDescription = (tabIndex: number, descIndex: number) => {
    if (!content) return
    const tabs = [...content.services.tabs]
    tabs[tabIndex].description = tabs[tabIndex].description.filter((_, i) => i !== descIndex)
    updateServices("tabs", tabs)
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please select a website first</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Division not found</p>
          <Button onClick={() => router.push("/admin/dashboard/pages/divisions")}>
            Back to Divisions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/dashboard/pages/divisions")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Division</h1>
            <p className="text-muted-foreground">{divisionName || slug}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="services">Services Section</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content for the division page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Textarea
                  id="hero-title"
                  value={content.hero.title}
                  onChange={(e) => updateHero("title", e.target.value)}
                  rows={3}
                  placeholder="Enter hero title"
                />
                <p className="text-sm text-muted-foreground mt-1">Use \n for line breaks</p>
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={content.hero.subtitle}
                  onChange={(e) => updateHero("subtitle", e.target.value)}
                  rows={2}
                  placeholder="Enter hero subtitle"
                />
              </div>

              <div>
                <Label>Background Image</Label>
                <ImageUploadField
                  value={content.hero.backgroundImage}
                  onChange={(value) => updateHero("backgroundImage", value)}
                  label="Upload background image"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Information about the division</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="about-badge">Badge</Label>
                <Input
                  id="about-badge"
                  value={content.about.badge}
                  onChange={(e) => updateAbout("badge", e.target.value)}
                  placeholder="e.g., About KISAN PLANTIQ"
                />
              </div>

              <div>
                <Label htmlFor="about-title">Title</Label>
                <Textarea
                  id="about-title"
                  value={content.about.title}
                  onChange={(e) => updateAbout("title", e.target.value)}
                  rows={2}
                  placeholder="Enter about title"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Description Paragraphs</Label>
                  <Button onClick={addAboutDescription} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Paragraph
                  </Button>
                </div>

                {content.about.description.map((para, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={para}
                      onChange={(e) => updateAboutDescription(index, e.target.value)}
                      rows={3}
                      placeholder={`Paragraph ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAboutDescription(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Services Section Header</CardTitle>
              <CardDescription>General services section information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="services-badge">Badge</Label>
                <Input
                  id="services-badge"
                  value={content.services.badge}
                  onChange={(e) => updateServices("badge", e.target.value)}
                  placeholder="e.g., Our Services"
                />
              </div>

              <div>
                <Label htmlFor="services-title">Title</Label>
                <Textarea
                  id="services-title"
                  value={content.services.title}
                  onChange={(e) => updateServices("title", e.target.value)}
                  rows={3}
                  placeholder="Enter services title"
                />
                <p className="text-sm text-muted-foreground mt-1">Use \n for line breaks</p>
              </div>

              <div>
                <Label htmlFor="services-subtitle">Subtitle</Label>
                <Textarea
                  id="services-subtitle"
                  value={content.services.subtitle}
                  onChange={(e) => updateServices("subtitle", e.target.value)}
                  rows={2}
                  placeholder="Enter services subtitle"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Service Tabs</h3>
            <Button onClick={addServiceTab} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Service Tab
            </Button>
          </div>

          {content.services.tabs.map((tab, tabIndex) => (
            <Card key={tab.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tab {tabIndex + 1}: {tab.title}</CardTitle>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeServiceTab(tabIndex)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Tab
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tab ID</Label>
                    <Input
                      value={tab.id}
                      onChange={(e) => updateServiceTab(tabIndex, "id", e.target.value)}
                      placeholder="tab-id"
                    />
                  </div>
                  <div>
                    <Label>Number</Label>
                    <Input
                      value={tab.number}
                      onChange={(e) => updateServiceTab(tabIndex, "number", e.target.value)}
                      placeholder="01"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tab Title (shown in navigation)</Label>
                  <Input
                    value={tab.title}
                    onChange={(e) => updateServiceTab(tabIndex, "title", e.target.value)}
                    placeholder="Service name"
                  />
                </div>

                <div>
                  <Label>Heading (shown in content area)</Label>
                  <Textarea
                    value={tab.heading}
                    onChange={(e) => updateServiceTab(tabIndex, "heading", e.target.value)}
                    rows={2}
                    placeholder="Service heading"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Use \n for line breaks</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Description Paragraphs</Label>
                    <Button
                      onClick={() => addTabDescription(tabIndex)}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Paragraph
                    </Button>
                  </div>

                  {tab.description.map((desc, descIndex) => (
                    <div key={descIndex} className="flex gap-2">
                      <Textarea
                        value={desc}
                        onChange={(e) =>
                          updateTabDescription(tabIndex, descIndex, e.target.value)
                        }
                        rows={2}
                        placeholder={`Paragraph ${descIndex + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTabDescription(tabIndex, descIndex)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div>
                  <Label>Image</Label>
                  <ImageUploadField
                    value={tab.image}
                    onChange={(value) => updateServiceTab(tabIndex, "image", value)}
                    label="Upload service image"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
