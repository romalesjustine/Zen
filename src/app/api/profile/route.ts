import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { studyHrsGoal } = body;

    // Validate studyHrsGoal
    if (
      typeof studyHrsGoal !== "number" ||
      Number.isNaN(studyHrsGoal) ||
      studyHrsGoal < 1 ||
      studyHrsGoal > 12
    ) {
      return NextResponse.json(
        { error: "Invalid study hours goal. Must be between 1 and 12." },
        { status: 400 }
      );
    }

    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find and update profile
    const profile = await prisma.profile.findUnique({
      where: {
        email: user.email,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update the study hours goal
    const updatedProfile = await prisma.profile.update({
      where: {
        id: profile.id,
      },
      data: {
        studyHrsGoal,
      },
    });

    return NextResponse.json({
      message: "Study goal updated successfully",
      studyHrsGoal: updatedProfile.studyHrsGoal,
    });
  } catch (error) {
    console.error("Error updating study goal:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
