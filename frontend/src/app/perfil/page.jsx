"use client";
import { useState, useEffect } from "react";

export default function Perfil({ userId = 1 }) {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "" });

  // Buscar dados do usuário ao carregar
  useEffect(() => {
    fetch(`http://localhost:3000/usuarios/perfil/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsuario(data);
        setForm({ nome: data.nome, email: data.email, senha: "" });
      })
      .catch((err) => console.error("Erro ao carregar perfil:", err));
  }, [userId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`http://localhost:3000/usuarios/perfil/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        alert("Perfil atualizado com sucesso!");
        setEditando(false);
        const atualizado = await res.json();
        setUsuario({ ...usuario, ...form });
      } else {
        alert("Erro ao atualizar perfil");
      }
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  if (!usuario) return <p>Carregando...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Meu Perfil</h1>

      {!editando ? (
        <div>
          <p><strong>Nome:</strong> {usuario.nome}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Função:</strong> {usuario.funcao}</p>
          <p><strong>Status:</strong> {usuario.status}</p>

          <button
            onClick={() => setEditando(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Editar Perfil
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome"
            className="border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="Nova senha"
            className="border p-2 rounded"
          />

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Salvar
            </button>
            <button
              onClick={() => setEditando(false)}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
