import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ProfileSubmissionSchema } from "@/lib/schema";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * Public write-only endpoint to create or update the user's own RespondentProfile
 * keyed by their client-held profileToken. Never exposes other users' profiles.
 */
export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(`profile_${clientIp}`, 20, 60_000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: "Too many profile updates. Please wait a moment and try again.",
          code: "RATE_LIMITED",
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = ProfileSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please fill out all required profile fields accurately.",
          code: "VALIDATION_FAILED",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { profileToken, fullName, email, birthDate, gender, notes } = parsed.data;

    const saved = await db.respondentProfile.upsert({
      where: { profileToken },
      update: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        birthDate: birthDate.trim(),
        gender: gender.trim(),
        notes: notes?.trim() || null,
      },
      create: {
        profileToken,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        birthDate: birthDate.trim(),
        gender: gender.trim(),
        notes: notes?.trim() || null,
      },
      select: {
        id: true,
        fullName: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        profileId: saved.id,
        fullName: saved.fullName,
        updatedAt: saved.updatedAt.toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile upsert error:", error);
    return NextResponse.json(
      {
        error: "Could not save your profile right now. Please try again.",
        code: "SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
