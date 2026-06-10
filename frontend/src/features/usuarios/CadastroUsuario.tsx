import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Shield, User, X } from "lucide-react";

interface CadastroUsuarioProps {
  onClose: () => void;
  onSalvar?: () => void;
  usuarioEdicao?: {
    id: string;
    nome: string;
    email: string;
    tipo: "adm" | "tecnico";
    numeroConselho?: string;
  } | null;
  permitirEscolherTipo?: boolean;
}

interface UsuarioSalvo {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  tipo?: "adm" | "tecnico";
  numeroConselho?: string;
  dataCadastro?: string;
}

export default function CadastroUsuario({
  onClose,
  onSalvar,
  usuarioEdicao = null,
  permitirEscolherTipo = true,
}: CadastroUsuarioProps) {
  const [nome, setNome] = useState(usuarioEdicao?.nome || "");
  const [email, setEmail] = useState(usuarioEdicao?.email || "");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipo, setTipo] = useState<"adm" | "tecnico">(
    usuarioEdicao?.tipo || "tecnico",
  );
  const [numeroConselho, setNumeroConselho] = useState(
    usuarioEdicao?.numeroConselho || "",
  );
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome || !email) {
      setErro("Por favor, preencha os campos obrigatórios");
      return;
    }

    if (tipo === "tecnico" && !numeroConselho) {
      setErro("Por favor, informe o número do conselho do técnico");
      return;
    }

    if (!usuarioEdicao && !senha) {
      setErro("Informe uma senha");
      return;
    }

    if (senha && senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (senha !== confirmarSenha && (senha || confirmarSenha)) {
      setErro("As senhas não coincidem");
      return;
    }

    const usuarios = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    ) as UsuarioSalvo[];

    const emailExiste = usuarios.find(
      (u) => u.email === email && (!usuarioEdicao || u.id !== usuarioEdicao.id),
    );

    if (emailExiste) {
      setErro("Este email já está cadastrado");
      return;
    }

    if (usuarioEdicao) {
      const atualizados = usuarios.map((u) =>
        u.id === usuarioEdicao.id
          ? {
              ...u,
              nome,
              email,
              tipo,
              numeroConselho: tipo === "tecnico" ? numeroConselho : "",
              senha: senha ? senha : u.senha,
            }
          : u,
      );

      localStorage.setItem("usuarios", JSON.stringify(atualizados));

      const usuarioLogado = JSON.parse(
        localStorage.getItem("usuarioLogado") || "null",
      );

      if (usuarioLogado && usuarioLogado.id === usuarioEdicao.id) {
        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify({
            ...usuarioLogado,
            nome,
            email,
            tipo,
          }),
        );
      }
    } else {
      const novoUsuario = {
        id: Date.now().toString(),
        nome,
        email,
        senha,
        tipo,
        numeroConselho: tipo === "tecnico" ? numeroConselho : "",
        dataCadastro: new Date().toISOString(),
      };

      usuarios.push(novoUsuario);
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    if (onSalvar) onSalvar();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#13251d]/70 px-4 py-8 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-lg items-start justify-center">
        <div className="idam-form w-full overflow-hidden rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] shadow-2xl shadow-[#13251d]/30">
          <div className="flex items-start justify-between gap-4 bg-[linear-gradient(135deg,#173f31_0%,#245942_72%,#173f31_100%)] p-5 text-white">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-[#173f31]">
                {usuarioEdicao ? (
                  <User className="h-6 w-6" />
                ) : (
                  <Shield className="h-6 w-6" />
                )}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6c46a]">
                  {usuarioEdicao ? "Perfil" : "Usuário"}
                </p>
                <h2 className="mt-1 text-2xl font-semibold">
                  {usuarioEdicao ? "Editar perfil" : "Novo usuário"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-white/70">
                  {usuarioEdicao
                    ? "Atualize seus dados de acesso e identificação técnica."
                    : "Crie um acesso para técnico ou administrador."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white transition hover:bg-white/15"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-5">
            {erro && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {erro}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="nome-usuario">
                  Nome completo <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#607368]" />
                  <input
                    id="nome-usuario"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="email-usuario">
                  Email <span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#607368]" />
                  <input
                    id="email-usuario"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-11"
                    required
                  />
                </div>
              </div>

              {permitirEscolherTipo && (
                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label htmlFor="tipo-usuario" className="mb-0">
                      Tipo de usuário
                    </label>
                    <span className="rounded-full border border-[#d8d6c9] bg-white px-3 py-1 text-xs font-semibold text-[#466255]">
                      {tipo === "tecnico" ? "Técnico" : "Administrador"}
                    </span>
                  </div>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-[#607368]" />
                    <select
                      id="tipo-usuario"
                      value={tipo}
                      onChange={(e) =>
                        setTipo(e.target.value as "adm" | "tecnico")
                      }
                      className="pl-11"
                    >
                      <option value="tecnico">Técnico</option>
                      <option value="adm">Administrador</option>
                    </select>
                  </div>
                </div>
              )}

              {tipo === "tecnico" && (
                <div className="sm:col-span-2 rounded-xl border border-[#e6c46a]/55 bg-[#fbf3da] p-4">
                  <label htmlFor="numero-conselho">
                    Número do conselho <span className="text-red-700">*</span>
                  </label>
                  <input
                    id="numero-conselho"
                    type="text"
                    value={numeroConselho}
                    onChange={(e) => setNumeroConselho(e.target.value)}
                    placeholder="Ex: CREA-AM 123456"
                    required={tipo === "tecnico"}
                  />
                  <p className="mt-2 text-xs font-medium text-[#71561b]">
                    Esse número aparecerá nos documentos gerados pelo técnico.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="senha-usuario">
                  {usuarioEdicao ? "Nova senha" : "Senha"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#607368]" />
                  <input
                    id="senha-usuario"
                    type={mostrarSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="pl-11 pr-11"
                    placeholder={usuarioEdicao ? "Opcional" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-[#607368] transition hover:bg-[#f4f0e7]"
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

              <div>
                <label htmlFor="confirmar-senha">Confirmar senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#607368]" />
                  <input
                    id="confirmar-senha"
                    type={mostrarConfirmarSenha ? "text" : "password"}
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    className="pl-11 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                    }
                    className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-[#607368] transition hover:bg-[#f4f0e7]"
                    aria-label={
                      mostrarConfirmarSenha
                        ? "Ocultar confirmação"
                        : "Mostrar confirmação"
                    }
                  >
                    {mostrarConfirmarSenha ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[#ded9c8] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="border border-[#d8d6c9] bg-white px-5 py-3 font-semibold text-[#263a31] transition hover:bg-[#f4f0e7]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#173f31] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#245942]"
              >
                {usuarioEdicao ? "Salvar alterações" : "Criar usuário"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
