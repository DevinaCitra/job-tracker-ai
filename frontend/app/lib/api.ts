const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(
  email: string,
  password: string
) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  console.log("EMAIL:", email);
  console.log("PASSWORD LENGTH:", password.length);
  console.log("FORM DATA:", formData.toString());

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const data = await response.json();

  console.log("RESPONSE STATUS:", response.status);
  console.log("RESPONSE DATA:", JSON.stringify(data));

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