import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getApplications,
  getApplicationStats,
} from "./api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export async function getAuthenticatedUser(): Promise<AuthUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const res = await fetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    cookieStore.delete("access_token");
    redirect("/login");
  }

  return res.json();
}

export async function getAuthenticatedApplications() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  try {
    return await getApplications(token);
  } catch {
    redirect("/login");
  }
}

export async function getAuthenticatedApplicationStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) redirect("/login");

  try {
    return await getApplicationStats(token);
  } catch {
    redirect("/login");
  }
}