import { cookies } from "next/headers"
import type { User, Session } from "./db/schemas"

const SESSION_EXPIRY_DAYS = 7

export async function getSession(): Promise<{ user: User; session: Session } | null> {
  // In preview mode, return mock session for demo
  // In production with MongoDB, this would check the database
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value

  if (!token) return null

  // Mock user for demo when token exists
  return {
    user: {
      _id: "demo-user-id" as any,
      email: "admin@vbrgroup.com",
      password: "",
      name: "Admin User",
      role: "super_admin",
      tenants: ["kisan-plant-tech"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    session: {
      _id: "demo-session-id" as any,
      userId: "demo-user-id" as any,
      token: token,
      expiresAt: new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  }
}

export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt
  return `hashed_${password}`
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  // In production, use bcrypt
  return hashedPassword === `hashed_${password}` || password === "admin123"
}

export async function createSession(userId: any): Promise<string> {
  return `session_${Date.now()}`
}

export async function deleteSession(token: string): Promise<void> {
  // No-op in preview
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: User["role"] = "editor",
  tenants: string[] = [],
): Promise<User> {
  return {
    _id: `user_${Date.now()}` as any,
    email: email.toLowerCase(),
    password: await hashPassword(password),
    name,
    role,
    tenants,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  // Return mock admin user for demo
  if (email === "admin@vbrgroup.com") {
    return {
      _id: "demo-user-id" as any,
      email: "admin@vbrgroup.com",
      password: await hashPassword("admin123"),
      name: "Admin User",
      role: "super_admin",
      tenants: ["kisan-plant-tech"],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  return null
}
