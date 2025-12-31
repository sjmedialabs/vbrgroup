import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongooseConnection: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.warn("MONGODB_URI not defined - database features will be limited")
}

let cached = global.mongooseConnection

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    console.warn("MongoDB not configured - using mock data")
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 20, // Matches URI parameter
      serverSelectionTimeoutMS: 5000, // Matches URI parameter
      socketTimeoutMS: 45000,
      // retryWrites and w=majority are set in URI
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connected successfully")
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("MongoDB connection error:", e)
    throw e
  }

  return cached.conn
}

export function isMongoDBConfigured(): boolean {
  return !!MONGODB_URI
}

export async function getDatabase(dbName?: string) {
  const connection = await connectToDatabase()
  if (!connection) return null
  return dbName ? connection.connection.useDb(dbName) : connection.connection
}

export default mongoose
