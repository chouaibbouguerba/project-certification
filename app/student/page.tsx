import ProjectForm from "@/components/ProjectForm";

export default function StudentPage() {
  return (
    <main className="container py-16" dir="rtl">
      <div className="card p-8">
        <div className="mb-8 text-right">
          <h1 className="text-3xl font-semibold text-slate-900">تسجيل مشروع الطالب</h1>
          <p className="mt-2 text-slate-600">أكمل النموذج لتسجيل مشروعك واستصداره كشهادة.</p>
        </div>
        <ProjectForm />
      </div>
    </main>
  );
}
