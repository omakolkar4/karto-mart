import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

/** POST /api/contact — save a contact message to the database. */
export async function POST(req: NextRequest) {
  const { name, email, phone, subject, message } = await req.json();
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Name, email, subject and message are required" }, { status: 400 });
  }
  if (message.trim().length < 10) {
    return NextResponse.json({ error: "Message must be at least 10 characters" }, { status: 400 });
  }
  const msg = await db.contactMessage.create({
    data: { name, email, phone: phone || null, subject, message },
  });
  return NextResponse.json({ success: true, id: msg.id }, { status: 201 });
}
