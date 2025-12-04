import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { hashPassword, generateToken } from "@/lib/auth";
import { z } from "zod";

const signUpSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  companyName: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name is too long"),
  email: z.string().email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
      "Password must contain upper, lower case letters and a number"
    ),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { fullName, email, password, companyName } = signUpSchema.parse(json);

    const db = await getDatabase();

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create tenant
    const tenantResult = await db.collection("tenants").insertOne({
      name: companyName,
      logo_url: null,
      created_at: new Date(),
      ai_config: {},
    });

    const tenantId = tenantResult.insertedId;

    // Create user
    const userResult = await db.collection("users").insertOne({
      tenant_id: tenantId,
      role: "owner",
      full_name: fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      created_at: new Date(),
    });

    const userId = userResult.insertedId.toString();

    // Generate JWT token
    const token = generateToken({
      userId,
      email: email.toLowerCase(),
      tenantId: tenantId.toString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        token,
        user: {
          id: userId,
          email: email.toLowerCase(),
          fullName,
          companyName,
          tenantId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
