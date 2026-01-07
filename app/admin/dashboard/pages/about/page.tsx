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

interface AboutPageContent {
  hero: {
    title: string
    backgroundImage: string
  }
  story: {
    badge: string
    title: string
    paragraphs: string[]
    features: {
      id: string
      icon: string
      value?: string
      label: string
    }[]
  }
  cards: {
    id: string
    title: string
    description: string
    link: string
    linkText: string
  }[]
  whyChooseUs: {
    badge: string
    title: string
    description: string
    features: {
      id: string
      icon: string
      title: string
      description: string
    }[]
  }
  growth: {
    badge: string
    title: string
    description: string
    backgroundImage: string
    stats: {
      id: string
      value: string
      label: string
    }[]
  }
}

export default function AboutPageAdmin() {
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<AboutPageContent | null>(null)

  useEffect(() => {
    if (currentWebsite) {
      fetchContent()
    }
  }, [currentWebsite])

  const fetchContent = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/pages/about/content?tenant=${currentWebsite?.slug}`)
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
      const res = await fetch(`/api/pages/about/content?tenant=${currentWebsite.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        toast({ title: "Success", description: "About page content saved successfully" })
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
        <h1 className="text-3xl font-bold">About Page Content</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="story">Story</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="whyChooseUs">Why Choose Us</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
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

        {/* Story Tab */}
        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Story Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge</Label>
                <Input
                  value={content.story?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      story: { ...content.story, badge: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.story?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      story: { ...content.story, title: e.target.value },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Paragraphs</Label>
                {content.story?.paragraphs?.map((para, idx) => (
                  <div key={idx} className="flex gap-2">
                    <Textarea
                      value={para}
                      onChange={(e) => {
                        const newParagraphs = [...content.story.paragraphs]
                        newParagraphs[idx] = e.target.value
                        setContent({
                          ...content,
                          story: { ...content.story, paragraphs: newParagraphs },
                        })
                      }}
                      rows={3}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        const newParagraphs = content.story.paragraphs.filter((_, i) => i !== idx)
                        setContent({
                          ...content,
                          story: { ...content.story, paragraphs: newParagraphs },
                        })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setContent({
                      ...content,
                      story: {
                        ...content.story,
                        paragraphs: [...(content.story?.paragraphs || []), ""],
                      },
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Paragraph
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                {content.story?.features?.map((feature, idx) => (
                  <Card key={feature.id}>
                    <CardContent className="pt-4 space-y-2">
                      <ImageUploadField
                        label="Icon"
                        value={feature.icon}
                        onChange={(url) => {
                          const newFeatures = [...content.story.features]
                          newFeatures[idx].icon = url
                          setContent({
                            ...content,
                            story: { ...content.story, features: newFeatures },
                          })
                        }}
                        accept="image/*"
                      />
                      <div>
                        <Label>Value (optional)</Label>
                        <Input
                          value={feature.value || ""}
                          onChange={(e) => {
                            const newFeatures = [...content.story.features]
                            newFeatures[idx].value = e.target.value
                            setContent({
                              ...content,
                              story: { ...content.story, features: newFeatures },
                            })
                          }}
                          placeholder="e.g., 20"
                        />
                      </div>
                      <div>
                        <Label>Label</Label>
                        <Input
                          value={feature.label}
                          onChange={(e) => {
                            const newFeatures = [...content.story.features]
                            newFeatures[idx].label = e.target.value
                            setContent({
                              ...content,
                              story: { ...content.story, features: newFeatures },
                            })
                          }}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newFeatures = content.story.features.filter((_, i) => i !== idx)
                          setContent({
                            ...content,
                            story: { ...content.story, features: newFeatures },
                          })
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setContent({
                      ...content,
                      story: {
                        ...content.story,
                        features: [
                          ...(content.story?.features || []),
                          { id: generateId(), icon: "", label: "" },
                        ],
                      },
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Info Cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.cards?.map((card, idx) => (
                <Card key={card.id}>
                  <CardContent className="pt-4 space-y-2">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={card.title}
                        onChange={(e) => {
                          const newCards = [...content.cards]
                          newCards[idx].title = e.target.value
                          setContent({ ...content, cards: newCards })
                        }}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={card.description}
                        onChange={(e) => {
                          const newCards = [...content.cards]
                          newCards[idx].description = e.target.value
                          setContent({ ...content, cards: newCards })
                        }}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Link</Label>
                      <Input
                        value={card.link}
                        onChange={(e) => {
                          const newCards = [...content.cards]
                          newCards[idx].link = e.target.value
                          setContent({ ...content, cards: newCards })
                        }}
                      />
                    </div>
                    <div>
                      <Label>Link Text</Label>
                      <Input
                        value={card.linkText}
                        onChange={(e) => {
                          const newCards = [...content.cards]
                          newCards[idx].linkText = e.target.value
                          setContent({ ...content, cards: newCards })
                        }}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newCards = content.cards.filter((_, i) => i !== idx)
                        setContent({ ...content, cards: newCards })
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove
                    </Button>
                  </CardContent>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setContent({
                    ...content,
                    cards: [
                      ...(content.cards || []),
                      {
                        id: generateId(),
                        title: "",
                        description: "",
                        link: "",
                        linkText: "",
                      },
                    ],
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" /> Add Card
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Why Choose Us Tab */}
        <TabsContent value="whyChooseUs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Why Choose Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge</Label>
                <Input
                  value={content.whyChooseUs?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChooseUs: { ...content.whyChooseUs, badge: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.whyChooseUs?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChooseUs: { ...content.whyChooseUs, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.whyChooseUs?.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      whyChooseUs: { ...content.whyChooseUs, description: e.target.value },
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Features</Label>
                {content.whyChooseUs?.features?.map((feature, idx) => (
                  <Card key={feature.id}>
                    <CardContent className="pt-4 space-y-2">
                      <ImageUploadField
                        label="Icon"
                        value={feature.icon}
                        onChange={(url) => {
                          const newFeatures = [...content.whyChooseUs.features]
                          newFeatures[idx].icon = url
                          setContent({
                            ...content,
                            whyChooseUs: { ...content.whyChooseUs, features: newFeatures },
                          })
                        }}
                        accept="image/*"
                      />
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...content.whyChooseUs.features]
                            newFeatures[idx].title = e.target.value
                            setContent({
                              ...content,
                              whyChooseUs: { ...content.whyChooseUs, features: newFeatures },
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...content.whyChooseUs.features]
                            newFeatures[idx].description = e.target.value
                            setContent({
                              ...content,
                              whyChooseUs: { ...content.whyChooseUs, features: newFeatures },
                            })
                          }}
                          rows={2}
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newFeatures = content.whyChooseUs.features.filter((_, i) => i !== idx)
                          setContent({
                            ...content,
                            whyChooseUs: { ...content.whyChooseUs, features: newFeatures },
                          })
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Remove
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setContent({
                      ...content,
                      whyChooseUs: {
                        ...content.whyChooseUs,
                        features: [
                          ...(content.whyChooseUs?.features || []),
                          { id: generateId(), icon: "", title: "", description: "" },
                        ],
                      },
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Growth Tab */}
        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth in Numbers Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Badge</Label>
                <Input
                  value={content.growth?.badge || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      growth: { ...content.growth, badge: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.growth?.title || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      growth: { ...content.growth, title: e.target.value },
                    })
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.growth?.description || ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      growth: { ...content.growth, description: e.target.value },
                    })
                  }
                  rows={2}
                />
              </div>
              <ImageUploadField
                label="Background Image"
                value={content.growth?.backgroundImage || ""}
                onChange={(url) =>
                  setContent({
                    ...content,
                    growth: { ...content.growth, backgroundImage: url },
                  })
                }
                accept="image/*"
              />

              <div className="space-y-2">
                <Label>Stats</Label>
                {content.growth?.stats?.map((stat, idx) => (
                  <Card key={stat.id}>
                    <CardContent className="pt-4 space-y-2 flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...content.growth.stats]
                            newStats[idx].value = e.target.value
                            setContent({
                              ...content,
                              growth: { ...content.growth, stats: newStats },
                            })
                          }}
                          placeholder="e.g., 98%"
                        />
                      </div>
                      <div className="flex-1">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...content.growth.stats]
                            newStats[idx].label = e.target.value
                            setContent({
                              ...content,
                              growth: { ...content.growth, stats: newStats },
                            })
                          }}
                          placeholder="e.g., Client Satisfaction"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          const newStats = content.growth.stats.filter((_, i) => i !== idx)
                          setContent({
                            ...content,
                            growth: { ...content.growth, stats: newStats },
                          })
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setContent({
                      ...content,
                      growth: {
                        ...content.growth,
                        stats: [...(content.growth?.stats || []), { id: generateId(), value: "", label: "" }],
                      },
                    })
                  }
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Stat
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
