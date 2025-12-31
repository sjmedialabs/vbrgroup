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
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  image: string
  ctaText: string
  ctaLink: string
}

interface Feature {
  id: string
  icon: string
  title: string
  description: string
}

interface Division {
  id: string
  name: string
  subtitle: string
  image: string
  link: string
}

interface HomePageContent {
  hero: {
    slides: HeroSlide[]
  }
  about: {
    badge: string
    title: string
    subtitle: string
    description: string
    features: Feature[]
    ctaText: string
    ctaLink: string
  }
  divisions: {
    badge: string
    title: string
    description: string
    backgroundImage: string
    items: Division[]
    ctaText: string
    ctaLink: string
  }
  sustainability: {
    badge: string
    title: string
    description: string
    image: string
    videoUrl: string
    features: { id: string; icon: string; title: string; description: string }[]
    stats: { value: string; label: string }
    ctaText: string
    ctaLink: string
  }
  projects: {
    badge: string
    title: string
    items: { id: string; title: string; location: string; description: string; image: string }[]
    ctaText: string
    ctaLink: string
  }
  testimonials: {
    badge: string
    title: string
    subtitle: string
    items: { id: string; name: string; role: string; content: string; avatar: string; rating: number }[]
  }
}

export default function HomePageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<HomePageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/home/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/home/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "Home page content saved successfully" })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save content", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const generateId = () => Math.random().toString(36).substr(2, 9)

  const addHeroSlide = () => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slides: [
          ...content.hero.slides,
          { id: generateId(), title: "", subtitle: "", image: "", ctaText: "", ctaLink: "" },
        ],
      },
    })
  }

  const removeHeroSlide = (id: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slides: content.hero.slides.filter((s) => s.id !== id),
      },
    })
  }

  const updateHeroSlide = (id: string, field: keyof HeroSlide, value: string) => {
    if (!content) return
    setContent({
      ...content,
      hero: {
        ...content.hero,
        slides: content.hero.slides.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
      },
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Home Page</h2>
          <p className="text-gray-500 mt-1">Manage home page sections for {currentWebsite.name}</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#2d8a39] hover:bg-[#236b2d]">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="divisions">Divisions</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Hero Carousel</CardTitle>
                  <CardDescription>Manage hero slider images and content</CardDescription>
                </div>
                <Button onClick={addHeroSlide} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Slide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {content?.hero?.slides?.map((slide, index) => (
                <div key={slide.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">Slide {index + 1}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeHeroSlide(slide.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={slide.title}
                        onChange={(e) => updateHeroSlide(slide.id, "title", e.target.value)}
                        placeholder="Enter slide title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtitle</Label>
                      <Input
                        value={slide.subtitle}
                        onChange={(e) => updateHeroSlide(slide.id, "subtitle", e.target.value)}
                        placeholder="Enter slide subtitle"
                      />
                    </div>
                  </div>
                  <ImageUploadField
                    label="Background Image"
                    value={slide.image}
                    onChange={(url) => updateHeroSlide(slide.id, "image", url)}
                    tenant={currentWebsite.slug}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>CTA Button Text</Label>
                      <Input
                        value={slide.ctaText}
                        onChange={(e) => updateHeroSlide(slide.id, "ctaText", e.target.value)}
                        placeholder="e.g., Learn More"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>CTA Button Link</Label>
                      <Input
                        value={slide.ctaLink}
                        onChange={(e) => updateHeroSlide(slide.id, "ctaLink", e.target.value)}
                        placeholder="e.g., /about"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!content?.hero?.slides || content.hero.slides.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  No slides yet. Click "Add Slide" to create your first hero slide.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Section</CardTitle>
              <CardDescription>Content shown in the about section on home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.about?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) => (prev ? { ...prev, about: { ...prev.about, badge: e.target.value } } : prev))
                    }
                    placeholder="e.g., About Kisan Plant Technologies"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.about?.title || ""}
                    onChange={(e) =>
                      setContent((prev) => (prev ? { ...prev, about: { ...prev.about, title: e.target.value } } : prev))
                    }
                    placeholder="e.g., Built on Quality. Driven by Innovation"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content?.about?.subtitle || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, about: { ...prev.about, subtitle: e.target.value } } : prev,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.about?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, about: { ...prev.about, description: e.target.value } } : prev,
                    )
                  }
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={content?.about?.ctaText || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, about: { ...prev.about, ctaText: e.target.value } } : prev,
                      )
                    }
                    placeholder="e.g., Explore More"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={content?.about?.ctaLink || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, about: { ...prev.about, ctaLink: e.target.value } } : prev,
                      )
                    }
                    placeholder="e.g., /about"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Divisions Section */}
        <TabsContent value="divisions">
          <Card>
            <CardHeader>
              <CardTitle>Divisions Section</CardTitle>
              <CardDescription>Manage divisions displayed on home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.divisions?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, divisions: { ...prev.divisions, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.divisions?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, divisions: { ...prev.divisions, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.divisions?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, divisions: { ...prev.divisions, description: e.target.value } } : prev,
                    )
                  }
                  rows={3}
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content?.divisions?.backgroundImage || ""}
                onChange={(url) =>
                  setContent((prev) =>
                    prev ? { ...prev, divisions: { ...prev.divisions, backgroundImage: url } } : prev,
                  )
                }
                tenant={currentWebsite.slug}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sustainability Section */}
        <TabsContent value="sustainability">
          <Card>
            <CardHeader>
              <CardTitle>Sustainability Section</CardTitle>
              <CardDescription>Content for sustainability section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.sustainability?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, sustainability: { ...prev.sustainability, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.sustainability?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, sustainability: { ...prev.sustainability, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content?.sustainability?.description || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev
                        ? { ...prev, sustainability: { ...prev.sustainability, description: e.target.value } }
                        : prev,
                    )
                  }
                  rows={3}
                />
              </div>
              <ImageUploadField
                label="Main Image"
                value={content?.sustainability?.image || ""}
                onChange={(url) =>
                  setContent((prev) =>
                    prev ? { ...prev, sustainability: { ...prev.sustainability, image: url } } : prev,
                  )
                }
                tenant={currentWebsite.slug}
              />
              <div className="space-y-2">
                <Label>Video URL (YouTube/Vimeo embed)</Label>
                <Input
                  value={content?.sustainability?.videoUrl || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, sustainability: { ...prev.sustainability, videoUrl: e.target.value } } : prev,
                    )
                  }
                  placeholder="https://youtube.com/embed/..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Projects Section */}
        <TabsContent value="projects">
          <Card>
            <CardHeader>
              <CardTitle>Projects Section</CardTitle>
              <CardDescription>Featured projects on home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.projects?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.projects?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>CTA Text</Label>
                  <Input
                    value={content?.projects?.ctaText || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, ctaText: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Link</Label>
                  <Input
                    value={content?.projects?.ctaLink || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, projects: { ...prev.projects, ctaLink: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials Section</CardTitle>
              <CardDescription>Customer testimonials displayed on home page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Badge Text</Label>
                  <Input
                    value={content?.testimonials?.badge || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, testimonials: { ...prev.testimonials, badge: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={content?.testimonials?.title || ""}
                    onChange={(e) =>
                      setContent((prev) =>
                        prev ? { ...prev, testimonials: { ...prev.testimonials, title: e.target.value } } : prev,
                      )
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content?.testimonials?.subtitle || ""}
                  onChange={(e) =>
                    setContent((prev) =>
                      prev ? { ...prev, testimonials: { ...prev.testimonials, subtitle: e.target.value } } : prev,
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
