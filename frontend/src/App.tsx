import { useState, useEffect, useRef, useMemo } from "react";
import {
  Leaf,
  FileText,
  LogOut,
  User as UserIcon,
  Calendar,
  ClipboardPenLine,
  Shield,
  ChevronDown,
  UserPlus,
  Settings,
  LayoutDashboard,
  History,
  FileBarChart,
} from "lucide-react";

import RecomendacoesTecnicas from "./components/RecomendacoesTecnicas";
import Login from "./components/Login";
import Atendimento from "./components/Atendimento";
import CadastroUsuario from "./components/CadastroUsuario";
import CadastroProdutor from "./components/CadastroProdutor";
import EmissaoDocumento from "./components/EmissaoDocumento";
import CronogramaSemanalMelhorado from "./components/CronogramaSemanalMelhorado";
import PainelAdmin from "./components/PainelAdmin";
import HistoricoTrimestre from "./components/HistoricoTrimestre";
import GerenciadorComunidades from "./components/GerenciadorComunidades";

type Tela = "login" | "sistema";

type Tab =
  | "painel"
  | "cadastro"
  | "emissao"
  | "cronograma"
  | "atendimento"
  | "recomendacoes"
  | "historico"
  | "relatorio"
  | "trimestre"
  | "comunidades";

type TipoUsuario = "adm" | "tecnico";

interface UsuarioLogado {
  id: string;
  email: string;
  nome: string;
  tipo: TipoUsuario;
}

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  cadastradoPorId?: string;
  cadastradoPorNome?: string;
  tipoPesca?: string;
  rgPesca?: string;
  protocoloRgp?: string;
  perfil?: string[];
  atividades?: string[];
  municipio?: string;
  comunidade?: string;
  [key: string]: any;
}

function mostrarValor(valor: any) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) return "Não informado";

    return valor
      .map((item) =>
        typeof item === "object"
          ? JSON.stringify(item, null, 2)
          : String(item),
      )
      .join(", ");
  }

  if (typeof valor === "object") {
    return JSON.stringify(valor, null, 2);
  }

  return String(valor);
}

