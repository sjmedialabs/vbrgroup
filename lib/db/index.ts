import { connectToDatabase, isMongoDBConfigured } from "../mongodb"

export { connectToDatabase, isMongoDBConfigured }

export * from "./models"

// Helper to safely get model or return null
export async function getModel<T>(modelName: string): Promise<T | null> {
  try {
    const connection = await connectToDatabase()
    if (!connection) return null
    return connection.models[modelName] as T
  } catch {
    return null
  }
}

// Helper to run a query with fallback to mock data
export async function withDatabase<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  if (!isMongoDBConfigured()) {
    return fallback
  }

  try {
    await connectToDatabase()
    return await operation()
  } catch (error) {
    console.error("Database operation failed:", error)
    return fallback
  }
}
