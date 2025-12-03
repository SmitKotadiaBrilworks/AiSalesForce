import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // In a real app, we would:
  // 1. Validate the input
  // 2. Insert into Supabase 'leads' table
  // 3. Trigger AI processing

  console.log("Received lead submission:", body);

  return NextResponse.json({
    success: true,
    message: "Lead captured successfully",
    leadId: "mock-lead-id-" + Date.now(),
  });
}
