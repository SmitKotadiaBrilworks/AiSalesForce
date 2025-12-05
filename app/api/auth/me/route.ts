import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const db = await getDatabase();

    // Find user
    const user = await db.collection("users").findOne({
      _id: new ObjectId(payload.userId),
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get tenant info
    const tenantId =
      user.tenant_id instanceof ObjectId
        ? user.tenant_id
        : user.tenant_id
        ? new ObjectId(user.tenant_id)
        : null;

    const tenant = tenantId
      ? await db.collection("tenants").findOne({
          _id: tenantId,
        })
      : null;

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.full_name,
        companyName: tenant?.name || "",
        tenantId: user.tenant_id?.toString(),
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
