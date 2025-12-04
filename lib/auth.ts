import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  tenantId?: string;
}

// Generate JWT token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
}

// Verify JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Compare password
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Get token from request headers
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}
