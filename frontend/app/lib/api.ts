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

export async function sendChatMessage(message: string) {
  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  if (!response.ok) {
    throw new Error("Gagal menghubungi AI");
  }

  return response.json();
}

export async function createApplication(application: {
  company: string;
  position: string;
  source: string | null;
  date_applied: string | null;
}) {
  const response = await fetch(
    "http://127.0.0.1:8000/applications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: application.company,
        position: application.position,
        source: application.source,
        date_applied: application.date_applied,
        status: "Applied",
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Gagal menyimpan lamaran");
  }

  return response.json();
}