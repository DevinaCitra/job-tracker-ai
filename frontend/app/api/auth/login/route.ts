import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const body = await request.json();

  const formData = new URLSearchParams();

  formData.append("username", body.email);
  formData.append("password", body.password);

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { detail: data.detail || "Login gagal" },
      { status: response.status }
    );
  }

  const res = NextResponse.json({
    message: "Login berhasil",
  });

  res.cookies.set("access_token", data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}