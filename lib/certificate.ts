import { readFileSync } from "fs";
import { join } from "path";

export interface CertificateProject {
  id: number;
  projectName: string;
  supervisor: string;
  members: string;
  createdAt: string;
}

const logoSrc = loadImage("logo.jpeg");
const incubatorSrc = loadImage("incubator.jpeg");

function loadImage(filename: string) {
  try {
    const filePath = join(process.cwd(), "public", filename);
    const imageData = readFileSync(filePath);
    return `data:image/jpeg;base64,${imageData.toString("base64")}`;
  } catch {
    return "";
  }
}

function renderCertificate(project: CertificateProject) {
  const members = JSON.parse(project.members) as string[];
  const formattedDate = "";
  const registrationNumber = "...../2026";

  return `
    <div class="certificate">
      <div class="header">
        <img class="logo-left" src="${incubatorSrc}" />
        <img class="logo-right" src="${logoSrc}" />

        <p>الجمهورية الجزائرية الديمقراطية الشعبية</p>
        <p>وزارة التعليم العالي و البحث العلمي</p>
        <p>جامعة أمين العقال الحاج موسى أق أخموك بتامنغست</p>
        <p>حاضنة الأعمال</p>
      </div>

      <div class="meta">
        <div>التاريخ: <span style="min-width:150px; display:inline-block;"></span></div>
        <div>رقم القيد: <span>${registrationNumber}</span></div>
      </div>

      <div class="title">شهادة توطين مشروع</div>

      <div class="content">
        تشهد إدارة حاضنة الأعمال بجامعة امين العقال الحاج موسى اق أخموك بتمنغست  بأن المشروع المعنون بـ
        <span class="project">"${project.projectName}"</span>
      </div>

      <div class="team">
        <p>والمؤسس من قبل الفريق التالي:</p>
        <ul>
          ${members.map((m) => `<li>- ${m}</li>`).join("")}
        </ul>
      </div>

      <div class="supervisor">تحت إشراف: ${project.supervisor}</div>

      <div class="footer">
        قد تم توطينه على مستوى حاضنتنا خلال الموسم الجامعي 2025/2026 وهو مشروع قيد التطوير.
      </div>

      <div class="signature">مديرة حاضنة الأعمال</div>
    </div>
  `;
}

function baseHtml(content: string) {
  return `
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Amiri&family=Cairo:wght@400;700&display=swap');

        body {
          font-family: 'Amiri', serif;
          margin: 0;
          padding: 40px;
          background: white;
          direction: rtl;
        }

        img {
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
          background: transparent !important;
          display: block;
        }

        .container {
          width: 100%;
        }

        .header {
          text-align: center;
          position: relative;
        }

        .logo-left {
          position: absolute;
          left: 0;
          top: 0;
          width: 80px;
        }

        .logo-right {
          position: absolute;
          right: 0;
          top: 0;
          width: 80px;
        }

        .header p {
          margin: 3px 0;
          font-size: 14px;
        }

        .meta {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          direction: rtl;
        }

        .meta span {
          padding: 0 10px;
          display: inline-block;
          min-width: 120px;
        }

        .title {
          text-align: center;
          margin-top: 40px;
          font-size: 26px;
          font-weight: bold;
        }

        .content {
          margin-top: 30px;
          font-size: 18px;
          line-height: 2;
          text-align: center;
        }

        .project {
          font-weight: bold;
        }

        .team {
          margin-top: 30px;
          text-align: right;
        }

        .team ul {
          list-style: none;
          padding: 0;
        }

        .team li {
          margin: 8px 0;
        }

        .supervisor {
          margin-top: 20px;
          text-align: right;
        }

        .footer {
          margin-top: 40px;
          font-size: 16px;
        }

        .signature {
          margin-top: 60px;
          text-align: left;
        }

        .certificate {
          page-break-after: always;
          break-after: page;
          width: 100%;
        }

        .page-break {
          page-break-after: always;
          break-after: page;
        }
      </style>
    </head>
    <body>
      <div class="container">
        ${content}
      </div>
    </body>
    </html>
  `;
}

export function buildCertificateHtml(project: CertificateProject) {
  return baseHtml(renderCertificate(project));
}

export function buildBulkCertificatesHtml(projects: CertificateProject[]) {
  const content = projects.map(renderCertificate).join("<div class=\"page-break\"></div>");
  return baseHtml(content);
}
