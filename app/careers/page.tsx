"use client"

import type React from "react"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Loader2, CheckCircle } from "lucide-react"
import type { JobOpening } from "@/lib/db/schemas"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CareersPage() {
  const { data } = useSWR<{ jobs: JobOpening[] }>("/api/jobs?tenant=kisan-plant-technologies&active=true", fetcher)
  const jobs = data?.jobs || []

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative h-[350px] md:h-[400px] overflow-hidden">
        <Image src="/images/Careers.png" alt="Careers" fill className="object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white px-5 z-10">
          <h1 className="text-4xl md:text-5xl font-light">Careers That Cultivate Impact</h1>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 md:py-24">
        <div className="max-w-[900px] mx-auto px-5">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-[#2d8a39] text-white text-base font-bold px-4 py-1 rounded-full mb-8">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              Careers
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">MAKE YOUR NEXT CAREER MOVE</h2>
            <p className="text-muted-foreground max-w-[650px] mx-auto">
              Join Kisan Plant Technologies Pvt. Ltd. and be part of a purpose-driven team shaping the future of
              intelligent agriculture, sustainability, and green innovation.
            </p>
          </div>

          {/* Job Listings */}
          {jobs.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No open positions at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {jobs.map((job, index) => (
                <JobRow key={job._id} job={job} isLast={index === jobs.length - 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}

function JobRow({ job, isLast }: { job: JobOpening; isLast: boolean }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 ${!isLast ? "border-b border-border" : ""}`}
    >
      {/* Left side - Type badge and Title */}
      <div className="flex items-center gap-6">
        <span className="inline-flex items-center justify-center bg-muted text-foreground text-sm font-medium px-5 py-2 rounded-full min-w-[100px]">
          {job.type}
        </span>
        <h3 className="font-semibold text-foreground">{job.title}</h3>
      </div>

      {/* Right side - Location and Apply button */}
      <div className="flex items-center gap-6 md:gap-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Image src="/images/location-pin-svgrepo.png" alt="Location" width={18} height={18} />
          <span className="text-sm">{job.location}</span>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[var(--primary-green)] text-[var(--primary-green)] hover:bg-[var(--primary-green)] hover:text-white transition-colors bg-transparent"
            >
              Apply
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Apply for {job.title}</DialogTitle>
            </DialogHeader>
            <ApplicationForm job={job} onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

function ApplicationForm({ job, onSuccess }: { job: JobOpening; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      jobId: job._id,
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      resumeUrl: formData.get("resumeUrl"),
      coverLetter: formData.get("coverLetter"),
      linkedIn: formData.get("linkedIn"),
      portfolio: formData.get("portfolio"),
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Failed to submit application")
      }

      setSuccess(true)
      setTimeout(onSuccess, 2000)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-[var(--primary-green)] mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
        <p className="text-[var(--text-gray)]">
          Thank you for your interest. We will review your application and get back to you.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="app-name">Full Name *</Label>
          <Input id="app-name" name="name" required placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="app-email">Email *</Label>
          <Input id="app-email" name="email" type="email" required placeholder="john@example.com" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-phone">Phone *</Label>
        <Input id="app-phone" name="phone" required placeholder="+91 98765 43210" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-resume">Resume URL *</Label>
        <Input id="app-resume" name="resumeUrl" required placeholder="https://drive.google.com/..." />
        <p className="text-xs text-[var(--text-gray)]">
          Upload your resume to Google Drive or Dropbox and paste the link
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-linkedin">LinkedIn Profile</Label>
        <Input id="app-linkedin" name="linkedIn" placeholder="https://linkedin.com/in/..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-portfolio">Portfolio URL</Label>
        <Input id="app-portfolio" name="portfolio" placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="app-cover">Cover Letter</Label>
        <Textarea id="app-cover" name="coverLetter" placeholder="Tell us why you'd be a great fit..." rows={4} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--primary-green)] hover:bg-[var(--primary-green-dark)]"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  )
}
