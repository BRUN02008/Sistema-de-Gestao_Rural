import type { TipoUsuario, UsuarioLogado } from "../types/app";

type UsuarioSalvo = {
  id?: string;
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  dataCadastro?: string;
};

const USUARIOS_STORAGE_KEY = "usuarios";
const USUARIO_LOGADO_STORAGE_KEY = "usuarioLogado";

const ADMIN_PADRAO: UsuarioSalvo = {
  id: "1",
  nome: "adm1",
  email: "brunoguilherme@gmail.com",
  senha: "adm123",
  tipo: "adm",
};

function normalizeUsuarioLogado(usuario: UsuarioSalvo): UsuarioLogado {
  return {
    id: String(usuario.id || ""),
    nome: String(usuario.nome || ""),
    email: String(usuario.email || ""),
    tipo: (usuario.tipo || "tecnico") as TipoUsuario,
  };
}

export function getUsuariosSalvos(): UsuarioSalvo[] {
  return JSON.parse(localStorage.getItem(USUARIOS_STORAGE_KEY) || "[]") as UsuarioSalvo[];
}

export function ensureDefaultAdmin() {
  const usuariosSalvos = getUsuariosSalvos();
  const existeAdm = usuariosSalvos.some((u) => u.email === ADMIN_PADRAO.email);

  if (existeAdm) return;

  localStorage.setItem(
    USUARIOS_STORAGE_KEY,
    JSON.stringify([
      { ...ADMIN_PADRAO, dataCadastro: new Date().toISOString() },
      ...usuariosSalvos,
    ]),
  );
}

export function getUsuarioLogado(): UsuarioLogado | null {
  const usuario = localStorage.getItem(USUARIO_LOGADO_STORAGE_KEY);
  if (!usuario) return null;

  return normalizeUsuarioLogado(JSON.parse(usuario) as UsuarioSalvo);
}

export function findUsuarioByCredentials(email: string, senha: string) {
  const usuario = getUsuariosSalvos().find(
    (item) => item.email === email && item.senha === senha,
  );

  return usuario ? normalizeUsuarioLogado(usuario) : null;
}

export function saveUsuarioLogado(usuario: UsuarioLogado) {
  localStorage.setItem(
    USUARIO_LOGADO_STORAGE_KEY,
    JSON.stringify({
      ...usuario,
      loginTime: new Date().toISOString(),
    }),
  );
}

export function clearUsuarioLogado() {
  localStorage.removeItem(USUARIO_LOGADO_STORAGE_KEY);
}
