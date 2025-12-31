import { NextResponse } from "next/server"
import { connectToDatabase, isMongoDBConfigured } from "@/lib/db"
import mongoose from "mongoose"

export async function GET() {
  const results = {
    configured: isMongoDBConfigured(),
    connected: false,
    databaseName: null,
    collections: [],
    error: null,
  }

  if (!isMongoDBConfigured()) {
    results.error = "MongoDB URI not configured in environment variables"
    return NextResponse.json(results, { status: 500 })
  }

  try {
    await connectToDatabase()
    results.connected = true

    const db = mongoose.connection.db
    if (db) {
      results.databaseName = db.databaseName

      const collectionsList = await db.listCollections().toArray()

      for (const collection of collectionsList) {
        const count = await db.collection(collection.name).countDocuments()
        results.collections.push({
          name: collection.name,
          count,
        })
      }
    }

    return NextResponse.json(results)
  } catch (error: any) {
    results.error = error.message
    return NextResponse.json(results, { status: 500 })
  }
}
