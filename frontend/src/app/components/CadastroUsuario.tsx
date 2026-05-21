import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  X,
} from "lucide-react";

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

export default function CadastroUsuario({
  onClose,
  onSalvar,
  usuarioEdicao = null,
  permitirEscolherTipo = true,
}: CadastroUsuarioProps) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tipo, setTipo] = useState<"adm" | "tecnico">("tecnico");
  const [numeroConselho, setNumeroConselho] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] =
    useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (usuarioEdicao) {
      setNome(usuarioEdicao.nome || "");
      setEmail(usuarioEdicao.email || "");
      setTipo(usuarioEdicao.tipo || "tecnico");
      setNumeroConselho(usuarioEdicao.numeroConselho || "");
    }
  }, [usuarioEdicao]);

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
    );

    const emailExiste = usuarios.find(
      (u: any) =>
        u.email === email &&
        (!usuarioEdicao || u.id !== usuarioEdicao.id),
    );

    if (emailExiste) {
      setErro("Este email já está cadastrado");
      return;
    }

    if (usuarioEdicao) {
      const atualizados = usuarios.map((u: any) =>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-2xl">
        <div
          className="flex items-center justify-between mb-6 p-4 rounded-xl -mx-2 -mt-2"
          style={{
            background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 50%, #ba68c8 100%)'
          }}
        >
          <h2 className="text-white text-xl font-bold">
            {usuarioEdicao ? "Editar Perfil" : "Novo Usuário"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {erro && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold shadow-sm">
              {erro}
            </div>
          )}

          <div>
            <label className="block text-gray-800 mb-2 font-semibold">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-100 p-1.5 rounded-lg">
                <User className="w-5 h-5 text-purple-700" />
              </div>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-lg border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-800 mb-2 font-semibold">
              Email
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-100 p-1.5 rounded-lg">
                <Mail className="w-5 h-5 text-purple-700" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-lg border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
                required
              />
            </div>
          </div>

          {permitirEscolherTipo && (
            <div>
              <label className="block text-gray-800 mb-2 font-semibold">
                Tipo de Usuário
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-100 p-1.5 rounded-lg z-10">
                  <Shield className="w-5 h-5 text-purple-700" />
                </div>
                <select
                  value={tipo}
                  onChange={(e) =>
                    setTipo(e.target.value as "adm" | "tecnico")
                  }
                  className="w-full pl-12 pr-4 py-3 bg-purple-50 rounded-lg border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
                >
                  <option value="tecnico">Técnico</option>
                  <option value="adm">Administrador</option>
                </select>
              </div>
            </div>
          )}

          {tipo === "tecnico" && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-2 border-blue-200 shadow-sm">
              <label className="block text-blue-900 mb-2 font-bold">
                Número do Conselho <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={numeroConselho}
                onChange={(e) => setNumeroConselho(e.target.value)}
                placeholder="Ex: CREA-AM 123456"
                className="w-full px-4 py-3 bg-white rounded-lg border-2 border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all"
                required={tipo === "tecnico"}
              />
              <p className="text-xs text-blue-700 mt-2 font-medium">
                ℹ️ Este número aparecerá nos documentos gerados pelo técnico
              </p>
            </div>
          )}

          <div>
            <label className="block text-gray-800 mb-2 font-semibold">
              {usuarioEdicao ? "Nova Senha (opcional)" : "Senha"}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-100 p-1.5 rounded-lg">
                <Lock className="w-5 h-5 text-purple-700" />
              </div>
              <input
                type={mostrarSenha ? "text" : "password"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full pl-12 pr-14 py-3 bg-purple-50 rounded-lg border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 bg-purple-100 p-1.5 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {mostrarSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-800 mb-2 font-semibold">
              Confirmar Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-purple-100 p-1.5 rounded-lg">
                <Lock className="w-5 h-5 text-purple-700" />
              </div>
              <input
                type={
                  mostrarConfirmarSenha ? "text" : "password"
                }
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
                className="w-full pl-12 pr-14 py-3 bg-purple-50 rounded-lg border-2 border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition-all"
              />
              <button
                type="button"
                onClick={() =>
                  setMostrarConfirmarSenha(
                    !mostrarConfirmarSenha,
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-800 bg-purple-100 p-1.5 rounded-lg hover:bg-purple-200 transition-colors"
              >
                {mostrarConfirmarSenha ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full text-white py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
            style={{
              background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 50%, #ba68c8 100%)'
            }}
          >
            {usuarioEdicao ? "Salvar Alterações" : "Criar Usuário"}
          </button>
        </form>
      </div>
    </div>
  );
}