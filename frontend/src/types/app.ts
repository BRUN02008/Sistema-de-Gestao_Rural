import type { LucideIcon } from "lucide-react";
export type { TipoUsuario, UsuarioLogado } from "./usuario";

export type Tab =
  | "painel"
  | "cadastro"
  | "emissao"
  | "cronograma"
  | "atendimento"
  | "recomendacoes"
  | "historico"
  | "relatorio"
  | "trimestre"
  | "veiculos"
  | "comunidades"
  | "sobre";

export interface MenuLink {
  key: Tab;
  label: string;
  icon: LucideIcon;
  visible: boolean;
  description?: string;
  badge?: string;
}

export interface MenuGroup {
  title: string;
  items: MenuLink[];
}
