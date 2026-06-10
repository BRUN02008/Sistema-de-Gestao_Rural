import React, { useState, useMemo, useRef } from "react";
import {
  Calendar,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Search,
  MapPin,
  User,
} from "lucide-react";

interface Atividade {
  id: string;
  produtorId?: string;
  produtorNome?: string;
  produtorEndereco?: string;
  produtorComunidade?: string;
  produtorCadastrado: boolean;
  tecnico: string;
  tecnicoId?: string;
  diaSemana: string;
  data: string;
  turno: "manha" | "tarde" | "ambos";
  horarioSaidaManha?: string;
  horarioEntradaManha?: string;
  horarioSaidaTarde?: string;
  horarioEntradaTarde?: string;
  tipoAtividade: "ATE" | "Curso" | "Interno" | "Reunião" | "Visita" | "Outro";
  descricaoAtividade: string;
  observacoes: string;
  status: "pendente" | "realizado" | "adiado" | "cancelado";
  justificativa?: string;
  anexos?: {
    pdfs: { nome: string; base64: string }[];
    fotos: { nome: string; base64: string }[];
  };
  cor: string;
  semana: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  logradouro?: string;
  bairro?: string;
  municipio?: string;
  comunidade?: string;
}

const DIAS_SEMANA = [
  { key: "segunda", label: "Segunda-feira", sigla: "SEG" },
  { key: "terca", label: "Terça-feira", sigla: "TER" },
  { key: "quarta", label: "Quarta-feira", sigla: "QUA" },
  { key: "quinta", label: "Quinta-feira", sigla: "QUI" },
  { key: "sexta", label: "Sexta-feira", sigla: "SEX" },
  { key: "sabado", label: "Sábado", sigla: "SÁB" },
  { key: "domingo", label: "Domingo", sigla: "DOM" },
];

const TIPOS_ATIVIDADE = [
  { value: "ATE", label: "ATE - Assistência Técnica" },
  { value: "Curso", label: "Curso/Capacitação" },
  { value: "Interno", label: "Atividade Interna" },
  { value: "Reunião", label: "Reunião" },
  { value: "Visita", label: "Visita Técnica" },
  { value: "Outro", label: "Outro" },
];

const CORES = [
  "#2d6a3e",
  "#4a90e2",
  "#e27a4a",
  "#9b59b6",
  "#e74c3c",
  "#16a085",
  "#f39c12",
];

const COR_CLASSES: Record<string, string> = {
  "#2d6a3e": "bg-emerald-900",
  "#4a90e2": "bg-blue-600",
  "#e27a4a": "bg-orange-500",
  "#9b59b6": "bg-violet-600",
  "#e74c3c": "bg-red-600",
  "#16a085": "bg-teal-700",
  "#f39c12": "bg-amber-500",
};

function getAtividadeBgClass(cor: string) {
  return COR_CLASSES[cor] ?? "bg-slate-700";
}

const FORM_INICIAL = {
  produtorId: "",
  produtorNome: "",
  produtorEndereco: "",
  produtorComunidade: "",
  produtorCadastrado: true,
  diaSemana: "segunda",
  data: "",
  turno: "manha" as "manha" | "tarde" | "ambos",
  horarioSaidaManha: "08:00",
  horarioEntradaManha: "12:00",
  horarioSaidaTarde: "14:00",
  horarioEntradaTarde: "18:00",
  tipoAtividade: "ATE" as "ATE" | "Curso" | "Interno" | "Reunião" | "Visita" | "Outro",
  descricaoAtividade: "",
  observacoes: "",
  status: "pendente" as "pendente" | "realizado" | "adiado" | "cancelado",
  justificativa: "",
};

type FormData = typeof FORM_INICIAL;

