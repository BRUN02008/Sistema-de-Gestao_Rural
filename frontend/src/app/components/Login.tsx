import { useState } from "react";
import { Leaf, Lock, User, Eye, EyeOff, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (
    email: string,
    senha: string,
    usuario?: {
      id: string;
      nome: string;
      email: string;
      tipo: "adm" | "tecnico";
    },
  ) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Por favor, preencha todos os campos");
      return;
    }

    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    );

    const usuario = usuarios.find(
      (u: any) => u.email === email && u.senha === senha,
    );

    if (usuario) {
      const usuarioLogado = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: (usuario.tipo || "tecnico") as "adm" | "tecnico",
        loginTime: new Date().toISOString(),
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioLogado),
      );

      onLogin(usuario.email, senha, usuarioLogado);
    } else {
      setErro("Email ou senha incorretos");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)'
      }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #2d6a3e 0%, #43a047 50%, #66bb6a 100%)'
            }}
          >
            <Leaf className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #2d6a3e 0%, #43a047 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Sistema de Cadastro Rural
          </h1>
          <p className="text-gray-700 text-lg">
            Faça login para acessar o sistema
          </p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {erro && (
              <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium shadow-sm">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-gray-800 mb-2 font-semibold">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-green-100 p-1.5 rounded-lg">
                  <User className="w-5 h-5 text-green-700" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-green-50 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-800 mb-2 font-semibold">
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-green-100 p-1.5 rounded-lg">
                  <Lock className="w-5 h-5 text-green-700" />
                </div>
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-14 py-3.5 bg-green-50 rounded-lg border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-800 transition-colors bg-green-100 p-1.5 rounded-lg hover:bg-green-200"
                >
                  {mostrarSenha ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-white py-3.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #2d6a3e 0%, #43a047 50%, #66bb6a 100%)'
              }}
            >
              Entrar
            </button>
          </form>
        </div>

        <div className="mt-6 bg-white/80 backdrop-blur-sm border-2 border-green-200 rounded-xl p-4 text-sm shadow-md">
          <div className="flex items-center justify-center gap-2 text-green-700">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <Shield className="w-4 h-4 text-green-700" />
            </div>
            <p className="text-center font-medium">
              Use seu email e senha para entrar no sistema
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}