import {
  Calendar,
  ClipboardPenLine,
  FileBarChart,
  FileText,
  History,
  Home,
  Info,
  LayoutDashboard,
  MapPinned,
  Sprout,
  Truck,
  UserRoundCheck,
  UserRoundPlus,
  Users,
} from "lucide-react";
import type { MenuGroup, MenuLink, Tab } from "../../types/app";

export const rotasTecnico: Tab[] = [
  "cadastro",
  "atendimento",
  "veiculos",
  "historico",
  "trimestre",
  "recomendacoes",
  "emissao",
  "cronograma",
  "sobre",
];

export const rotasAdmin: Tab[] = [
  "painel",
  "relatorio",
  "comunidades",
  ...rotasTecnico,
];

const menuGroups: MenuGroup[] = [
  {
    title: "Gestão",
    items: [
      {
        key: "painel",
        label: "Dashboard",
        icon: LayoutDashboard,
        visible: true,
        description: "Indicadores e acompanhamento geral",
      },
      {
        key: "relatorio",
        label: "Relatórios",
        icon: FileBarChart,
        visible: true,
        description: "Consolidação de produtores e atendimentos",
      },
    ],
  },
  {
    title: "Produtores",
    items: [
      {
        key: "cadastro",
        label: "Cadastro",
        icon: UserRoundPlus,
        visible: true,
        description: "Dados do produtor, registro, carteira e produção",
      },
      {
        key: "atendimento",
        label: "Atendimento",
        icon: UserRoundCheck,
        visible: true,
        description: "Fluxo de atendimento técnico",
      },
      {
        key: "comunidades",
        label: "Comunidades",
        icon: Users,
        visible: true,
        description: "Comunidades e bases territoriais",
      },
    ],
  },
  {
    title: "Campo",
    items: [
      {
        key: "cronograma",
        label: "Cronograma",
        icon: Calendar,
        visible: true,
        description: "Agenda de visitas de campo",
      },
      {
        key: "veiculos",
        label: "Veículos",
        icon: Truck,
        visible: true,
        description: "Controle de deslocamentos",
      },
      {
        key: "recomendacoes",
        label: "Recomendações",
        icon: ClipboardPenLine,
        visible: true,
        description: "Orientações técnicas emitidas",
      },
    ],
  },
  {
    title: "Documentos",
    items: [
      {
        key: "emissao",
        label: "Emissão",
        icon: FileText,
        visible: true,
        description: "Declarações e documentos oficiais",
      },
      {
        key: "historico",
        label: "Histórico",
        icon: History,
        visible: true,
        description: "Consultas e registros anteriores",
      },
      {
        key: "trimestre",
        label: "Trimestre",
        icon: Sprout,
        visible: true,
        description: "Acompanhamento trimestral",
      },
    ],
  },
  {
    title: "Institucional",
    items: [
      {
        key: "sobre",
        label: "Sobre",
        icon: Info,
        visible: true,
        description: "Informações do sistema IDAM",
      },
    ],
  },
];

export function getMenuGroups(isAdm: boolean): MenuGroup[] {
  return menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        if (item.key === "painel" || item.key === "relatorio" || item.key === "comunidades") {
          return isAdm;
        }

        return item.visible;
      }),
    }))
    .filter((group) => group.items.length > 0);
}

export function getMenuLinks(isAdm: boolean): MenuLink[] {
  return getMenuGroups(isAdm).flatMap((group) => group.items);
}

export const quickAccessLinks = [
  { label: "Início", icon: Home },
  { label: "Campo", icon: MapPinned },
  { label: "Produção", icon: Sprout },
];
