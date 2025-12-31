import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPassword = password.trim()

    if (trimmedEmail === "admin@vbrgroup.com" && trimmedPassword === "admin123") {
      const token = `session_${Date.now()}`

      const cookieStore = await cookies()
      cookieStore.set("session_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })

      return NextResponse.json({
        user: {
          id: "demo-user-id",
          email: "admin@vbrgroup.com",
          name: "Admin User",
          role: "super_admin",
          tenants: ["kisan-plant-technologies"],
        },
      })
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
