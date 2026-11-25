import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAuthenticatedAdmin } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticatedAdmin(request)) {
    return NextResponse.json(
      { error: "Unauthorized access.", code: "UNAUTHORIZED" },
      { status: 401 }
    );
  }

  try {
    const { id } = params;
    const campaign = await db.campaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found.", code: "NOT_FOUND" },
        { status: 404 }
      );
    }

    const updated = await db.campaign.update({
      where: { id },
      data: { isActive: !campaign.isActive },
    });

    return NextResponse.json({
      success: true,
      campaignId: updated.id,
      isActive: updated.isActive,
    });
  } catch (error) {
    console.error("Failed to toggle campaign status:", error);
    return NextResponse.json(
      { error: "Internal server error.", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