export default function CronogramaSemanalMelhorado() {
  const [atividades, setAtividades] = useState<Atividade[]>(() => {
    const atividadesStorage = localStorage.getItem("cronogramas");
    return atividadesStorage ? JSON.parse(atividadesStorage) : [];
  });

  const [produtores] = useState<Produtor[]>(() => {
    const produtoresStorage = localStorage.getItem("produtores");
    return produtoresStorage ? JSON.parse(produtoresStorage) : [];
  });

  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [atividadeEditando, setAtividadeEditando] = useState<Atividade | null>(null);
  const [buscaProdutor, setBuscaProdutor] = useState("");
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>(FORM_INICIAL);

  const produtoresFiltrados = useMemo(() => {
    if (!buscaProdutor) return [];

    return produtores
      .filter(
        (p) =>
          p.nome.toLowerCase().includes(buscaProdutor.toLowerCase()) ||
          p.cpf.includes(buscaProdutor)
      )
      .slice(0, 5);
  }, [buscaProdutor, produtores]);

  const getSegundaDaSemana = (data: Date) => {
    const dia = data.getDay();
    const diff = dia === 0 ? -6 : 1 - dia;
    const segunda = new Date(data);
    segunda.setDate(data.getDate() + diff);
    segunda.setHours(0, 0, 0, 0);
    return segunda;
  };

  const getDiaComData = (diaSemana: string, segunda: Date) => {
    const indice = DIAS_SEMANA.findIndex((d) => d.key === diaSemana);
    const data = new Date(segunda);
    data.setDate(segunda.getDate() + indice);
    return data;
  };

  const formatarData = (data: Date) => {
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatarSemana = (data: Date) => {
    const segunda = getSegundaDaSemana(data);
    const domingo = new Date(segunda);
    domingo.setDate(segunda.getDate() + 6);
    return `${segunda.getDate().toString().padStart(2, "0")}/${(segunda.getMonth() + 1)
      .toString()
      .padStart(2, "0")} a ${domingo.getDate().toString().padStart(2, "0")}/${(
      domingo.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${domingo.getFullYear()}`;
  };

  const proximaSemana = () => {
    const nova = new Date(semanaAtual);
    nova.setDate(nova.getDate() + 7);
    setSemanaAtual(nova);
  };

  const semanaAnterior = () => {
    const nova = new Date(semanaAtual);
    nova.setDate(nova.getDate() - 7);
    setSemanaAtual(nova);
  };

  const selecionarProdutor = (produtor: Produtor) => {
    setBuscaProdutor(produtor.nome);
    setFormData((prev) => ({
      ...prev,
      produtorId: produtor.id,
      produtorNome: produtor.nome,
      produtorEndereco: `${produtor.logradouro || ""}, ${produtor.bairro || ""}, ${
        produtor.municipio || ""
      }`.trim(),
      produtorComunidade: produtor.comunidade || "",
      produtorCadastrado: true,
    }));
    setMostrarSugestoes(false);
  };

  const permitirNaoCadastrado = () => {
    setFormData((prev) => ({
      ...prev,
      produtorId: "",
      produtorNome: buscaProdutor,
      produtorEndereco: "",
      produtorComunidade: "",
      produtorCadastrado: false,
    }));
    setMostrarSugestoes(false);
  };

  // ✅ CORREÇÃO: resetar apenas os campos, sem fechar o formulário
  const resetarCampos = () => {
    setFormData(FORM_INICIAL);
    setBuscaProdutor("");
    setAtividadeEditando(null);
  };

  const abrirFormularioNovaVisita = () => {
    resetarCampos();
    setMostrarFormulario(true);
  };

  // ✅ CORREÇÃO: fechar o formulário separado do reset
  const fecharFormulario = () => {
    resetarCampos();
    setMostrarFormulario(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.status !== "pendente" &&
      !formData.justificativa &&
      formData.status !== "realizado"
    ) {
      alert(
        "Por favor, informe a justificativa para atividades adiadas ou canceladas."
      );
      return;
    }

    const usuarioLogado = JSON.parse(
      localStorage.getItem("usuarioLogado") || "null"
    );
    const segunda = getSegundaDaSemana(semanaAtual);
    const dataAtividade = getDiaComData(formData.diaSemana, segunda);

    const novaAtividade: Atividade = {
      id: atividadeEditando ? atividadeEditando.id : Date.now().toString(),
      produtorId: formData.produtorId,
      produtorNome: formData.produtorNome,
      produtorEndereco: formData.produtorEndereco,
      produtorComunidade: formData.produtorComunidade,
      produtorCadastrado: formData.produtorCadastrado,
      tecnico: usuarioLogado?.nome || "",
      tecnicoId: usuarioLogado?.id || "",
      diaSemana: formData.diaSemana,
      data: dataAtividade.toISOString(),
      turno: formData.turno,
      horarioSaidaManha: formData.horarioSaidaManha,
      horarioEntradaManha: formData.horarioEntradaManha,
      horarioSaidaTarde: formData.horarioSaidaTarde,
      horarioEntradaTarde: formData.horarioEntradaTarde,
      tipoAtividade: formData.tipoAtividade,
      descricaoAtividade: formData.descricaoAtividade,
      observacoes: formData.observacoes,
      status: formData.status,
      justificativa: formData.justificativa,
      anexos: atividadeEditando?.anexos,
      cor:
        atividadeEditando?.cor ||
        CORES[Math.floor(Math.random() * CORES.length)],
      semana: segunda.toISOString(),
      dataCriacao: atividadeEditando?.dataCriacao || new Date().toISOString(),
      dataAtualizacao: atividadeEditando
        ? new Date().toISOString()
        : undefined,
    };

    let novasAtividades: Atividade[];
    if (atividadeEditando) {
      novasAtividades = atividades.map((a) =>
        a.id === atividadeEditando.id ? novaAtividade : a
      );
    } else {
      novasAtividades = [...atividades, novaAtividade];
    }

    setAtividades(novasAtividades);
    localStorage.setItem("cronogramas", JSON.stringify(novasAtividades));
    localStorage.setItem("visitas", JSON.stringify(novasAtividades));

    fecharFormulario();
  };

  const handleEditar = (atividade: Atividade) => {
    setAtividadeEditando(atividade);
    setFormData({
      produtorId: atividade.produtorId || "",
      produtorNome: atividade.produtorNome || "",
      produtorEndereco: atividade.produtorEndereco || "",
      produtorComunidade: atividade.produtorComunidade || "",
      produtorCadastrado: atividade.produtorCadastrado,
      diaSemana: atividade.diaSemana,
      data: atividade.data,
      turno: atividade.turno,
      horarioSaidaManha: atividade.horarioSaidaManha || "08:00",
      horarioEntradaManha: atividade.horarioEntradaManha || "12:00",
      horarioSaidaTarde: atividade.horarioSaidaTarde || "14:00",
      horarioEntradaTarde: atividade.horarioEntradaTarde || "18:00",
      tipoAtividade: atividade.tipoAtividade,
      descricaoAtividade: atividade.descricaoAtividade,
      observacoes: atividade.observacoes,
      status: atividade.status,
      justificativa: atividade.justificativa || "",
    });
    setBuscaProdutor(atividade.produtorNome || "");
    setMostrarFormulario(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm("Deseja realmente excluir esta atividade?")) {
      const novasAtividades = atividades.filter((a) => a.id !== id);
      setAtividades(novasAtividades);
      localStorage.setItem("cronogramas", JSON.stringify(novasAtividades));
      localStorage.setItem("visitas", JSON.stringify(novasAtividades));
    }
  };

  const getAtividadesDoDia = (dia: string, periodo: "manha" | "tarde") => {
    const semanaISO = getSegundaDaSemana(semanaAtual).toISOString();
    return atividades.filter(
      (a) =>
        a.diaSemana === dia &&
        a.semana === semanaISO &&
        (a.turno === periodo || a.turno === "ambos")
    );
  };

  const getIconeStatus = (status: string) => {
    switch (status) {
      case "realizado":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "adiado":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "cancelado":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const segunda = getSegundaDaSemana(semanaAtual);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-linear-to-r from-pink-600 to-pink-700 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Cronograma Semanal</h2>
              <p className="text-pink-100 mt-1">
                Organize suas atividades semanais de forma rápida e eficiente
              </p>
            </div>
          </div>

          <div className="no-print flex flex-wrap gap-3">
            <button
              type="button"
              onClick={abrirFormularioNovaVisita}
              className="rounded-lg bg-white text-pink-700 px-4 py-2 font-semibold shadow hover:bg-pink-50 transition-all"
            >
              Adicionar nova visita
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700 transition-all"
            >
              Imprimir Cronograma
            </button>
          </div>
        </div>
      </div>

      {/* NAVEGAÇÃO DE SEMANA */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <button
            onClick={semanaAnterior}
            className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:bg-accent transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Semana Anterior
          </button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">Semana de</p>
            <p className="text-xl font-bold text-pink-700">
              {formatarSemana(semanaAtual)}
            </p>
          </div>

          <button
            onClick={proximaSemana}
            className="flex items-center gap-2 px-4 py-2 border-2 border-border rounded-lg hover:bg-accent transition-all"
          >
            Próxima Semana
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* FORMULÁRIO */}
      {mostrarFormulario && (
        <div className="bg-card rounded-xl border-2 border-pink-500/20 p-6 shadow-lg">
          <h3 className="text-lg font-bold text-foreground mb-6">
            {atividadeEditando ? "Editar Atividade" : "Nova Atividade"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PRODUTOR - AUTOCOMPLETE */}
            <div className="relative">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Produtor <span className="text-muted-foreground text-sm">(Opcional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={buscaProdutor}
                  onChange={(e) => {
                    setBuscaProdutor(e.target.value);
                    setMostrarSugestoes(e.target.value.trim().length > 0);
                    if (e.target.value && !formData.produtorCadastrado) {
                      setFormData((prev) => ({
                        ...prev,
                        produtorNome: e.target.value,
                      }));
                    }
                  }}
                  placeholder="Digite o nome ou CPF do produtor..."
                  className="w-full px-4 py-3 pl-10 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3.5" />
              </div>

              {/* SUGESTÕES */}
              {mostrarSugestoes && produtoresFiltrados.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-card border-2 border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {produtoresFiltrados.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selecionarProdutor(p)}
                      className="w-full text-left px-4 py-3 hover:bg-accent transition-all border-b border-border last:border-0"
                    >
                      <p className="font-semibold text-foreground">{p.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        CPF: {p.cpf}
                      </p>
                      {p.comunidade && (
                        <p className="text-xs text-pink-600 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {p.comunidade}
                        </p>
                      )}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={permitirNaoCadastrado}
                    className="w-full text-left px-4 py-3 bg-yellow-50 hover:bg-yellow-100 text-yellow-800 font-semibold transition-all"
                  >
                    + Usar "{buscaProdutor}" (Não Cadastrado)
                  </button>
                </div>
              )}

              {/* DADOS PREENCHIDOS */}
              {formData.produtorNome && (
                <div className="mt-3 p-4 bg-pink-50 border border-pink-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <User className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-pink-900">
                        {formData.produtorNome}
                        {!formData.produtorCadastrado && (
                          <span className="ml-2 text-xs bg-yellow-600 text-white px-2 py-0.5 rounded">
                            Não cadastrado
                          </span>
                        )}
                      </p>
                      {formData.produtorEndereco && (
                        <p className="text-sm text-pink-700 mt-1">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {formData.produtorEndereco}
                        </p>
                      )}
                      {formData.produtorComunidade && (
                        <p className="text-sm text-pink-700">
                          Comunidade: {formData.produtorComunidade}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DIA E TIPO DE ATIVIDADE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dia-semana" className="block text-sm font-semibold text-foreground mb-2">
                  Dia da Semana <span className="text-red-500">*</span>
                </label>
                <select
                  id="dia-semana"
                  required
                  value={formData.diaSemana}
                  onChange={(e) =>
                    setFormData({ ...formData, diaSemana: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {DIAS_SEMANA.map((dia) => {
                    const dataCompleta = getDiaComData(dia.key, segunda);
                    return (
                      <option key={dia.key} value={dia.key}>
                        {dia.label} - {formatarData(dataCompleta)}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label htmlFor="tipo-atividade" className="block text-sm font-semibold text-foreground mb-2">
                  Tipo de Atividade <span className="text-red-500">*</span>
                </label>
                <select
                  id="tipo-atividade"
                  required
                  value={formData.tipoAtividade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoAtividade: e.target.value as Atividade["tipoAtividade"],
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {TIPOS_ATIVIDADE.map((tipo) => (
                    <option key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TURNO */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Turno <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "manha", label: "Manhã", icon: "🌅" },
                  { value: "tarde", label: "Tarde", icon: "☀️" },
                  { value: "ambos", label: "Ambos", icon: "🌞" },
                ].map((turno) => (
                  <button
                    key={turno.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        turno: turno.value as "manha" | "tarde" | "ambos",
                      })
                    }
                    className={`p-4 rounded-lg border-2 transition-all font-semibold ${
                      formData.turno === turno.value
                        ? "border-pink-500 bg-pink-50 text-pink-700 shadow-md"
                        : "border-border hover:border-pink-300 hover:bg-pink-50/50"
                    }`}
                  >
                    <div className="text-2xl mb-1">{turno.icon}</div>
                    {turno.label}
                  </button>
                ))}
              </div>
            </div>

            {/* HORÁRIOS MANHÃ */}
            {(formData.turno === "manha" || formData.turno === "ambos") && (
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-3">
                  Horários - Manhã
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="saida-manha" className="block text-xs text-blue-800 mb-1">
                      Saída
                    </label>
                    <input
                      id="saida-manha"
                      type="time"
                      value={formData.horarioSaidaManha}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horarioSaidaManha: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-blue-300 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="entrada-manha" className="block text-xs text-blue-800 mb-1">
                      Entrada
                    </label>
                    <input
                      id="entrada-manha"
                      type="time"
                      value={formData.horarioEntradaManha}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horarioEntradaManha: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-blue-300 bg-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  Ex: das {formData.horarioSaidaManha} às{" "}
                  {formData.horarioEntradaManha} horas
                </p>
              </div>
            )}

            {/* HORÁRIOS TARDE */}
            {(formData.turno === "tarde" || formData.turno === "ambos") && (
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                <p className="text-sm font-semibold text-orange-900 mb-3">
                  Horários - Tarde
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="saida-tarde" className="block text-xs text-orange-800 mb-1">
                      Saída
                    </label>
                    <input
                      id="saida-tarde"
                      type="time"
                      value={formData.horarioSaidaTarde}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horarioSaidaTarde: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-orange-300 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="entrada-tarde" className="block text-xs text-orange-800 mb-1">
                      Entrada
                    </label>
                    <input
                      id="entrada-tarde"
                      type="time"
                      value={formData.horarioEntradaTarde}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horarioEntradaTarde: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded border border-orange-300 bg-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-orange-700 mt-2">
                  Ex: das {formData.horarioSaidaTarde} às{" "}
                  {formData.horarioEntradaTarde} horas
                </p>
              </div>
            )}

            {/* DESCRIÇÃO */}
            <div>
              <label htmlFor="descricao-atividade" className="block text-sm font-semibold text-foreground mb-2">
                Descrição da Atividade <span className="text-red-500">*</span>
              </label>
              <input
                id="descricao-atividade"
                type="text"
                required
                value={formData.descricaoAtividade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    descricaoAtividade: e.target.value,
                  })
                }
                placeholder="Ex: Orientação sobre manejo de pastagem"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
                Status da Atividade
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: "pendente", label: "Pendente", color: "gray" },
                  { value: "realizado", label: "Realizado", color: "green" },
                  { value: "adiado", label: "Adiado", color: "yellow" },
                  { value: "cancelado", label: "Cancelado", color: "red" },
                ].map((status) => (
                  <button
                    key={status.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: status.value as "pendente" | "realizado" | "adiado" | "cancelado",
                      })
                    }
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      formData.status === status.value
                        ? `border-${status.color}-500 bg-${status.color}-50 text-${status.color}-700`
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* JUSTIFICATIVA */}
            {(formData.status === "adiado" ||
              formData.status === "cancelado") && (
              <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-yellow-900 mb-2">
                  Justificativa <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="justificativa-atividade"
                  required
                  value={formData.justificativa}
                  onChange={(e) =>
                    setFormData({ ...formData, justificativa: e.target.value })
                  }
                  rows={3}
                  placeholder="Informe o motivo do adiamento ou cancelamento..."
                  className="w-full px-4 py-3 rounded-lg border border-yellow-400 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                />
              </div>
            )}

            {/* OBSERVAÇÕES */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Observações
              </label>
              <textarea
                id="observacoes-atividade"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                rows={3}
                placeholder="Informações adicionais..."
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              />
            </div>

            {/* BOTÕES */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-linear-to-r from-pink-600 to-pink-700 text-white rounded-lg hover:from-pink-700 hover:to-pink-800 transition-all shadow-lg font-semibold"
              >
                {atividadeEditando ? "Atualizar" : "Salvar"} Atividade
              </button>
              <button
                type="button"
                onClick={fecharFormulario}
                className="px-6 py-3 border-2 border-border rounded-lg hover:bg-accent transition-all font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CRONOGRAMA VISUAL */}
      <div
        ref={componentRef}
        className="bg-white rounded-xl border border-border overflow-hidden shadow-sm cronograma-semanal-print"
      >
        <div className="bg-linear-to-r from-pink-600 to-pink-700 text-white p-4">
          <h3 className="text-center font-bold text-lg">
            CRONOGRAMA SEMANAL - {formatarSemana(semanaAtual)}
          </h3>
        </div>

        {atividades.filter((a) => a.semana === segunda.toISOString()).length ===
        0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg font-semibold text-muted-foreground mb-2">
              Não há visitas agendadas
            </p>
            <p className="text-sm text-muted-foreground">
              Clique em "Nova Atividade" para agendar uma visita nesta semana
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left text-sm font-semibold w-20">
                    Período
                  </th>
                  {DIAS_SEMANA.map((dia) => {
                    const dataCompleta = getDiaComData(dia.key, segunda);
                    return (
                      <th
                        key={dia.key}
                        className="border border-gray-300 p-2 text-center text-sm font-semibold"
                      >
                        <div>{dia.sigla}</div>
                        <div className="text-xs text-pink-600 font-bold">
                          {formatarData(dataCompleta)}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* MANHÃ */}
                <tr>
                  <td className="border border-gray-300 p-2 bg-blue-50 font-semibold text-sm align-top">
                    Manhã
                  </td>
                  {DIAS_SEMANA.map((dia) => (
                    <td
                      key={dia.key}
                      className="border border-gray-300 p-2 align-top min-w-[150px]"
                    >
                      <div className="space-y-2">
                        {getAtividadesDoDia(dia.key, "manha").map(
                          (atividade) => (
                            <div
                              key={atividade.id}
                              className={`p-2 rounded text-white text-xs group relative ${getAtividadeBgClass(atividade.cor)}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-xs bg-white/20 px-2 py-0.5 rounded">
                                  {atividade.tipoAtividade}
                                </span>
                                {getIconeStatus(atividade.status)}
                              </div>
                              <div className="font-semibold text-sm">
                                {atividade.horarioSaidaManha} -{" "}
                                {atividade.horarioEntradaManha}
                              </div>
                              <div className="mt-1">
                                {atividade.produtorNome || "Sem produtor"}
                              </div>
                              <div className="opacity-90">
                                {atividade.descricaoAtividade}
                              </div>
                              <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                                <button
                                  type="button"
                                  aria-label="Editar atividade de manhã"
                                  onClick={() => handleEditar(atividade)}
                                  className="bg-white/20 hover:bg-white/40 p-1 rounded"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Excluir atividade de manhã"
                                  onClick={() => handleExcluir(atividade.id)}
                                  className="bg-white/20 hover:bg-white/40 p-1 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* TARDE */}
                <tr>
                  <td className="border border-gray-300 p-2 bg-orange-50 font-semibold text-sm align-top">
                    Tarde
                  </td>
                  {DIAS_SEMANA.map((dia) => (
                    <td
                      key={dia.key}
                      className="border border-gray-300 p-2 align-top min-w-[150px]"
                    >
                      <div className="space-y-2">
                        {getAtividadesDoDia(dia.key, "tarde").map(
                          (atividade) => (
                            <div
                              key={atividade.id}
                              className={`p-2 rounded text-white text-xs group relative ${getAtividadeBgClass(atividade.cor)}`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-xs bg-white/20 px-2 py-0.5 rounded">
                                  {atividade.tipoAtividade}
                                </span>
                                {getIconeStatus(atividade.status)}
                              </div>
                              <div className="font-semibold text-sm">
                                {atividade.horarioSaidaTarde} -{" "}
                                {atividade.horarioEntradaTarde}
                              </div>
                              <div className="mt-1">
                                {atividade.produtorNome || "Sem produtor"}
                              </div>
                              <div className="opacity-90">
                                {atividade.descricaoAtividade}
                              </div>
                              <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                                <button
                                  type="button"
                                  aria-label="Editar atividade da tarde"
                                  onClick={() => handleEditar(atividade)}
                                  className="bg-white/20 hover:bg-white/40 p-1 rounded"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Excluir atividade da tarde"
                                  onClick={() => handleExcluir(atividade.id)}
                                  className="bg-white/20 hover:bg-white/40 p-1 rounded"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ESTATÍSTICAS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          {
            label: "Total",
            color: "pink",
            count: atividades.filter((a) => a.semana === segunda.toISOString()).length,
          },
          {
            label: "Manhã",
            color: "blue",
            count: atividades.filter(
              (a) => a.semana === segunda.toISOString() && a.turno === "manha"
            ).length,
          },
          {
            label: "Tarde",
            color: "orange",
            count: atividades.filter(
              (a) => a.semana === segunda.toISOString() && a.turno === "tarde"
            ).length,
          },
          {
            label: "Realizadas",
            color: "green",
            count: atividades.filter(
              (a) =>
                a.semana === segunda.toISOString() && a.status === "realizado"
            ).length,
          },
          {
            label: "Pendentes",
            color: "gray",
            count: atividades.filter(
              (a) =>
                a.semana === segunda.toISOString() && a.status === "pendente"
            ).length,
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg border border-border p-4">
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className={`text-2xl font-bold text-${stat.color}-600`}>
              {stat.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}