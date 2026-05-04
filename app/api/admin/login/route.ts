import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "655268114";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const password = String(body.password || "");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin-auth", "true", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60
  });

  return response;
}
