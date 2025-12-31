"use client"

import { useState } from "react"
import type {
  PageSection,
  HeroSlide,
  StatItem,
  DivisionItem,
  ProjectItem,
  TestimonialItem,
  FeatureItem,
} from "@/lib/db/schemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, ChevronUp, ChevronDown, Plus, ImageIcon } from "lucide-react"
import { MediaPicker } from "./media-picker"

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
}

interface SectionEditorProps {
  section: PageSection
  onUpdate: (content: PageSection["content"]) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function SectionEditor({ section, onUpdate, onDelete, onMoveUp, onMoveDown }: SectionEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null)

  const openMediaPicker = (callback: (url: string) => void) => {
    setMediaCallback(() => callback)
    setShowMediaPicker(true)
  }

  const handleMediaSelect = (url: string) => {
    if (mediaCallback) {
      mediaCallback(url)
    }
    setShowMediaPicker(false)
    setMediaCallback(null)
  }

  const renderEditor = () => {
    switch (section.type) {
      case "hero":
        return <HeroEditor content={section.content} onUpdate={onUpdate} openMediaPicker={openMediaPicker} />
      case "about":
        return <AboutEditor content={section.content} onUpdate={onUpdate} openMediaPicker={openMediaPicker} />
      case "divisions":
        return <DivisionsEditor content={section.content} onUpdate={onUpdate} openMediaPicker={openMediaPicker} />
      case "projects":
        return <ProjectsEditor content={section.content} onUpdate={onUpdate} openMediaPicker={openMediaPicker} />
      case "testimonials":
        return <TestimonialsEditor content={section.content} onUpdate={onUpdate} openMediaPicker={openMediaPicker} />
      case "sustainability":
        return <SustainabilityEditor content={section.content} onUpdate={onUpdate} openMediaPicker={openMediaPicker} />
      case "custom":
        return <CustomEditor content={section.content} onUpdate={onUpdate} />
      default:
        return <div className="text-gray-500">Editor not available for this section type</div>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="text-lg font-semibold capitalize">{section.type.replace("-", " ")} Section</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onMoveUp}>
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onMoveDown}>
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onDelete} className="text-red-500 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {renderEditor()}
      {showMediaPicker && <MediaPicker onSelect={handleMediaSelect} onClose={() => setShowMediaPicker(false)} />}
    </div>
  )
}

