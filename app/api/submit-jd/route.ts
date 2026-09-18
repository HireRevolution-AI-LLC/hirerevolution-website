import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { companyName, companyWebsite, companyEmail, jobTitle, jobDescription } =
      body;

    // Validate required fields
    if (!companyName || !companyWebsite || !companyEmail || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // TODO: Save to database or send email to support@hirerevolution.ai
    // For now, just log and return success
    console.log("JD Submission:", {
      companyName,
      companyWebsite,
      companyEmail,
      jobTitle,
      jobDescription,
      timestamp: new Date().toISOString(),
    });

    // In production, you'd:
    // 1. Save to database
    // 2. Send email to support with details
    // 3. Trigger API workflow to process the JD and search for candidates
    // 4. Create account for hiring manager

    return NextResponse.json(
      { message: "JD submitted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
