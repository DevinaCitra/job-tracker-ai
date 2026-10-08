import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  const body = await request.json();

  // ① Buat user — backend kamu menerima JSON di /register
  const registerResponse = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      password: body.password,
    }),
    cache: "no-store",
  });

  const registerData = await registerResponse.json();

  if (!registerResponse.ok) {
    // Teruskan detail dari FastAPI, misal "Email sudah terdaftar"
    return NextResponse.json(
      { detail: registerData.detail || "Register gagal" },
      { status: registerResponse.status }
    );
  }

  // ② Auto-login 
  const formData = new URLSearchParams();
  formData.append("username", body.email);
  formData.append("password", body.password);

  const loginResponse = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
    cache: "no-store",
  });

  const loginData = await loginResponse.json();

  // Akun sudah dibuat tapi token gagal → arahkan login manual
  if (!loginResponse.ok) {
    return NextResponse.json({
      message: registerData.message,
      requireLogin: true,
    });
  }

  // ③ Simpan token sebagai cookie 
  const res = NextResponse.json({
    message: "Registrasi berhasil",
  });

  res.cookies.set("access_token", loginData.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res;
}