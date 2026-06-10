export type TipoUsuario = "adm" | "tecnico";

export interface UsuarioLogado {
  id: string;
  email: string;
  nome: string;
  tipo: TipoUsuario;
}
