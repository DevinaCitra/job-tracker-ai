const API_URL = "http://127.0.0.1:8000";

export type Application = {
  id: number;
  company: string;
  position: string;
  source: string | null;
  date_applied: string | null;
  status: string;
};

export type ApplicationStats = {
  total: number;
  applied: number;
  interview: number;
  offer: number;
};

type ApplicationsResponse = {
  data: Application[];
};

export async function getApplications(): Promise<ApplicationsResponse> {
  const response = await fetch(`${API_URL}/applications`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil data lamaran");
  }

  return response.json();
}

export async function getApplicationStats(): Promise<ApplicationStats> {
  const response = await fetch(`${API_URL}/applications/stats`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil statistik lamaran");
  }

  return response.json();
}