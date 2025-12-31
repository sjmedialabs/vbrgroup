"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Tenant } from "@/lib/db/schemas"

interface WebsiteContextType {
  currentWebsite: Tenant | null
  setCurrentWebsite: (website: Tenant | null) => void
  isLoading: boolean
}

const WebsiteContext = createContext<WebsiteContextType | undefined>(undefined)

export function WebsiteProvider({ children }: { children: ReactNode }) {
  const [currentWebsite, setCurrentWebsiteState] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load selected website from localStorage on mount
    const savedSlug = localStorage.getItem("currentWebsiteSlug")
    if (savedSlug) {
      // Fetch the website details
      fetch(`/api/tenants`)
        .then((res) => res.json())
        .then((data) => {
          const website = data.tenants?.find((t: Tenant) => t.slug === savedSlug)
          if (website) {
            setCurrentWebsiteState(website)
          }
        })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const setCurrentWebsite = (website: Tenant | null) => {
    setCurrentWebsiteState(website)
    if (website) {
      localStorage.setItem("currentWebsiteSlug", website.slug)
    } else {
      localStorage.removeItem("currentWebsiteSlug")
    }
  }

  return (
    <WebsiteContext.Provider value={{ currentWebsite, setCurrentWebsite, isLoading }}>
      {children}
    </WebsiteContext.Provider>
  )
}

export function useWebsite() {
  const context = useContext(WebsiteContext)
  if (context === undefined) {
    throw new Error("useWebsite must be used within a WebsiteProvider")
  }
  return context
}
