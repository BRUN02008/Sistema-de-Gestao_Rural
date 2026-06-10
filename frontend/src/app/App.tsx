import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LoadingRoute } from "../components/layout/LoadingRoute";
import { AppShell } from "./layout/AppShell";
import {
  getMenuGroups,
  getMenuLinks,
  rotasAdmin,
  rotasTecnico,
} from "./routes/navigation";
import type { Tab, UsuarioLogado } from "../types/app";
import {
  clearUsuarioLogado,
  ensureDefaultAdmin,
  findUsuarioByCredentials,
  getUsuarioLogado,
  saveUsuarioLogado,
} from "../services/authStorage";

const Login = lazy(() => import("../pages/Auth/LoginPage"));

function getHomePath(usuario: UsuarioLogado | null) {
  if (!usuario) return "/login";
  return usuario.tipo === "adm" ? "/app/painel" : "/app/cadastro";
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarioLogado, setUsuarioLogado] =
    useState<UsuarioLogado | null>(getUsuarioLogado);
  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalMeuPerfil, setModalMeuPerfil] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [sidebarRecolhida, setSidebarRecolhida] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdm = usuarioLogado?.tipo === "adm";
  const rotasPermitidas = isAdm ? rotasAdmin : rotasTecnico;
  const activeTab = useMemo(() => {
    const tab = location.pathname.split("/")[2] as Tab | undefined;
    return tab && rotasPermitidas.includes(tab) ? tab : undefined;
  }, [location.pathname, rotasPermitidas]);

  useEffect(() => {
    ensureDefaultAdmin();
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuPerfilAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  const atualizarUsuarioLogado = () => {
    setUsuarioLogado(getUsuarioLogado());
  };

  const handleLogin = (
    email: string,
    senha: string,
    usuarioRecebido?: UsuarioLogado,
  ) => {
    if (usuarioRecebido) {
      saveUsuarioLogado(usuarioRecebido);
      setUsuarioLogado(usuarioRecebido);
      navigate(getHomePath(usuarioRecebido), { replace: true });
      return;
    }

    const usuario = findUsuarioByCredentials(email, senha);

    if (usuario) {
      saveUsuarioLogado(usuario);
      setUsuarioLogado(usuario);
      navigate(getHomePath(usuario), { replace: true });
    }
  };

  const handleLogout = () => {
    clearUsuarioLogado();
    setUsuarioLogado(null);
    setMenuPerfilAberto(false);
    setMenuMobileAberto(false);
    navigate("/login", { replace: true });
  };

  const menuLinks = getMenuLinks(isAdm);
  const menuGroups = getMenuGroups(isAdm);
  const visibleMenuLinks = menuLinks.filter((item) => item.visible);
  const activeMenuItem = menuLinks.find((item) => item.key === activeTab);
  const homePath = getHomePath(usuarioLogado);
  const navigateToTab = (tab: Tab) => navigate(`/app/${tab}`);

  if (!usuarioLogado) {
    return (
      <Suspense fallback={<LoadingRoute />}>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <AppShell
      activeMenuItem={activeMenuItem}
      activeTab={activeTab}
      homePath={homePath}
      isAdm={isAdm}
      menuMobileAberto={menuMobileAberto}
      menuPerfilAberto={menuPerfilAberto}
      menuRef={menuRef}
      modalMeuPerfil={modalMeuPerfil}
      modalNovoUsuario={modalNovoUsuario}
      sidebarRecolhida={sidebarRecolhida}
      usuarioLogado={usuarioLogado}
      menuGroups={menuGroups}
      visibleMenuLinks={visibleMenuLinks}
      onAtualizarUsuarioLogado={atualizarUsuarioLogado}
      onCloseMeuPerfil={() => {
        setModalMeuPerfil(false);
        atualizarUsuarioLogado();
      }}
      onCloseMobileMenu={() => setMenuMobileAberto(false)}
      onCloseNovoUsuario={() => setModalNovoUsuario(false)}
      onLogout={handleLogout}
      onNavigate={navigateToTab}
      onOpenMeuPerfil={() => {
        setModalMeuPerfil(true);
        setMenuPerfilAberto(false);
      }}
      onOpenMobileMenu={() => setMenuMobileAberto(true)}
      onOpenNovoUsuario={() => {
        setModalNovoUsuario(true);
        setMenuPerfilAberto(false);
      }}
      onToggleSidebar={() => setSidebarRecolhida((atual) => !atual)}
      onTogglePerfil={() => setMenuPerfilAberto(!menuPerfilAberto)}
    />
  );
}
