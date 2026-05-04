"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const data = await response.json();
    setLoading(false);

    if (response.ok) {
      router.push("/admin");
    } else {
      setStatus(data.error || "كلمة المرور غير صحيحة، حاول مرة أخرى.");
    }
  };

  return (
    <main className="container py-16" dir="rtl">
      <div className="card p-8 max-w-xl mx-auto text-right">
        
        <h1 className="text-3xl font-semibold text-slate-900">
          تسجيل دخول الإدارة
        </h1>

        <p className="mt-2 text-slate-600">
          أدخل كلمة المرور للوصول إلى لوحة التحكم.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              كلمة المرور
            </span>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 outline-none transition focus:border-sky-500 focus:bg-white"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-2xl bg-sky-600 px-5 py-3 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>

          {status ? (
            <p className="text-sm text-red-600">{status}</p>
          ) : null}

        </form>
      </div>
    </main>
  );
}