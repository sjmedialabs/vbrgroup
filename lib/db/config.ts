/**
 * Database configuration utilities
 * Manages production vs development mode and mock data fallback
 */

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || process.env.DISABLE_MOCK_FALLBACK === "true"
}

export function shouldUseMockFallback(): boolean {
  // In production, NEVER use mock data fallback
  if (isProduction()) {
    return false
  }
  // In development, only use mock fallback if MongoDB is not configured
  return !process.env.MONGODB_URI
}

/**
 * Throws an error if in production and database is not available
 * Returns false in development to allow mock data fallback
 */
export function handleDatabaseUnavailable(error?: Error): never | boolean {
  if (isProduction()) {
    console.error("CRITICAL: Database unavailable in production mode", error)
    throw new Error("Database connection failed. Service unavailable.")
  }
  // In development, allow fallback to mock data
  console.warn("Database unavailable - falling back to mock data (development mode only)")
  return false
}
