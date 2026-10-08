import { cookies } from "next/headers";
import {
  getApplications,
  getApplicationStats,
} from "./api";

export async function getAuthenticatedApplications() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  console.log("TOKEN EXISTS:", !!token);

  if (!token) {
    throw new Error("User belum login");
  }

  return getApplications(token);
}

export async function getAuthenticatedApplicationStats() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("User belum login");
  }

  return getApplicationStats(token);
}