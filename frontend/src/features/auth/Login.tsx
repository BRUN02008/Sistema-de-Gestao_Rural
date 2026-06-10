import { useState } from "react";
import {
  ClipboardCheck,
  Eye,
  EyeOff,
  FileSignature,
  Leaf,
  Lock,
  MapPinned,
  Shield,
  User,
} from "lucide-react";

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

interface UsuarioLocalStorage {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo?: "adm" | "tecnico";
}

const workflowItems = [
  {
    title: "Registro do produtor",
    detail: "Dados pessoais, propriedade, atividades e perfil produtivo.",
    icon: ClipboardCheck,
  },
  {
    title: "Localidade e acompanhamento",
    detail: "Município, comunidade, técnico responsável e histórico.",
    icon: MapPinned,
  },
  {
    title: "Documentos oficiais",
    detail: "Declarações e relatórios conectados ao cadastro rural.",
    icon: FileSignature,
  },
];

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Informe email e senha para acessar o sistema.");
      return;
    }

    const rawUsuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarios: UsuarioLocalStorage[] = Array.isArray(rawUsuarios)
      ? rawUsuarios
      : [];

    const usuario = usuarios.find(
      (item) => item.email === email && item.senha === senha,
    );

    if (!usuario) {
      setErro("Email ou senha incorretos.");
      return;
    }

    const usuarioLogado = {
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
      tipo: (usuario.tipo || "tecnico") as "adm" | "tecnico",
      loginTime: new Date().toISOString(),
    };

    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioLogado));
    onLogin(usuario.email, senha, usuarioLogado);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#eef3ee_0%,#f8fbf8_52%,#dff0e4_100%)] px-4 py-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[#d7e0d7] bg-white/80 px-4 py-2 text-sm font-bold text-[#184b36] shadow-sm backdrop-blur">
              <Leaf className="h-4 w-4" />
              Instituto de Desenvolvimento Agropecuário e Florestal
            </div>

            <h1 className="text-5xl font-bold leading-tight text-[#12251c]">
              Atendimento rural integrado para a equipe do IDAM.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#607368]">
              Cadastro, histórico e emissão aparecem como etapas da mesma
              visita, com contexto suficiente para apoiar o acompanhamento
              agropecuário e florestal.
            </p>

            <div className="mt-8 space-y-3">
              {workflowItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="grid grid-cols-[2.75rem_1fr] gap-3 rounded-xl border border-[#d7e0d7] bg-white/85 p-4 shadow-sm backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#184b36] text-white shadow-sm">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#184b36]">
                        Etapa {index + 1}
                      </p>
                      <p className="mt-1 font-bold text-[#12251c]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-[#607368]">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="w-full max-w-md justify-self-center overflow-hidden rounded-2xl border border-[#d7e0d7] bg-white/95 shadow-2xl shadow-[#123d2d]/10 backdrop-blur">
          <div className="border-b border-[#d7e0d7] bg-[linear-gradient(135deg,rgba(27,107,73,0.12),rgba(255,255,255,0.94))] p-6 sm:p-8">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#184b36] shadow-sm">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#184b36]">
              Sistema IDAM
            </p>
            <h2 className="mt-2 text-2xl font-bold text-[#12251c]">
              Acesse sua área de trabalho
            </h2>
            <p className="mt-1 text-sm text-[#607368]">
              Perfil técnico ou administrativo, com sessão local neste
              navegador.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <p className="mb-7 text-sm font-bold text-[#12251c]">
              Credenciais de acesso
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {erro && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-sm">
                  {erro}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-bold text-[#263a31]">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#dff0e4] p-1.5">
                    <User className="h-5 w-5 text-[#184b36]" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full rounded-lg border border-[#d7e0d7] bg-[#fbfdfb] py-3.5 pl-12 pr-4 text-[#12251c] transition placeholder:text-[#8a968f] focus:border-[#1b6b49] focus:outline-none focus:ring-4 focus:ring-[#1b6b49]/12"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-[#263a31]">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#dff0e4] p-1.5">
                    <Lock className="h-5 w-5 text-[#184b36]" />
                  </div>
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full rounded-lg border border-[#d7e0d7] bg-[#fbfdfb] py-3.5 pl-12 pr-14 text-[#12251c] transition placeholder:text-[#8a968f] focus:border-[#1b6b49] focus:outline-none focus:ring-4 focus:ring-[#1b6b49]/12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-[#dff0e4] p-1.5 text-[#184b36] transition hover:bg-[#c9e8d2]"
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {mostrarSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-[#184b36] py-3.5 font-bold text-white shadow-lg shadow-[#184b36]/20 transition hover:bg-[#123d2d] focus:outline-none focus:ring-4 focus:ring-[#1b6b49]/20"
              >
                Entrar
              </button>
            </form>

            <div className="mt-6 rounded-lg border border-[#d7e0d7] bg-[#f6faf6] p-4 text-sm">
              <div className="flex items-center gap-3 text-[#184b36]">
                <div className="rounded-lg bg-white p-1.5 shadow-sm">
                  <Shield className="h-4 w-4 text-[#184b36]" />
                </div>
                <p className="font-semibold">
                  A sessão fica vinculada ao perfil técnico ou administrativo.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
