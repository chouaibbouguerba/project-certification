import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "نظام استضافة المشاريع والشهادات",
  description: "نظام تسجيل مشاريع الطلبة وإدارة الشهادات بصيغة PDF للادمن."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
