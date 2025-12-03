import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // This webhook handles Supabase Auth events
    // Events: user.created, user.updated, user.deleted, etc.

    console.log("Auth webhook received:", body);

    const eventType = body.type;
    const user = body.record;

    switch (eventType) {
      case "INSERT":
        // New user signed up
        console.log("New user registered:", user.email);
        // In a real app:
        // - Create tenant record
        // - Send welcome email
        // - Initialize default settings
        break;

      case "UPDATE":
        // User updated their profile
        console.log("User updated:", user.email);
        break;

      case "DELETE":
        // User deleted
        console.log("User deleted:", user.id);
        // Clean up associated data
        break;

      default:
        console.log("Unknown event type:", eventType);
    }

    return NextResponse.json({
      success: true,
      message: "Auth webhook processed",
    });
  } catch (error) {
    console.error("Auth webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process auth webhook" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "auth-webhook",
    timestamp: new Date().toISOString(),
  });
}
