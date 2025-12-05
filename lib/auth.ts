import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET =
  process.env.NEXT_PUBLIC_JWT_SECRET || "your-secret-key-change-in-production";

export interface JWTPayload {
  userId: string;
  email: string;
  tenantId?: string;
}

// Generate JWT token
export async function generateToken(payload: JWTPayload): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  // jose expects a generic record payload; cast to satisfy type checker
  const genericPayload = payload as unknown as Record<string, unknown>;
  return await new SignJWT(genericPayload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime("7d")
    .sign(secret);
}

// Verify JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  console.log("verifyToken", token);
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    // Cast jose payload (unknown) to our JWTPayload shape
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

// Get token from request headers (for API routes)
export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
}

// Get token from NextRequest (for middleware - supports cookies and headers)
export function getTokenFromNextRequest(request: {
  cookies: { get: (name: string) => { value: string } | undefined };
  headers: { get: (name: string) => string | null };
}): string | null {
  // First try cookie (for page navigation)
  const cookieToken = request.cookies.get("auth_token")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Fallback to Authorization header (for API requests)
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  return null;
}
