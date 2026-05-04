import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), { ssr: false });

export default function AdminPage() {
  const cookieStore = cookies();
  if (cookieStore.get("admin-auth")?.value !== "true") {
    redirect("/admin/login");
  }

  return (
    <main className="container py-16">
      <div className="card p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-slate-900">لوحة إدارة المشاريع</h1>
          <p className="mt-2 text-slate-600">إدارة الطلبات، تحميل شهادات PDF، وتصدير بيانات المشاريع.</p>
        </div>
        <AdminDashboard />
      </div>
    </main>
  );
}
