import { lazy, Suspense } from "react";
import type { RefObject } from "react";
import { AppFooter } from "../../components/layout/AppFooter";
import { AppHeader } from "../../components/layout/AppHeader";
import { AppSidebar } from "../../components/layout/AppSidebar";
import { MobileMenu } from "../../components/layout/MobileMenu";
import { WorkspaceBanner } from "../../components/layout/WorkspaceBanner";
import type { MenuGroup, MenuLink, Tab, UsuarioLogado } from "../../types/app";
import { AppRoutes } from "../routes/AppRoutes";

const CadastroUsuario = lazy(() => import("../../features/usuarios/CadastroUsuario"));

interface AppShellProps {
  activeMenuItem?: MenuLink;
  activeTab?: Tab;
  homePath: string;
  isAdm: boolean;
  menuMobileAberto: boolean;
  menuPerfilAberto: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  modalMeuPerfil: boolean;
  modalNovoUsuario: boolean;
  sidebarRecolhida: boolean;
  usuarioLogado: UsuarioLogado;
  menuGroups: MenuGroup[];
  visibleMenuLinks: MenuLink[];
  onAtualizarUsuarioLogado: () => void;
  onCloseMeuPerfil: () => void;
  onCloseMobileMenu: () => void;
  onCloseNovoUsuario: () => void;
  onLogout: () => void;
  onNavigate: (tab: Tab) => void;
  onOpenMeuPerfil: () => void;
  onOpenMobileMenu: () => void;
  onOpenNovoUsuario: () => void;
  onToggleSidebar: () => void;
  onTogglePerfil: () => void;
}

export function AppShell({
  activeMenuItem,
  activeTab,
  homePath,
  isAdm,
  menuMobileAberto,
  menuPerfilAberto,
  menuRef,
  modalMeuPerfil,
  modalNovoUsuario,
  sidebarRecolhida,
  usuarioLogado,
  menuGroups,
  visibleMenuLinks,
  onAtualizarUsuarioLogado,
  onCloseMeuPerfil,
  onCloseMobileMenu,
  onCloseNovoUsuario,
  onLogout,
  onNavigate,
  onOpenMeuPerfil,
  onOpenMobileMenu,
  onOpenNovoUsuario,
  onToggleSidebar,
  onTogglePerfil,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#eef3ee] text-[#12251c]">
      <AppHeader
        activeMenuItem={activeMenuItem}
        isAdm={isAdm}
        menuPerfilAberto={menuPerfilAberto}
        menuRef={menuRef}
        usuarioLogado={usuarioLogado}
        onLogout={onLogout}
        onOpenMeuPerfil={onOpenMeuPerfil}
        onOpenMobileMenu={onOpenMobileMenu}
        onOpenNovoUsuario={onOpenNovoUsuario}
        onToggleSidebar={onToggleSidebar}
        onTogglePerfil={onTogglePerfil}
      />

      <MobileMenu
        aberto={menuMobileAberto}
        activeTab={activeTab}
        menuGroups={menuGroups}
        visibleMenuLinks={visibleMenuLinks}
        onClose={onCloseMobileMenu}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      <div className="flex min-w-0">
        <AppSidebar
          activeTab={activeTab}
          collapsed={sidebarRecolhida}
          menuGroups={menuGroups}
          onNavigate={onNavigate}
          onToggleCollapsed={onToggleSidebar}
        />

        <main className="app-content min-w-0 flex-1 px-3 py-4 sm:px-5 sm:py-5 lg:px-8 lg:py-7">
          <WorkspaceBanner activeMenuItem={activeMenuItem} />

          <AppRoutes
            homePath={homePath}
            isAdm={isAdm}
            usuarioLogado={usuarioLogado}
          />
        </main>
      </div>

      <AppFooter />

      <Suspense fallback={null}>
        {modalNovoUsuario && isAdm && (
          <CadastroUsuario
            onClose={onCloseNovoUsuario}
            onSalvar={onAtualizarUsuarioLogado}
            permitirEscolherTipo={true}
          />
        )}

        {modalMeuPerfil && (
          <CadastroUsuario
            onClose={onCloseMeuPerfil}
            onSalvar={onAtualizarUsuarioLogado}
            usuarioEdicao={usuarioLogado}
            permitirEscolherTipo={isAdm}
          />
        )}
      </Suspense>
    </div>
  );
}
