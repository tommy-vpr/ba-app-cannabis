import { NextRequest, NextResponse } from "next/server";
import { logMeetingToHubSpot } from "@/app/actions/logMeetingToHubSpot"; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const { contactId, notes } = await req.json();

    if (!contactId || !notes) {
      return NextResponse.json(
        { error: "Missing contactId or notes" },
        { status: 400 }
      );
    }

    const meetingLog = await logMeetingToHubSpot(contactId, notes);

    console.log(meetingLog);

    return NextResponse.json({ success: true, meetingLog }, { status: 200 });
  } catch (err: any) {
    console.error("Error logging meeting:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
