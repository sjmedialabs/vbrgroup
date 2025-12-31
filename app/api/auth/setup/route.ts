import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, setupKey } = await request.json()

    if (setupKey !== process.env.SETUP_KEY) {
      return NextResponse.json({ error: "Invalid setup key" }, { status: 403 })
    }

    return NextResponse.json({
      message: "Setup completed successfully (mock mode)",
      user: {
        id: "demo-user-id",
        email,
        name,
        role: "super_admin",
      },
      tenant: {
        slug: "kisan-plant-technologies",
        name: "Kisan Plant Technologies",
      },
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
