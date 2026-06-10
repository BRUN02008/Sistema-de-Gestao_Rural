import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoadingRoute } from "../../components/layout/LoadingRoute";
import type { UsuarioLogado } from "../../types/app";
import { ROUTES } from "./routes";

const RecomendacoesTecnicas = lazy(
  () => import("../../pages/Recomendacoes/RecomendacoesTecnicasPage"),
);
const Atendimento = lazy(() => import("../../pages/Atendimento/AtendimentoPage"));
const CadastroProdutor = lazy(() => import("../../pages/Produtores/CadastroProdutorPage"));
const EmissaoDocumento = lazy(() => import("../../pages/Documentos/EmissaoDocumentoPage"));
const CronogramaSemanalMelhorado = lazy(() => import("../../pages/Cronograma/CronogramaPage"));
const PainelAdmin = lazy(() => import("../../pages/Dashboard/PainelAdminPage"));
const HistoricoTrimestre = lazy(() => import("../../pages/Historico/HistoricoTrimestrePage"));
const GerenciadorComunidades = lazy(
  () => import("../../pages/Comunidades/GerenciadorComunidadesPage"),
);
const GerenciadorVeiculos = lazy(
  () => import("../../pages/Veiculos/GerenciadorVeiculosPage"),
);
const RelatorioGeralProdutor = lazy(
  () => import("../../pages/Produtores/RelatorioGeralProdutorPage"),
);
const HistoricoTecnico = lazy(() => import("../../pages/Historico/HistoricoTecnico"));
const Sobre = lazy(() => import("../../pages/Sobre/SobrePage"));

interface AppRoutesProps {
  homePath: string;
  isAdm: boolean;
  usuarioLogado: UsuarioLogado;
}

export function AppRoutes({
  homePath,
  isAdm,
  usuarioLogado,
}: AppRoutesProps) {
  return (
    <Suspense fallback={<LoadingRoute />}>
      <Routes>
        <Route path={ROUTES.root} element={<Navigate to={homePath} replace />} />
        <Route path={ROUTES.login} element={<Navigate to={homePath} replace />} />
        <Route path={ROUTES.app} element={<Navigate to={homePath} replace />} />
        <Route
          path={ROUTES.painel}
          element={
            isAdm ? <PainelAdmin /> : <Navigate to={ROUTES.cadastro} replace />
          }
        />
        <Route
          path={ROUTES.relatorio}
          element={
            isAdm ? (
              <RelatorioGeralProdutor />
            ) : (
              <Navigate to={ROUTES.cadastro} replace />
            )
          }
        />
        <Route
          path={ROUTES.comunidades}
          element={
            isAdm ? (
              <GerenciadorComunidades />
            ) : (
              <Navigate to={ROUTES.cadastro} replace />
            )
          }
        />
        <Route path={ROUTES.atendimento} element={<Atendimento />} />
        <Route path={ROUTES.cadastro} element={<CadastroProdutor />} />
        <Route
          path={ROUTES.veiculos}
          element={<GerenciadorVeiculos usuarioLogado={usuarioLogado} />}
        />
        <Route
          path={ROUTES.historico}
          element={<HistoricoTecnico usuarioLogado={usuarioLogado} />}
        />
        <Route path={ROUTES.trimestre} element={<HistoricoTrimestre />} />
        <Route path={ROUTES.emissao} element={<EmissaoDocumento />} />
        <Route
          path={ROUTES.cronograma}
          element={<CronogramaSemanalMelhorado />}
        />
        <Route
          path={ROUTES.recomendacoes}
          element={<RecomendacoesTecnicas />}
        />
        <Route path={ROUTES.sobre} element={<Sobre />} />
        <Route path="*" element={<Navigate to={homePath} replace />} />
      </Routes>
    </Suspense>
  );
}
