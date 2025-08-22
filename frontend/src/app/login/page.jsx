"use client";

import { useState } from "react";
import { useAuth } from "@/components/AuthProvider/AuthProvider";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const usuarioLogado = await login(email, senha);

      // Redirecionamento por função
      if (usuarioLogado.funcao === "admin") {
        router.push("/home-adm");
      } else if (usuarioLogado.funcao === "tecnico") {
        router.push("/home-manutencao");
      } else {
        router.push("/"); // usuário comum
      }

    } catch (error) {
      setError(error.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="max-w-md w-full  rounded-xl  p-8">
        <img src="/logo.png" alt="" className="" />
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="********"
              required
              disabled={loading}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
