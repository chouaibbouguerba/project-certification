import { getDatabase } from "@/lib/db";
import { buildCertificateHtml } from "@/lib/certificate";
import { launchBrowser } from "@/lib/puppeteer";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const projectId = Number(params.id);

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return new Response(JSON.stringify({ error: "Invalid project ID." }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const db = await getDatabase();
  const project = await db.get(`SELECT * FROM projects WHERE id = ?`, projectId);

  if (!project) {
    return new Response(JSON.stringify({ error: "Project not found." }), { status: 404, headers: { "Content-Type": "application/json" } });
  }

  try {
    const browser = await launchBrowser();
    const page = await browser.newPage();
    const html = buildCertificateHtml(project);

    await page.setContent(html, { waitUntil: ["networkidle0"] });
    const pdfBuffer = Buffer.from(await page.pdf({ format: "A4", printBackground: true, margin: { top: 32, right: 32, bottom: 32, left: 32 } }));
    await browser.close();

    const pdfArrayBuffer = pdfBuffer.buffer.slice(pdfBuffer.byteOffset, pdfBuffer.byteOffset + pdfBuffer.byteLength) as ArrayBuffer;

    return new Response(pdfArrayBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${project.id}.pdf"`
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
