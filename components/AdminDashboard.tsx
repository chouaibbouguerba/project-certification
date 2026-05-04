"use client";

import { useEffect, useState } from "react";

interface ProjectRecord {
  id: number;
  projectName: string;
  supervisor: string;
  email: string;
  members: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());
  const [generatingPDFs, setGeneratingPDFs] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProjects(new Set(projects.map(p => p.id)));
    } else {
      setSelectedProjects(new Set());
    }
  };

  const handleSelectProject = (projectId: number, checked: boolean) => {
    const newSelected = new Set(selectedProjects);
    if (checked) {
      newSelected.add(projectId);
    } else {
      newSelected.delete(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const generateSelectedPDFs = async () => {
    if (selectedProjects.size === 0) {
      alert("يرجى تحديد طلب واحد على الأقل.");
      return;
    }

    setGeneratingPDFs(true);
    try {
      const selectedIds = Array.from(selectedProjects);
      const response = await fetch("/api/projects/pdf/selected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectIds: selectedIds })
      });

      if (!response.ok) {
        throw new Error("فشل في توليد ملفات PDF.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificates-selected-${selectedIds.join("-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setGeneratingPDFs(false);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("تعذر تحميل الطلبات.");
        }

        const data: ProjectRecord[] = await response.json();
        setProjects(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (loading) {
    return <p className="text-slate-600">جاري تحميل الطلبات...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">إجمالي الطلبات: {projects.length}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          
          <button
            type="button"
            disabled={generatingPDFs || selectedProjects.size === 0}
            onClick={generateSelectedPDFs}
            className="inline-flex items-center rounded-2xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {generatingPDFs ? "جاري التوليد..." : `توليد PDF المحدد (${selectedProjects.size})`}
          </button>
          <a
            href="/api/projects/pdf-all"
            className="rounded-2xl bg-green-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-green-700"
          >
            توليد جميع الملفات PDF
          </a>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                <input
                  type="checkbox"
                  checked={selectedProjects.size === projects.length && projects.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
              </th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">الرقم</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">اسم المشروع</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">أعضاء الفريق</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">المشرف</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">البريد</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">التاريخ</th>
              <th className="px-4 py-4 text-sm font-semibold text-slate-900">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedProjects.has(project.id)}
                    onChange={(e) => handleSelectProject(project.id, e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{project.id}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{project.projectName}</td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  <ul className="list-disc pl-5">
                    {JSON.parse(project.members).map((member: string, index: number) => (
                      <li key={index}>{member}</li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{project.supervisor}</td>
                <td className="px-4 py-4 text-sm text-slate-700">{project.email}</td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {new Intl.DateTimeFormat("ar-DZ", {
                    dateStyle: "medium",
                    timeStyle: "short"
                  }).format(new Date(project.createdAt))}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700 space-y-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <a
                      href={`/api/projects/pdf/${project.id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-2xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                      توليد PDF
                    </a>
                    <button
                      type="button"
                      disabled={deletingId === project.id}
                      onClick={async () => {
                        if (!confirm("هل تريد حذف هذا الطلب نهائيًا؟")) {
                          return;
                        }
                        setDeletingId(project.id);
                        try {
                          const response = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
                          if (!response.ok) {
                            throw new Error("فشل الحذف.");
                          }
                          setProjects((current) => current.filter((item) => item.id !== project.id));
                        } catch (error) {
                          setError((error as Error).message);
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                      className="inline-flex items-center rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === project.id ? "جاري الحذف..." : "حذف"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
