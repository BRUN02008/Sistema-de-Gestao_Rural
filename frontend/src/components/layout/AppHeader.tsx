import type { RefObject } from "react";
import {
  Bell,
  ChevronDown,
  ChevronsLeftRight,
  Leaf,
  LogOut,
  Menu,
  Settings,
  Shield,
  UserPlus,
} from "lucide-react";
import type { MenuLink, UsuarioLogado } from "../../types/app";

interface AppHeaderProps {
  activeMenuItem?: MenuLink;
  isAdm: boolean;
  menuPerfilAberto: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  usuarioLogado: UsuarioLogado;
  onLogout: () => void;
  onOpenMeuPerfil: () => void;
  onOpenMobileMenu: () => void;
  onOpenNovoUsuario: () => void;
  onToggleSidebar: () => void;
  onTogglePerfil: () => void;
}

function getInitials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join("");
}

export function AppHeader({
  activeMenuItem,
  isAdm,
  menuPerfilAberto,
  menuRef,
  usuarioLogado,
  onLogout,
  onOpenMeuPerfil,
  onOpenMobileMenu,
  onOpenNovoUsuario,
  onToggleSidebar,
  onTogglePerfil,
}: AppHeaderProps) {
  const ActiveIcon = activeMenuItem?.icon || Leaf;
  const cargo = isAdm ? "Administrador" : "Técnico de campo";

  return (
    <header className="sticky top-0 z-30 border-b border-[#dce5dc] bg-white/95 shadow-sm backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-3 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#d7e0d7] bg-white text-[#184b36] transition hover:bg-[#edf6ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b6b49] lg:hidden"
            aria-label="Abrir menu de navegação"
          >
            <Menu className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-[#d7e0d7] bg-white text-[#184b36] transition hover:bg-[#edf6ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b6b49] lg:inline-flex"
            aria-label="Recolher ou expandir menu lateral"
          >
            <ChevronsLeftRight className="h-5 w-5" />
          </button>

          <div className="hidden h-10 w-px bg-[#dce5dc] sm:block" />

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#184b36] text-white shadow-sm">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#547465]">
                <span>IDAM</span>
                <span className="hidden h-1 w-1 rounded-full bg-[#c2d2c8] sm:inline-block" />
                <span className="hidden sm:inline">Gestão rural</span>
              </div>
              <h1 className="truncate text-base font-bold leading-tight text-[#12251c] sm:text-lg">
                {activeMenuItem?.label || "Área de trabalho"}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-md border border-[#d7e0d7] bg-white text-[#547465] transition hover:bg-[#edf6ed] hover:text-[#184b36] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b6b49] sm:inline-flex"
            aria-label="Notificações"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={onTogglePerfil}
              className="flex items-center gap-2 rounded-lg border border-[#d7e0d7] bg-white px-2 py-1.5 text-left shadow-sm transition hover:bg-[#f6faf6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b6b49] sm:px-3"
              aria-expanded={menuPerfilAberto}
              aria-haspopup="menu"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#dff0e4] text-sm font-bold text-[#184b36]">
                {getInitials(usuarioLogado.nome) || "ID"}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="flex max-w-44 items-center gap-1 truncate text-sm font-bold text-[#12251c]">
                  {usuarioLogado.nome}
                  {isAdm && <Shield className="h-4 w-4 shrink-0 text-[#b7791f]" />}
                </span>
                <span className="block text-xs font-medium text-[#607368]">
                  {cargo}
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-[#547465]" />
            </button>

            {menuPerfilAberto && (
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-[#d7e0d7] bg-white shadow-2xl shadow-[#12251c]/12"
              >
                <div className="border-b border-[#edf1ed] bg-[#f6faf6] px-4 py-3">
                  <p className="font-bold text-[#12251c]">{usuarioLogado.nome}</p>
                  <p className="mt-0.5 truncate text-sm text-[#607368]">
                    {usuarioLogado.email}
                  </p>
                  <span className="mt-2 inline-flex rounded-full bg-[#dff0e4] px-2.5 py-1 text-xs font-bold text-[#184b36]">
                    {cargo}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenMeuPerfil}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-[#263a31] transition hover:bg-[#f6faf6]"
                  role="menuitem"
                >
                  <Settings className="h-4 w-4 text-[#184b36]" />
                  Meu perfil
                </button>

                {isAdm && (
                  <button
                    type="button"
                    onClick={onOpenNovoUsuario}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-[#263a31] transition hover:bg-[#f6faf6]"
                    role="menuitem"
                  >
                    <UserPlus className="h-4 w-4 text-[#184b36]" />
                    Novo usuário
                  </button>
                )}

                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 border-t border-[#edf1ed] px-4 py-3 text-left text-sm font-semibold text-red-700 transition hover:bg-red-50"
                  role="menuitem"
                >
                  <LogOut className="h-4 w-4" />
                  Sair do sistema
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