function HeroEditor({
  content,
  onUpdate,
  openMediaPicker,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
  openMediaPicker: (callback: (url: string) => void) => void
}) {
  const slides = content.slides || []

  const updateSlide = (index: number, updates: Partial<HeroSlide>) => {
    const newSlides = [...slides]
    newSlides[index] = { ...newSlides[index], ...updates }
    onUpdate({ ...content, slides: newSlides })
  }

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: generateId(),
      image: "/images/banner-1.png",
      title: "New Slide",
      subtitle: "Subtitle here",
    }
    onUpdate({ ...content, slides: [...slides, newSlide] })
  }

  const removeSlide = (index: number) => {
    onUpdate({ ...content, slides: slides.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {slides.map((slide, index) => (
        <div key={slide.id} className="p-4 border rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Slide {index + 1}</h4>
            <Button variant="ghost" size="sm" onClick={() => removeSlide(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Background Image</Label>
              <div className="flex gap-2">
                <Input value={slide.image} onChange={(e) => updateSlide(index, { image: e.target.value })} />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => openMediaPicker((url) => updateSlide(index, { image: url }))}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Badge (optional)</Label>
              <Input
                value={slide.badge || ""}
                onChange={(e) => updateSlide(index, { badge: e.target.value })}
                placeholder="e.g., KISAN AGRIQ"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={slide.title} onChange={(e) => updateSlide(index, { title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input value={slide.subtitle} onChange={(e) => updateSlide(index, { subtitle: e.target.value })} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Button Text</Label>
              <Input
                value={slide.buttonPrimaryText || ""}
                onChange={(e) => updateSlide(index, { buttonPrimaryText: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Secondary Button Text</Label>
              <Input
                value={slide.buttonSecondaryText || ""}
                onChange={(e) => updateSlide(index, { buttonSecondaryText: e.target.value })}
              />
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" onClick={addSlide} className="w-full bg-transparent">
        <Plus className="mr-2 h-4 w-4" />
        Add Slide
      </Button>
    </div>
  )
}

function AboutEditor({
  content,
  onUpdate,
  openMediaPicker,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
  openMediaPicker: (callback: (url: string) => void) => void
}) {
  const stats = content.stats || []

  const updateStat = (index: number, updates: Partial<StatItem>) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], ...updates }
    onUpdate({ ...content, stats: newStats })
  }

  const addStat = () => {
    const newStat: StatItem = {
      id: generateId(),
      icon: "/images/20-plus-experience.png",
      value: "20+",
      label: "New Stat",
    }
    onUpdate({ ...content, stats: [...stats, newStat] })
  }

  const removeStat = (index: number) => {
    onUpdate({ ...content, stats: stats.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Badge</Label>
        <Input value={content.badge || ""} onChange={(e) => onUpdate({ ...content, badge: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ""} onChange={(e) => onUpdate({ ...content, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => onUpdate({ ...content, description: e.target.value })}
          rows={4}
        />
      </div>
      <div className="space-y-4">
        <Label>Stats</Label>
        {stats.map((stat, index) => (
          <div key={stat.id} className="flex items-center gap-3 p-3 border rounded-lg">
            <div className="flex-1 grid grid-cols-3 gap-3">
              <div className="flex gap-2">
                <Input
                  value={stat.icon}
                  onChange={(e) => updateStat(index, { icon: e.target.value })}
                  placeholder="Icon URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => openMediaPicker((url) => updateStat(index, { icon: url }))}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={stat.value}
                onChange={(e) => updateStat(index, { value: e.target.value })}
                placeholder="Value"
              />
              <Input
                value={stat.label}
                onChange={(e) => updateStat(index, { label: e.target.value })}
                placeholder="Label"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => removeStat(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addStat}>
          <Plus className="mr-2 h-4 w-4" />
          Add Stat
        </Button>
      </div>
      <div className="space-y-2">
        <Label>Button Text</Label>
        <Input
          value={content.buttonText || ""}
          onChange={(e) => onUpdate({ ...content, buttonText: e.target.value })}
        />
      </div>
    </div>
  )
}

function DivisionsEditor({
  content,
  onUpdate,
  openMediaPicker,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
  openMediaPicker: (callback: (url: string) => void) => void
}) {
  const divisions = content.divisions || []

  const updateDivision = (index: number, updates: Partial<DivisionItem>) => {
    const newDivisions = [...divisions]
    newDivisions[index] = { ...newDivisions[index], ...updates }
    onUpdate({ ...content, divisions: newDivisions })
  }

  const addDivision = () => {
    const newDivision: DivisionItem = {
      id: generateId(),
      image: "/images/kisan-plantiq.png",
      title: "New Division",
      subtitle: "Description here",
      link: "#",
    }
    onUpdate({ ...content, divisions: [...divisions, newDivision] })
  }

  const removeDivision = (index: number) => {
    onUpdate({ ...content, divisions: divisions.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Badge</Label>
        <Input value={content.badge || ""} onChange={(e) => onUpdate({ ...content, badge: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ""} onChange={(e) => onUpdate({ ...content, title: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => onUpdate({ ...content, description: e.target.value })}
          rows={3}
        />
      </div>
      <div className="space-y-4">
        <Label>Divisions</Label>
        {divisions.map((div, index) => (
          <div key={div.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Division {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeDivision(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex gap-2">
                <Input
                  value={div.image}
                  onChange={(e) => updateDivision(index, { image: e.target.value })}
                  placeholder="Image URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => openMediaPicker((url) => updateDivision(index, { image: url }))}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={div.title}
                onChange={(e) => updateDivision(index, { title: e.target.value })}
                placeholder="Title"
              />
            </div>
            <Input
              value={div.subtitle}
              onChange={(e) => updateDivision(index, { subtitle: e.target.value })}
              placeholder="Subtitle"
            />
            <Input
              value={div.link}
              onChange={(e) => updateDivision(index, { link: e.target.value })}
              placeholder="Link URL"
            />
          </div>
        ))}
        <Button variant="outline" onClick={addDivision}>
          <Plus className="mr-2 h-4 w-4" />
          Add Division
        </Button>
      </div>
    </div>
  )
}

function ProjectsEditor({
  content,
  onUpdate,
  openMediaPicker,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
  openMediaPicker: (callback: (url: string) => void) => void
}) {
  const projects = content.projects || []

  const updateProject = (index: number, updates: Partial<ProjectItem>) => {
    const newProjects = [...projects]
    newProjects[index] = { ...newProjects[index], ...updates }
    onUpdate({ ...content, projects: newProjects })
  }

  const addProject = () => {
    const newProject: ProjectItem = {
      id: generateId(),
      image: "/images/project-1.png",
      title: "New Project",
      location: "Location",
      description: "Description here",
    }
    onUpdate({ ...content, projects: [...projects, newProject] })
  }

  const removeProject = (index: number) => {
    onUpdate({ ...content, projects: projects.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Badge</Label>
        <Input value={content.badge || ""} onChange={(e) => onUpdate({ ...content, badge: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ""} onChange={(e) => onUpdate({ ...content, title: e.target.value })} />
      </div>
      <div className="space-y-4">
        <Label>Projects</Label>
        {projects.map((project, index) => (
          <div key={project.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Project {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeProject(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value={project.image}
                onChange={(e) => updateProject(index, { image: e.target.value })}
                placeholder="Image URL"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => openMediaPicker((url) => updateProject(index, { image: url }))}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                value={project.title}
                onChange={(e) => updateProject(index, { title: e.target.value })}
                placeholder="Title"
              />
              <Input
                value={project.location}
                onChange={(e) => updateProject(index, { location: e.target.value })}
                placeholder="Location"
              />
            </div>
            <Textarea
              value={project.description}
              onChange={(e) => updateProject(index, { description: e.target.value })}
              placeholder="Description"
              rows={2}
            />
          </div>
        ))}
        <Button variant="outline" onClick={addProject}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>
    </div>
  )
}

function TestimonialsEditor({
  content,
  onUpdate,
  openMediaPicker,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
  openMediaPicker: (callback: (url: string) => void) => void
}) {
  const testimonials = content.testimonials || []

  const updateTestimonial = (index: number, updates: Partial<TestimonialItem>) => {
    const newTestimonials = [...testimonials]
    newTestimonials[index] = { ...newTestimonials[index], ...updates }
    onUpdate({ ...content, testimonials: newTestimonials })
  }

  const addTestimonial = () => {
    const newTestimonial: TestimonialItem = {
      id: generateId(),
      quote: "Enter testimonial here...",
      author: "Author Name",
      role: "Role",
      avatar: "/images/avatar-1.png",
      rating: 5,
    }
    onUpdate({ ...content, testimonials: [...testimonials, newTestimonial] })
  }

  const removeTestimonial = (index: number) => {
    onUpdate({ ...content, testimonials: testimonials.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Badge</Label>
        <Input value={content.badge || ""} onChange={(e) => onUpdate({ ...content, badge: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ""} onChange={(e) => onUpdate({ ...content, title: e.target.value })} />
      </div>
      <div className="space-y-4">
        <Label>Testimonials</Label>
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Testimonial {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeTestimonial(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={testimonial.quote}
              onChange={(e) => updateTestimonial(index, { quote: e.target.value })}
              placeholder="Quote"
              rows={3}
            />
            <div className="grid md:grid-cols-3 gap-3">
              <Input
                value={testimonial.author}
                onChange={(e) => updateTestimonial(index, { author: e.target.value })}
                placeholder="Author"
              />
              <Input
                value={testimonial.role}
                onChange={(e) => updateTestimonial(index, { role: e.target.value })}
                placeholder="Role"
              />
              <div className="flex gap-2">
                <Input
                  value={testimonial.avatar}
                  onChange={(e) => updateTestimonial(index, { avatar: e.target.value })}
                  placeholder="Avatar URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => openMediaPicker((url) => updateTestimonial(index, { avatar: url }))}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Rating (1-5)</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={testimonial.rating}
                onChange={(e) => updateTestimonial(index, { rating: Number.parseInt(e.target.value) || 5 })}
              />
            </div>
          </div>
        ))}
        <Button variant="outline" onClick={addTestimonial}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>
    </div>
  )
}

function SustainabilityEditor({
  content,
  onUpdate,
  openMediaPicker,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
  openMediaPicker: (callback: (url: string) => void) => void
}) {
  const features = content.features || []

  const updateFeature = (index: number, updates: Partial<FeatureItem>) => {
    const newFeatures = [...features]
    newFeatures[index] = { ...newFeatures[index], ...updates }
    onUpdate({ ...content, features: newFeatures })
  }

  const addFeature = () => {
    const newFeature: FeatureItem = {
      id: generateId(),
      icon: "/images/sustainability-1.png",
      title: "New Feature",
      description: "Description here",
    }
    onUpdate({ ...content, features: [...features, newFeature] })
  }

  const removeFeature = (index: number) => {
    onUpdate({ ...content, features: features.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Badge</Label>
        <Input value={content.badge || ""} onChange={(e) => onUpdate({ ...content, badge: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={content.title || ""} onChange={(e) => onUpdate({ ...content, title: e.target.value })} />
      </div>
      <div className="space-y-4">
        <Label>Features</Label>
        {features.map((feature, index) => (
          <div key={feature.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Feature {index + 1}</span>
              <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                value={feature.icon}
                onChange={(e) => updateFeature(index, { icon: e.target.value })}
                placeholder="Icon URL"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => openMediaPicker((url) => updateFeature(index, { icon: url }))}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
            <Input
              value={feature.title}
              onChange={(e) => updateFeature(index, { title: e.target.value })}
              placeholder="Title"
            />
            <Textarea
              value={feature.description}
              onChange={(e) => updateFeature(index, { description: e.target.value })}
              placeholder="Description"
              rows={2}
            />
          </div>
        ))}
        <Button variant="outline" onClick={addFeature}>
          <Plus className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>
    </div>
  )
}

function CustomEditor({
  content,
  onUpdate,
}: {
  content: PageSection["content"]
  onUpdate: (content: PageSection["content"]) => void
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Custom HTML</Label>
        <Textarea
          value={content.html || ""}
          onChange={(e) => onUpdate({ ...content, html: e.target.value })}
          rows={10}
          className="font-mono text-sm"
          placeholder="<div>Your custom HTML here</div>"
        />
      </div>
    </div>
  )
}
