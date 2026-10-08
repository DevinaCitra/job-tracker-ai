"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const data = await loginUser(email, password);

      localStorage.setItem("access_token", data.access_token);

      router.push("/dashboard");
    } catch (error) {
      setError("Email atau password salah");
    }
  };

  return (
    <main>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">
          Login
        </button>

        {error && <p>{error}</p>}
      </form>
    </main>
  );
}