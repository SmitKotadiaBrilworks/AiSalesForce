import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "./auth";

export async function authenticateRequest(
  request: NextRequest
): Promise<{ userId: string; email: string; tenantId?: string } | null> {
  const token = getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function createUnauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
