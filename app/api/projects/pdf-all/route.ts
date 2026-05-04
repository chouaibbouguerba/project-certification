import { getDatabase } from "@/lib/db";
import { buildBulkCertificatesHtml, CertificateProject } from "@/lib/certificate";
import { launchBrowser } from "@/lib/puppeteer";

export async function GET() {
  const db = await getDatabase();
  const projects = await db.all<CertificateProject[]>(`SELECT * FROM projects ORDER BY id ASC`);

  if (!projects.length) {
    return new Response(JSON.stringify({ error: "No projects found." }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  const browser = await launchBrowser();
  const page = await browser.newPage();
  const html = buildBulkCertificatesHtml(projects);

  await page.setContent(html, { waitUntil: ["networkidle0"] });
  const pdfBuffer = Buffer.from(await page.pdf({ format: "A4", printBackground: true, margin: { top: 32, right: 32, bottom: 32, left: 32 } }));
  await browser.close();

  const pdfArrayBuffer = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength) as ArrayBuffer;

  return new Response(pdfArrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificates-all.pdf"`
    }
  });
}
