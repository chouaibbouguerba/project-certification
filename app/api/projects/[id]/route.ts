import { getDatabase } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const projectId = Number(params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: "رقم المشروع غير صالح." }, { status: 400 });
  }

  try {
    const db = await getDatabase();
    const result = await db.run(`DELETE FROM projects WHERE id = ?`, projectId);
    if (result.changes === 0) {
      return NextResponse.json({ error: "المشروع غير موجود." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "تعذر حذف المشروع." }, { status: 500 });
  }
}
