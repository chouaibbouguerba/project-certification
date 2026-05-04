"use client";

import { useState } from "react";

interface FormState {
  projectName: string;
  memberText: string;
  supervisor: string;
  email: string;
}

export default function ProjectForm() {
  const [form, setForm] = useState<FormState>({
    projectName: "",
    memberText: "",
    supervisor: "",
    email: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const members = form.memberText
      .split("\n")
      .map((member) => member.trim())
      .filter(Boolean);

    if (!form.projectName.trim() || !form.supervisor.trim() || !form.email.trim() || members.length === 0) {
      setError("يرجى إكمال جميع الحقول وإضافة عضو واحد على الأقل للفريق.");
      return;
    }

    if (!validateEmail(form.email.trim())) {
      setError("يرجى إدخال بريد إلكتروني صالح.");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: form.projectName.trim(),
        members,
        supervisor: form.supervisor.trim(),
        email: form.email.trim()
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "تعذر إرسال المشروع. الرجاء المحاولة مرة أخرى.");
      return;
    }

    setSuccess("تم إرسال المشروع بنجاح. يجب الالتحاق بمقر الحاضنة للحصول على شهادة التوطين.");
    setForm({ projectName: "", memberText: "", supervisor: "", email: "" });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-1">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">اسم المشروع</span>
          <input
            type="text"
            value={form.projectName}
            onChange={(event) => setForm({ ...form, projectName: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
            required
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">أعضاء الفريق</span>
        <textarea
          value={form.memberText}
          onChange={(event) => setForm({ ...form, memberText: event.target.value })}
          rows={5}
          placeholder="اكتب اسم كل عضو في سطر منفصل"
          className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
          required
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-1">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">اسم المشرف</span>
          <input
            type="text"
            value={form.supervisor}
            onChange={(event) => setForm({ ...form, supervisor: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
            required
          />
        </label>
      </div>

      <div className="grid gap-6 sm:grid-cols-1">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">البريد الإلكتروني</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
            required
          />
        </label>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-6 py-3 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "جاري الإرسال..." : "إرسال المشروع"}
        </button>
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </form>
  );
}
