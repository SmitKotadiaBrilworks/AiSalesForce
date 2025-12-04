import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/database.schema";

/**
 * API endpoint to initialize database schema
 * Call this once to set up indexes
 * GET /api/setup-db
 */
export async function GET() {
  try {
    await initializeDatabase();
    return NextResponse.json({
      success: true,
      message: "Database schema initialized successfully",
    });
  } catch (error) {
    console.error("Database setup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
