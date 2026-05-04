import { getDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await getDatabase();
    const rows = await db.all(`SELECT * FROM projects ORDER BY createdAt DESC`);

    const header = ["رقم المشروع", "اسم المشروع", "أعضاء الفريق", "المشرف", "البريد الإلكتروني", "التاريخ"];
    const csvRows = [header.join(",")];

    for (const row of rows) {
      const members = JSON.parse(row.members).join(";");
      const line = [row.id, row.projectName, members, row.supervisor, row.email, row.createdAt]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(",");
      csvRows.push(line);
    }

    const csv = csvRows.join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=projects.csv"
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to generate CSV." }, { status: 500 });
  }
}
