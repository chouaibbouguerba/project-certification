import { getDatabase } from "@/lib/db";
import { buildBulkCertificatesHtml, CertificateProject } from "@/lib/certificate";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  const body = await request.json();
  const { projectIds }: { projectIds: number[] } = body;

  if (!Array.isArray(projectIds) || projectIds.length === 0) {
    return new Response(JSON.stringify({ error: "يجب تحديد معرفات المشاريع." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const db = await getDatabase();
  const placeholders = projectIds.map(() => "?").join(",");
  const projects = await db.all<CertificateProject[]>(
    `SELECT * FROM projects WHERE id IN (${placeholders}) ORDER BY id ASC`,
    projectIds
  );

  if (projects.length === 0) {
    return new Response(JSON.stringify({ error: "لم يتم العثور على مشاريع." }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const browser = await puppeteer.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  const html = buildBulkCertificatesHtml(projects);

  await page.setContent(html, { waitUntil: ["networkidle0"] });
  const pdfBuffer = Buffer.from(await page.pdf({ format: "A4", printBackground: true, margin: { top: 32, right: 32, bottom: 32, left: 32 } }));
  await browser.close();

  const pdfArrayBuffer = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength) as ArrayBuffer;

  return new Response(pdfArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificates-selected.pdf"`
    }
  });
}