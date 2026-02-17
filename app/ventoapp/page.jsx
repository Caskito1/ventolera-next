"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard"); // redirige al dashboard
    } catch (err) {
      setError("Credenciales inválidas");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
       {/* Fondo */}
      <div className="absolute inset-0 -z-10">
        <div
          className="w-full h-full bg-fixed bg-center bg-cover"
          style={{ backgroundImage: "url('/media/bg-modales/coope-modal.webp')" }}
        />
        <div className="absolute inset-0 bg-gray-900/80" />
        <div className="absolute inset-0 bg-[url('/media/patterns/noise.webp')] opacity-30 mix-blend-overlay pointer-events-none" />
      </div>
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-md bg-white/10 border border-white/20 shadow-xl rounded-2xl p-8 w-80 text-center text-white"
      >
        <h1 className="text-xl font-bold mb-4 text-center">Iniciar sesión</h1>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-3 rounded"
          required
        />

        <button
          type="submit"
           className="bg-orange-500/80 hover:bg-orange-600/90 text-white font-semibold py-2 rounded-md w-full transition-all duration-200 backdrop-blur-sm shadow-md hover:shadow-lg"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
