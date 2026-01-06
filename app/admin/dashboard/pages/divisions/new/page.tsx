"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { useWebsite } from "@/lib/contexts/website-context"
import { Loader2, ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function generateId() {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

interface ServiceTab {
  id: string
  title: string
  number: string
  heading: string
  description: string[]
  image: string
}

export default function NewDivisionPage() {
  const router = useRouter()
  const { currentWebsite } = useWebsite()
  const { toast } = useToast()

  const [creating, setCreating] = useState(false)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [tagline, setTagline] = useState("")
  const [subtitle, setSubtitle] = useState("")

  // Page content
  const [heroTitle, setHeroTitle] = useState("")
  const [heroSubtitle, setHeroSubtitle] = useState("")
  const [heroImage, setHeroImage] = useState("/images/banner-2.png")

  const [aboutBadge, setAboutBadge] = useState("About")
  const [aboutTitle, setAboutTitle] = useState("")
  const [aboutDescription, setAboutDescription] = useState<string[]>([""])

  const [servicesBadge, setServicesBadge] = useState("Our Services")
  const [servicesTitle, setServicesTitle] = useState("")
  const [servicesSubtitle, setServicesSubtitle] = useState("")
  const [serviceTabs, setServiceTabs] = useState<ServiceTab[]>([
    {
      id: "service-1",
      title: "Service 1",
      number: "01",
      heading: "Service 1",
      description: ["Service description here"],
      image: "/images/project-1.png",
    },
  ])

  const handleNameChange = (value: string) => {
    setName(value)
    if (!slugManuallyEdited) {
      setSlug(slugify(value))
    }
    // Auto-populate titles if empty
    if (!heroTitle) setHeroTitle(value)
    if (!aboutTitle) setAboutTitle(value)
    if (!servicesTitle) setServicesTitle(`What ${value} Offers`)
  }

  const handleSlugChange = (value: string) => {
    setSlug(value)
    setSlugManuallyEdited(true)
  }

  const addAboutDescription = () => {
    setAboutDescription([...aboutDescription, ""])
  }

  const updateAboutDescription = (index: number, value: string) => {
    const desc = [...aboutDescription]
    desc[index] = value
    setAboutDescription(desc)
  }

  const removeAboutDescription = (index: number) => {
    setAboutDescription(aboutDescription.filter((_, i) => i !== index))
  }

  const addServiceTab = () => {
    const newTab: ServiceTab = {
      id: generateId(),
      title: `Service ${serviceTabs.length + 1}`,
      number: String(serviceTabs.length + 1).padStart(2, "0"),
      heading: `Service ${serviceTabs.length + 1}`,
      description: ["Service description here"],
      image: "/images/project-1.png",
    }
    setServiceTabs([...serviceTabs, newTab])
  }

  const updateServiceTab = (index: number, field: keyof ServiceTab, value: any) => {
    const tabs = [...serviceTabs]
    tabs[index] = { ...tabs[index], [field]: value }
    setServiceTabs(tabs)
  }

  const removeServiceTab = (index: number) => {
    setServiceTabs(serviceTabs.filter((_, i) => i !== index))
  }

  const addTabDescription = (tabIndex: number) => {
    const tabs = [...serviceTabs]
    tabs[tabIndex].description = [...tabs[tabIndex].description, ""]
    setServiceTabs(tabs)
  }

  const updateTabDescription = (tabIndex: number, descIndex: number, value: string) => {
    const tabs = [...serviceTabs]
    tabs[tabIndex].description[descIndex] = value
    setServiceTabs(tabs)
  }

  const removeTabDescription = (tabIndex: number, descIndex: number) => {
    const tabs = [...serviceTabs]
    tabs[tabIndex].description = tabs[tabIndex].description.filter((_, i) => i !== descIndex)
    setServiceTabs(tabs)
  }

  const handleCreate = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a division name",
        variant: "destructive",
      })
      return
    }

    if (!slug.trim()) {
      toast({
        title: "Error",
        description: "Please enter a slug",
        variant: "destructive",
      })
      return
    }

    try {
      setCreating(true)
      
      // Create division with basic info
      const createResponse = await fetch(`/api/divisions?tenant=${currentWebsite.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          tagline: tagline.trim(),
          subtitle: subtitle.trim(),
        }),
      })

      const createData = await createResponse.json()

      if (!createResponse.ok) {
        throw new Error(createData.error || "Failed to create division")
      }

      // Update with page content
      const pageContent = {
        hero: {
          title: heroTitle || name,
          subtitle: heroSubtitle || tagline,
          backgroundImage: heroImage,
        },
        about: {
          badge: aboutBadge,
          title: aboutTitle || name,
          description: aboutDescription.filter(d => d.trim()),
        },
        services: {
          badge: servicesBadge,
          title: servicesTitle || `What ${name} Offers`,
          subtitle: servicesSubtitle,
          tabs: serviceTabs,
        },
      }

      const updateResponse = await fetch(
        `/api/pages/divisions/${slug.trim()}/content?tenant=${currentWebsite.slug}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: pageContent }),
        }
      )

      if (updateResponse.ok) {
        toast({
          title: "Success",
          description: "Division created successfully",
        })
        router.push(`/admin/dashboard/pages/divisions/${createData.division.slug}`)
      } else {
        throw new Error("Failed to save content")
      }
    } catch (error: any) {
      console.error("Failed to create division:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create division",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  if (!currentWebsite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Please select a website first</p>
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
            <h1 className="text-3xl font-bold">Create New Division</h1>
            <p className="text-muted-foreground">Fill in all details for the new division page</p>
          </div>
        </div>
        <Button onClick={handleCreate} disabled={creating} size="lg">
          {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Division
        </Button>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
          <TabsTrigger value="services">Services Section</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details for the division</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Division Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Kisan PLANTIQ"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="e.g., kisan-plantiq"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Page URL: /divisions/{slug || "your-slug"}
                </p>
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g., Intelligent Greens. Sustainable Tomorrow."
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  rows={2}
                  placeholder="e.g., Plant Supply & Manufacturing Division"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Main banner content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Title</Label>
                <Textarea
                  id="hero-title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  rows={3}
                  placeholder="Enter hero title (use \n for line breaks)"
                />
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Textarea
                  id="hero-subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  rows={2}
                  placeholder="Enter hero subtitle"
                />
              </div>

              <div>
                <Label>Background Image</Label>
                <ImageUploadField
                  value={heroImage}
                  onChange={setHeroImage}
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
                  value={aboutBadge}
                  onChange={(e) => setAboutBadge(e.target.value)}
                  placeholder="e.g., About KISAN PLANTIQ"
                />
              </div>

              <div>
                <Label htmlFor="about-title">Title</Label>
                <Textarea
                  id="about-title"
                  value={aboutTitle}
                  onChange={(e) => setAboutTitle(e.target.value)}
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

                {aboutDescription.map((para, index) => (
                  <div key={index} className="flex gap-2">
                    <Textarea
                      value={para}
                      onChange={(e) => updateAboutDescription(index, e.target.value)}
                      rows={3}
                      placeholder={`Paragraph ${index + 1}`}
                      className="flex-1"
                    />
                    {aboutDescription.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAboutDescription(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="services-badge">Badge</Label>
                <Input
                  id="services-badge"
                  value={servicesBadge}
                  onChange={(e) => setServicesBadge(e.target.value)}
                  placeholder="e.g., Our Services"
                />
              </div>

              <div>
                <Label htmlFor="services-title">Title</Label>
                <Textarea
                  id="services-title"
                  value={servicesTitle}
                  onChange={(e) => setServicesTitle(e.target.value)}
                  rows={3}
                  placeholder="Enter services title (use \n for line breaks)"
                />
              </div>

              <div>
                <Label htmlFor="services-subtitle">Subtitle</Label>
                <Textarea
                  id="services-subtitle"
                  value={servicesSubtitle}
                  onChange={(e) => setServicesSubtitle(e.target.value)}
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

          {serviceTabs.map((tab, tabIndex) => (
            <Card key={tab.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tab {tabIndex + 1}: {tab.title}</CardTitle>
                  {serviceTabs.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeServiceTab(tabIndex)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
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
                  <Label>Tab Title</Label>
                  <Input
                    value={tab.title}
                    onChange={(e) => updateServiceTab(tabIndex, "title", e.target.value)}
                    placeholder="Service name"
                  />
                </div>

                <div>
                  <Label>Heading</Label>
                  <Textarea
                    value={tab.heading}
                    onChange={(e) => updateServiceTab(tabIndex, "heading", e.target.value)}
                    rows={2}
                    placeholder="Service heading (use \n for line breaks)"
                  />
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
                      {tab.description.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTabDescription(tabIndex, descIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
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
