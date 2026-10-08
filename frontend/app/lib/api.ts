const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(
  email: string,
  password: string
) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login gagal");
  }

  return data;
}

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

export async function getApplications(
  token?: string
): Promise<ApplicationsResponse> {
  const response = await fetch(`${API_URL}/applications`, {
    cache: "no-store",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    const errorData = await response.text();

    console.log("APPLICATION ERROR STATUS:", response.status);
    console.log("APPLICATION ERROR DATA:", errorData);

    throw new Error(
      `Gagal mengambil data lamaran (${response.status})`
    );
  }

  return response.json();
}

export async function getApplicationStats(
  token?: string
): Promise<ApplicationStats> {
  const response = await fetch(`${API_URL}/applications/stats`, {
    cache: "no-store",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil statistik lamaran");
  }

  return response.json();
}

export async function sendChatMessage(message: string) {
  const response = await fetch(`${API_URL}/chat`, {
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
    `${API_URL}/applications`,
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