import { NextRequest, NextResponse } from "next/server";
import { getAdminSecret, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    const validSecret = getAdminSecret();

    if (!secret || typeof secret !== "string" || secret.trim() !== validSecret.trim()) {
      return NextResponse.json(
        { error: "Invalid administrative credentials.", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      { success: true, message: "Administrative session established." },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: validSecret,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error during authentication.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
