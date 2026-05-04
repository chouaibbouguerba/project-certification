import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/db";
import { ProjectInput } from "@/lib/types";

export async function POST(request: NextRequest) {
  const body = (await request.json()) as ProjectInput;

  if (!body.projectName?.trim() || !body.supervisor?.trim() || !body.email?.trim() || !Array.isArray(body.members) || body.members.length === 0) {
    return NextResponse.json({ error: "إرسال غير صالح. يرجى ملء جميع الحقول المطلوبة." }, { status: 400 });
  }

  const members = body.members.map((member) => member.trim()).filter(Boolean);
  if (members.length === 0) {
    return NextResponse.json({ error: "يرجى إضافة عضو واحد على الأقل للفريق." }, { status: 400 });
  }

  const email = String(body.email).trim();
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!validateEmail(email)) {
    return NextResponse.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
  }

  const createdAt = new Date().toISOString();

  try {
    const db = await getDatabase();
    const result = await db.run(
      `INSERT INTO projects (projectName, teamName, members, supervisor, email, createdAt)
       VALUES (?, ?, ?, ?, ?, ?)`,
      body.projectName.trim(),
      (body.teamName ?? "").trim(),
      JSON.stringify(members),
      body.supervisor.trim(),
      email,
      createdAt
    );

    return NextResponse.json({ success: true, id: result.lastID }, { status: 201 });
  } catch (error) {
    const message = (error as Error).message;
    if (message.includes("UNIQUE") || message.includes("unique")) {
      return NextResponse.json({ error: "يوجد مشروع مسجل بنفس البريد الإلكتروني بالفعل." }, { status: 409 });
    }

    return NextResponse.json({ error: "تعذر حفظ المشروع." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const rows = await db.all(`SELECT * FROM projects ORDER BY createdAt DESC`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json({ error: "تعذر تحميل المشاريع." }, { status: 500 });
  }
}