function HistoricoTecnico({
  usuarioLogado,
}: {
  usuarioLogado: UsuarioLogado | null;
}) {
  const [produtores, setProdutores] = useState<Produtor[]>([]);

  useEffect(() => {
    setProdutores(JSON.parse(localStorage.getItem("produtores") || "[]"));
  }, []);

  const produtoresPermitidos = useMemo(() => {
    if (!usuarioLogado) return [];

    if (usuarioLogado.tipo === "adm") {
      return produtores;
    }

    return produtores.filter(
      (produtor) => produtor.cadastradoPorId === usuarioLogado.id,
    );
  }, [produtores, usuarioLogado]);

  function isPescador(produtor: Produtor) {
    return (
      produtor.tipoPesca ||
      produtor.rgPesca ||
      produtor.protocoloRgp ||
      produtor.perfil?.includes?.("Pescador") ||
      produtor.atividades?.includes?.("Pesca")
    );
  }

  function documentosDisponiveis(produtor: Produtor) {
    const docs = ["Declaração Oficial", "SEFAZ"];

    if (isPescador(produtor)) {
      docs.push("Declaração de Pescador", "SEFAZ Pescador");
    }

    return docs;
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6 shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, #ffa000 0%, #ffb300 50%, #ffc107 100%)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
            <History className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Histórico de Produtores
            </h2>
            <p className="text-white/90 mt-1">
              {usuarioLogado?.tipo === "adm"
                ? "Administrador pode visualizar todos os produtores cadastrados."
                : "Aqui aparecem apenas os produtores cadastrados pelo técnico logado."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Produtores disponíveis no histórico
        </h3>

        {produtoresPermitidos.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum produtor encontrado para este usuário.
          </p>
        ) : (
          <div className="space-y-4">
            {produtoresPermitidos.map((produtor) => (
              <div
                key={produtor.id}
                className="rounded-xl border-2 border-amber-200 p-4 space-y-4 bg-gradient-to-r from-amber-50 to-orange-50 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <p className="text-foreground font-bold text-lg">
                      {produtor.nome || "Nome não informado"}
                    </p>
                    <p className="text-sm text-amber-700 font-medium">
                      CPF: {produtor.cpf || "Não informado"}
                    </p>
                  </div>

                  <div className="text-sm text-amber-600 md:text-right">
                    <p>Cadastrado por:</p>
                    <p className="text-amber-800 font-semibold">
                      {produtor.cadastradoPorNome || "Não informado"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-800 mb-2">
                    Documentos disponíveis:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {documentosDisponiveis(produtor).map((doc) => (
                      <span
                        key={doc}
                        className="px-3 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm font-medium shadow-md"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">Nome</p>
                    <p className="text-foreground font-medium">
                      {produtor.nome || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">CPF</p>
                    <p className="text-foreground font-medium">
                      {produtor.cpf || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">Município</p>
                    <p className="text-foreground font-medium">
                      {produtor.municipio || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 shadow-sm">
                    <p className="text-amber-700 font-semibold">Comunidade</p>
                    <p className="text-foreground font-medium">
                      {produtor.comunidade || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 md:col-span-2 shadow-sm">
                    <p className="text-amber-700 font-semibold">Perfil</p>
                    <p className="text-foreground font-medium">
                      {mostrarValor(produtor.perfil)}
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/60 border border-amber-200 p-3 md:col-span-2 shadow-sm">
                    <p className="text-amber-700 font-semibold">Atividades</p>
                    <p className="text-foreground font-medium">
                      {mostrarValor(produtor.atividades)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RelatorioGeralProdutor() {
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [observacoes, setObservacoes] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [produtorSelecionado, setProdutorSelecionado] =
    useState<Produtor | null>(null);

  useEffect(() => {
    setProdutores(JSON.parse(localStorage.getItem("produtores") || "[]"));
    setAtendimentos(JSON.parse(localStorage.getItem("atendimentos") || "[]"));
    setObservacoes(
      JSON.parse(localStorage.getItem("recomendacoesTecnicas") || "[]"),
    );
    setDocumentos(
      JSON.parse(localStorage.getItem("historicoDocumentos") || "[]"),
    );
  }, []);

  const atendimentosDoProdutor = atendimentos.filter(
    (item) =>
      item.produtorId === produtorSelecionado?.id ||
      item.produtorCpf === produtorSelecionado?.cpf ||
      item.cpf === produtorSelecionado?.cpf ||
      item.produtorNome === produtorSelecionado?.nome,
  );

  const observacoesDoProdutor = observacoes.filter(
    (item) =>
      item.produtorId === produtorSelecionado?.id ||
      item.produtorCpf === produtorSelecionado?.cpf ||
      item.cpf === produtorSelecionado?.cpf ||
      item.produtorNome === produtorSelecionado?.nome,
  );

  const documentosDoProdutor = documentos.filter(
    (item) =>
      item.produtorId === produtorSelecionado?.id ||
      item.produtorCpf === produtorSelecionado?.cpf ||
      item.cpf === produtorSelecionado?.cpf ||
      item.produtorNome === produtorSelecionado?.nome,
  );

  const camposIgnorados = [
    "id",
    "senha",
    "password",
    "confirmarSenha",
  ];

  const camposCadastro = produtorSelecionado
    ? Object.entries(produtorSelecionado).filter(
        ([campo]) => !camposIgnorados.includes(campo),
      )
    : [];

  return (
    <div className="space-y-6">
      <div
        className="rounded-xl p-6 shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 50%, #42a5f5 100%)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
            <FileBarChart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              Relatório Geral do Produtor
            </h2>
            <p className="text-white/90 mt-1">
              Área restrita ao administrador. Mostra dados de cadastro,
              atendimento, observações técnicas e documentos do produtor.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <label className="text-sm font-medium text-foreground">
          Selecione o produtor
        </label>

        <select
          className="w-full mt-2 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
          value={produtorSelecionado?.id || ""}
          onChange={(e) => {
            const produtor = produtores.find(
              (item) => item.id === e.target.value,
            );

            setProdutorSelecionado(produtor || null);
          }}
        >
          <option value="">Selecione...</option>

          {produtores.map((produtor) => (
            <option key={produtor.id} value={produtor.id}>
              {produtor.nome || "Nome não informado"} -{" "}
              {produtor.cpf || "CPF não informado"}
            </option>
          ))}
        </select>
      </div>

      {produtorSelecionado && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Resumo do Produtor
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">Nome</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.nome || "Não informado"}
                </p>
              </div>

              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">CPF</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.cpf || "Não informado"}
                </p>
              </div>

              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">Técnico</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.cadastradoPorNome || "Não informado"}
                </p>
              </div>

              <div className="rounded-lg bg-accent/40 p-3">
                <p className="text-muted-foreground">Município</p>
                <p className="text-foreground font-medium">
                  {produtorSelecionado.municipio || "Não informado"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Informações do Cadastro
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {camposCadastro.map(([campo, valor]) => (
                <div
                  key={campo}
                  className="rounded-lg bg-accent/40 p-3"
                >
                  <p className="text-muted-foreground">{campo}</p>
                  <p className="text-foreground font-medium whitespace-pre-wrap break-words">
                    {mostrarValor(valor)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Atendimentos
            </h3>

            {atendimentosDoProdutor.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum atendimento registrado para este produtor.
              </p>
            ) : (
              <div className="space-y-3">
                {atendimentosDoProdutor.map((atendimento, index) => (
                  <div
                    key={atendimento.id || index}
                    className="rounded-lg border border-border p-4"
                  >
                    {Object.entries(atendimento).map(([campo, valor]) => (
                      <p
                        key={campo}
                        className="text-sm text-foreground whitespace-pre-wrap break-words"
                      >
                        <strong>{campo}:</strong> {mostrarValor(valor)}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Observações Técnicas
            </h3>

            {observacoesDoProdutor.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhuma observação técnica registrada para este produtor.
              </p>
            ) : (
              <div className="space-y-3">
                {observacoesDoProdutor.map((obs, index) => (
                  <div
                    key={obs.id || index}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="font-medium text-foreground">
                      {obs.titulo || "Observação técnica"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Técnico:{" "}
                      {obs.tecnicoResponsavelNome ||
                        obs.tecnicoResponsavel ||
                        obs.criadoPorNome ||
                        "Não informado"}
                    </p>

                    <p className="text-sm text-foreground mt-2 whitespace-pre-wrap">
                      {obs.descricao ||
                        obs.observacao ||
                        obs.texto ||
                        "Sem descrição."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Documentos Gerados
            </h3>

            {documentosDoProdutor.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum documento gerado para este produtor.
              </p>
            ) : (
              <div className="space-y-3">
                {documentosDoProdutor.map((doc, index) => (
                  <div
                    key={doc.id || index}
                    className="rounded-lg border border-border p-4"
                  >
                    <p className="font-medium text-foreground">
                      {doc.tipoDocumento || "Documento"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Gerado por: {doc.geradoPorNome || "Não informado"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Data: {doc.dataGeracao || "Não informada"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [telaAtual, setTelaAtual] = useState<Tela>("login");
  const [activeTab, setActiveTab] = useState<Tab>("cadastro");
  const [usuarioLogado, setUsuarioLogado] =
    useState<UsuarioLogado | null>(null);

  const [menuPerfilAberto, setMenuPerfilAberto] = useState(false);
  const [modalNovoUsuario, setModalNovoUsuario] = useState(false);
  const [modalMeuPerfil, setModalMeuPerfil] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const usuariosSalvos = JSON.parse(
      localStorage.getItem("usuarios") || "[]",
    );

    const existeAdm = usuariosSalvos.some(
      (u: any) => u.email === "brunoguilherme@gmail.com",
    );

    if (!existeAdm) {
      const admPadrao = {
        id: "1",
        nome: "adm1",
        email: "brunoguilherme@gmail.com",
        senha: "adm123",
        tipo: "adm",
        dataCadastro: new Date().toISOString(),
      };

      localStorage.setItem(
        "usuarios",
        JSON.stringify([admPadrao, ...usuariosSalvos]),
      );
    }

    const usuario = localStorage.getItem("usuarioLogado");

    if (usuario) {
      const dados = JSON.parse(usuario);

      setUsuarioLogado({
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        tipo: (dados.tipo || "tecnico") as TipoUsuario,
      });

      setTelaAtual("sistema");
      setActiveTab(
        (dados.tipo || "tecnico") === "adm" ? "painel" : "cadastro",
      );
    }
  }, []);

  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuPerfilAberto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFora);

    return () => {
      document.removeEventListener("mousedown", handleClickFora);
    };
  }, []);

  const handleLogin = (
    email: string,
    senha: string,
    usuarioRecebido?: {
      id: string;
      nome: string;
      email: string;
      tipo: TipoUsuario;
    },
  ) => {
    if (usuarioRecebido) {
      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          ...usuarioRecebido,
          loginTime: new Date().toISOString(),
        }),
      );

      setUsuarioLogado(usuarioRecebido);
      setTelaAtual("sistema");
      setActiveTab(usuarioRecebido.tipo === "adm" ? "painel" : "cadastro");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

    const usuario = usuarios.find(
      (u: any) => u.email === email && u.senha === senha,
    );

    if (usuario) {
      const dadosUsuario: UsuarioLogado = {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: (usuario.tipo || "tecnico") as TipoUsuario,
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({
          ...dadosUsuario,
          loginTime: new Date().toISOString(),
        }),
      );

      setUsuarioLogado(dadosUsuario);
      setTelaAtual("sistema");
      setActiveTab(dadosUsuario.tipo === "adm" ? "painel" : "cadastro");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    setUsuarioLogado(null);
    setTelaAtual("login");
    setActiveTab("cadastro");
    setMenuPerfilAberto(false);
  };

  const atualizarUsuarioLogado = () => {
    const usuario = localStorage.getItem("usuarioLogado");

    if (usuario) {
      const dados = JSON.parse(usuario);

      setUsuarioLogado({
        id: dados.id,
        nome: dados.nome,
        email: dados.email,
        tipo: (dados.tipo || "tecnico") as TipoUsuario,
      });
    }
  };

  const isAdm = usuarioLogado?.tipo === "adm";
  const isTecnico = usuarioLogado?.tipo === "tecnico";
  const podeUsarSistema = isAdm || isTecnico;

  if (telaAtual === "login") {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header
        className="text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #2d6a3e 0%, #43a047 50%, #66bb6a 100%)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>

              <div>
                <h1 className="text-white font-semibold tracking-wide">
                  Sistema de Cadastro de Produtor Rural
                </h1>
                <p className="text-white/90 mt-0.5">
                  Gestão Agrícola e Emissão de Documentos
                </p>
              </div>
            </div>

            <div className="relative hidden sm:block" ref={menuRef}>
              <button
                onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all shadow-lg"
              >
                <div className="bg-white/20 p-1.5 rounded-full">
                  <UserIcon className="w-5 h-5" />
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium flex items-center justify-end gap-2">
                    {usuarioLogado?.nome}
                    {isAdm && <Shield className="w-4 h-4 text-amber-300" />}
                  </p>

                  <p className="text-xs text-white/80">
                    {usuarioLogado?.email}
                  </p>

                  <p className="text-xs text-white/80 uppercase">
                    {isAdm ? "Administrador" : "Técnico"}
                  </p>
                </div>

                <ChevronDown className="w-4 h-4" />
              </button>

              {menuPerfilAberto && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <button
                    onClick={() => {
                      setModalMeuPerfil(true);
                      setMenuPerfilAberto(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all"
                  >
                    <div className="bg-blue-100 p-1.5 rounded-lg">
                      <Settings className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Meu Perfil</span>
                  </button>

                  {isAdm && (
                    <button
                      onClick={() => {
                        setModalNovoUsuario(true);
                        setMenuPerfilAberto(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all"
                    >
                      <div className="bg-purple-100 p-1.5 rounded-lg">
                        <UserPlus className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Novo Usuário</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all"
                  >
                    <div className="bg-red-100 p-1.5 rounded-lg">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="sm:hidden bg-white border-b border-gray-300 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-green-700" />

            <div>
              <p className="text-sm font-medium text-green-700 flex items-center gap-2">
                {usuarioLogado?.nome}
                {isAdm && <Shield className="w-4 h-4 text-green-700" />}
              </p>

              <p className="text-xs text-green-600">
                {usuarioLogado?.email}
              </p>

              <p className="text-xs text-green-600 uppercase">
                {isAdm ? "Administrador" : "Técnico"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMenuPerfilAberto(!menuPerfilAberto)}
            className="px-3 py-2 rounded-lg border border-green-600 bg-green-600 text-white hover:bg-green-700 transition-all"
          >
            Perfil
          </button>
        </div>

        {menuPerfilAberto && (
          <div className="mt-3 space-y-2">
            <button
              onClick={() => {
                setModalMeuPerfil(true);
                setMenuPerfilAberto(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg border border-gray-300 bg-white text-black hover:bg-gray-50 transition-all"
            >
              Meu Perfil
            </button>

            {isAdm && (
              <button
                onClick={() => {
                  setModalNovoUsuario(true);
                  setMenuPerfilAberto(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg border border-gray-300 bg-white text-black hover:bg-gray-50 transition-all"
              >
                Novo Usuário
              </button>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg border border-red-300 bg-white text-red-600 hover:bg-red-50 transition-all"
            >
              Sair
            </button>
          </div>
        )}
      </div>

      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {isAdm && (
              <button
                onClick={() => setActiveTab("painel")}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "painel"
                    ? "border-purple-500 text-purple-700 bg-purple-50"
                    : "border-transparent text-muted-foreground hover:text-purple-600 hover:bg-purple-50/50"
                }`}
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">
                  Painel Administrativo
                </span>
                <span className="sm:hidden">Painel</span>
              </button>
            )}

            {isAdm && (
              <button
                onClick={() => setActiveTab("relatorio")}
                className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === "relatorio"
                    ? "border-blue-500 text-blue-700 bg-blue-50"
                    : "border-transparent text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50"
                }`}
              >
                <FileBarChart className="w-5 h-5" />
                <span className="hidden sm:inline">
                  Relatório Geral
                </span>
                <span className="sm:hidden">Relatório</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab("atendimento")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "atendimento"
                  ? "border-teal-500 text-teal-700 bg-teal-50"
                  : "border-transparent text-muted-foreground hover:text-teal-600 hover:bg-teal-50/50"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Atendimento</span>
              <span className="sm:hidden">Atend.</span>
            </button>

            <button
              onClick={() => setActiveTab("cadastro")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "cadastro"
                  ? "border-primary text-primary bg-green-50"
                  : "border-transparent text-muted-foreground hover:text-primary hover:bg-green-50/50"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span className="hidden sm:inline">
                Cadastro de Produtor
              </span>
              <span className="sm:hidden">Cadastro</span>
            </button>

            <button
              onClick={() => setActiveTab("historico")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "historico"
                  ? "border-amber-500 text-amber-700 bg-amber-50"
                  : "border-transparent text-muted-foreground hover:text-amber-600 hover:bg-amber-50/50"
              }`}
            >
              <History className="w-5 h-5" />
              <span className="hidden sm:inline">Histórico</span>
              <span className="sm:hidden">Hist.</span>
            </button>

            <button
              onClick={() => setActiveTab("trimestre")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "trimestre"
                  ? "border-purple-500 text-purple-700 bg-purple-50"
                  : "border-transparent text-muted-foreground hover:text-purple-600 hover:bg-purple-50/50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">Histórico por Trimestre</span>
              <span className="sm:hidden">Trimestre</span>
            </button>

            <button
              onClick={() => setActiveTab("recomendacoes")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "recomendacoes"
                  ? "border-indigo-500 text-indigo-700 bg-indigo-50"
                  : "border-transparent text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50/50"
              }`}
            >
              <ClipboardPenLine className="w-5 h-5" />
              <span className="hidden sm:inline">
                Recomendações Técnicas
              </span>
              <span className="sm:hidden">Recomendações</span>
            </button>

            <button
              onClick={() => setActiveTab("emissao")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "emissao"
                  ? "border-orange-500 text-orange-700 bg-orange-50"
                  : "border-transparent text-muted-foreground hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">
                Emissão de Documentos
              </span>
              <span className="sm:hidden">Documentos</span>
            </button>

            <button
              onClick={() => setActiveTab("cronograma")}
              className={`flex items-center gap-2 px-4 sm:px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === "cronograma"
                  ? "border-pink-500 text-pink-700 bg-pink-50"
                  : "border-transparent text-muted-foreground hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden sm:inline">
                Cronograma de Visitas
              </span>
              <span className="sm:hidden">Cronograma</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdm && activeTab === "painel" && <PainelAdmin />}

        {isAdm && activeTab === "relatorio" && (
          <RelatorioGeralProdutor />
        )}

        {podeUsarSistema && activeTab === "atendimento" && <Atendimento />}

        {podeUsarSistema && activeTab === "cadastro" && <CadastroProdutor />}

        {podeUsarSistema && activeTab === "historico" && (
          <HistoricoTecnico usuarioLogado={usuarioLogado} />
        )}

        {podeUsarSistema && activeTab === "trimestre" && <HistoricoTrimestre />}

        {isAdm && activeTab === "comunidades" && <GerenciadorComunidades />}

        {podeUsarSistema && activeTab === "emissao" && <EmissaoDocumento />}

        {podeUsarSistema && activeTab === "cronograma" && <CronogramaSemanalMelhorado />}

        {podeUsarSistema && activeTab === "recomendacoes" && (
          <RecomendacoesTecnicas />
        )}
      </div>

      {modalNovoUsuario && isAdm && (
        <CadastroUsuario
          onClose={() => setModalNovoUsuario(false)}
          onSalvar={atualizarUsuarioLogado}
          permitirEscolherTipo={true}
        />
      )}

      {modalMeuPerfil && usuarioLogado && (
        <CadastroUsuario
          onClose={() => {
            setModalMeuPerfil(false);
            atualizarUsuarioLogado();
          }}
          onSalvar={atualizarUsuarioLogado}
          usuarioEdicao={usuarioLogado}
          permitirEscolherTipo={isAdm}
        />
      )}
    </div>
  );
}