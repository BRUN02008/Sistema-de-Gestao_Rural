import { useState, useRef } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  Printer,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface Visita {
  id: string;
  produtorId?: string;
  produtorNome?: string;
  tecnico: string;
  tecnicoId?: string;
  criadoPorId?: string;
  criadoPorNome?: string;
  criadoPorEmail?: string;
  diaSemana: string;
  turno: "manha" | "tarde" | "ambos";
  horarioSaidaManha?: string;
  horarioEntradaManha?: string;
  horarioSaidaTarde?: string;
  horarioEntradaTarde?: string;
  // Campos antigos mantidos para compatibilidade
  periodo?: "manha" | "tarde";
  horario?: string;
  atividade: string;
  observacoes: string;
  recomendacoes: string;
  cor: string;
  semana: string;
  dataCriacao?: string;
  dataAtualizacao?: string;
}

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  comunidade?: string;
  [key: string]: unknown;
}

interface Usuario {
  id: string;
  nome: string;
  email?: string;
  tipo?: string;
  [key: string]: unknown;
}

const DIAS_SEMANA = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca", label: "Terça-feira" },
  { key: "quarta", label: "Quarta-feira" },
  { key: "quinta", label: "Quinta-feira" },
  { key: "sexta", label: "Sexta-feira" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
];

const CORES = [
  "#2d6a3e",
  "#4a90e2",
  "#e27a4a",
  "#9b59b6",
  "#e74c3c",
  "#16a085",
  "#f39c12",
  "#8e44ad",
  "#27ae60",
  "#d35400",
];

const getCorVisitaClass = (cor: string) => {
  switch (cor) {
    case "#2d6a3e":
      return "bg-emerald-700";
    case "#4a90e2":
      return "bg-sky-600";
    case "#e27a4a":
      return "bg-orange-500";
    case "#9b59b6":
      return "bg-violet-600";
    case "#e74c3c":
      return "bg-red-600";
    case "#16a085":
      return "bg-teal-600";
    case "#f39c12":
      return "bg-amber-500";
    case "#8e44ad":
      return "bg-fuchsia-600";
    case "#27ae60":
      return "bg-emerald-600";
    case "#d35400":
      return "bg-orange-600";
    default:
      return "bg-slate-600";
  }
};

export default function CronogramaVisitas() {
  const [visitas, setVisitas] = useState<Visita[]>(() => {
    const visitasStorage =
      localStorage.getItem("cronogramas") ||
      localStorage.getItem("visitas");
    return visitasStorage ? JSON.parse(visitasStorage) : [];
  });

  const [produtores] = useState<Produtor[]>(() => {
    const produtoresStorage = localStorage.getItem("produtores");
    return produtoresStorage ? JSON.parse(produtoresStorage) : [];
  });

  const [usuarios] = useState<Usuario[]>(() => {
    const usuariosStorage = localStorage.getItem("usuarios");
    return usuariosStorage ? JSON.parse(usuariosStorage) : [];
  });

  const [semanaAtual, setSemanaAtual] = useState(new Date());
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false);
  const [visitaEditando, setVisitaEditando] =
    useState<Visita | null>(null);
  const componentRef = useRef<HTMLDivElement>(null);
  const tecnicos = usuarios.filter(
    (u) => u.tipo === "tecnico" || u.tipo === "adm",
  );
  // Form state
  const [formData, setFormData] = useState({
    produtorId: "",
    tecnico: "",
    diaSemana: "segunda",
    turno: "manha" as "manha" | "tarde" | "ambos",
    horarioSaidaManha: "",
    horarioEntradaManha: "",
    horarioSaidaTarde: "",
    horarioEntradaTarde: "",
    atividade: "",
    observacoes: "",
    recomendacoes: "",
  });

  const getSegundaDaSemana = (data: Date) => {
    const dia = data.getDay();
    const diff = dia === 0 ? -6 : 1 - dia; // Se domingo, volta 6 dias
    const segunda = new Date(data);
    segunda.setDate(data.getDate() + diff);
    segunda.setHours(0, 0, 0, 0);
    return segunda;
  };

  const formatarSemana = (data: Date) => {
    const segunda = getSegundaDaSemana(data);
    const domingo = new Date(segunda);
    domingo.setDate(segunda.getDate() + 6);

    return `${segunda.getDate().toString().padStart(2, "0")}/${(segunda.getMonth() + 1).toString().padStart(2, "0")} a ${domingo.getDate().toString().padStart(2, "0")}/${(domingo.getMonth() + 1).toString().padStart(2, "0")}/${domingo.getFullYear()}`;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const produtor = formData.produtorId
      ? produtores.find((p) => p.id === formData.produtorId)
      : null;

    const usuarioLogado = JSON.parse(
      localStorage.getItem("usuarioLogado") || "null",
    );

    const tecnicoSelecionado = usuarios.find(
      (u) => u.nome === formData.tecnico,
    );

    const novaVisita: Visita = {
      id: visitaEditando
        ? visitaEditando.id
        : Date.now().toString(),
      produtorId: formData.produtorId || undefined,
      produtorNome: produtor?.nome || undefined,
      tecnico: formData.tecnico,
      tecnicoId: tecnicoSelecionado?.id || "",
      criadoPorId:
        visitaEditando?.criadoPorId || usuarioLogado?.id || "",
      criadoPorNome:
        visitaEditando?.criadoPorNome ||
        usuarioLogado?.nome ||
        "",
      criadoPorEmail:
        visitaEditando?.criadoPorEmail ||
        usuarioLogado?.email ||
        "",
      diaSemana: formData.diaSemana,
      turno: formData.turno,
      horarioSaidaManha: formData.horarioSaidaManha,
      horarioEntradaManha: formData.horarioEntradaManha,
      horarioSaidaTarde: formData.horarioSaidaTarde,
      horarioEntradaTarde: formData.horarioEntradaTarde,
      atividade: formData.atividade,
      observacoes: formData.observacoes,
      recomendacoes: formData.recomendacoes,
      cor: visitaEditando
        ? visitaEditando.cor
        : CORES[Math.floor(Math.random() * CORES.length)],
      semana: getSegundaDaSemana(semanaAtual).toISOString(),
      dataCriacao:
        visitaEditando?.dataCriacao || new Date().toISOString(),
      dataAtualizacao: visitaEditando
        ? new Date().toISOString()
        : undefined,
    };

    let novasVisitas: Visita[];

    if (visitaEditando) {
      novasVisitas = visitas.map((v) =>
        v.id === visitaEditando.id ? novaVisita : v,
      );
    } else {
      novasVisitas = [...visitas, novaVisita];
    }

    setVisitas(novasVisitas);

    // mantém compatibilidade com seu componente atual
    localStorage.setItem(
      "visitas",
      JSON.stringify(novasVisitas),
    );

    // salva também em "cronogramas" para o PainelAdmin
    localStorage.setItem(
      "cronogramas",
      JSON.stringify(novasVisitas),
    );

    setFormData({
      produtorId: "",
      tecnico: "",
      diaSemana: "segunda",
      turno: "manha",
      horarioSaidaManha: "",
      horarioEntradaManha: "",
      horarioSaidaTarde: "",
      horarioEntradaTarde: "",
      atividade: "",
      observacoes: "",
      recomendacoes: "",
    });

    setMostrarFormulario(false);
    setVisitaEditando(null);
  };

  const handleEditar = (visita: Visita) => {
    setVisitaEditando(visita);
    setFormData({
      produtorId: visita.produtorId || "",
      tecnico: visita.tecnico,
      diaSemana: visita.diaSemana,
      turno: visita.turno || visita.periodo || "manha",
      horarioSaidaManha: visita.horarioSaidaManha || "",
      horarioEntradaManha: visita.horarioEntradaManha || "",
      horarioSaidaTarde: visita.horarioSaidaTarde || "",
      horarioEntradaTarde: visita.horarioEntradaTarde || "",
      atividade: visita.atividade,
      observacoes: visita.observacoes,
      recomendacoes: visita.recomendacoes || "",
    });
    setMostrarFormulario(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm("Deseja realmente excluir esta visita?")) {
      const novasVisitas = visitas.filter((v) => v.id !== id);
      setVisitas(novasVisitas);

      localStorage.setItem(
        "visitas",
        JSON.stringify(novasVisitas),
      );

      localStorage.setItem(
        "cronogramas",
        JSON.stringify(novasVisitas),
      );
    }
  };

  const getVisitasDoDia = (
    dia: string,
    periodo: "manha" | "tarde",
  ) => {
    const semanaISO =
      getSegundaDaSemana(semanaAtual).toISOString();
    return visitas.filter(
      (v) =>
        v.diaSemana === dia &&
        v.semana === semanaISO &&
        (v.turno === periodo || v.turno === "ambos" || v.periodo === periodo)
    );
  };

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Cronograma_Semana_${formatarSemana(semanaAtual)}`,
  });

  return (
    <div className="space-y-6">
      {/* Header com Navegação de Semana */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Cronograma de Visitas Técnicas
            </h2>
            <p className="text-muted-foreground mt-1">
              Organize e acompanhe as visitas aos produtores
            </p>
          </div>

          <button
            onClick={() => {
              setMostrarFormulario(true);
              setVisitaEditando(null);
              setFormData({
                produtorId: "",
                tecnico: "",
                diaSemana: "segunda",
                turno: "manha",
                horarioSaidaManha: "",
                horarioEntradaManha: "",
                horarioSaidaTarde: "",
                horarioEntradaTarde: "",
                atividade: "",
                observacoes: "",
                recomendacoes: "",
              });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            Cronograma semanal
          </button>
        </div>

        {/* Navegação de Semana */}
        <div className="flex items-center justify-between mt-6 gap-4">
          <button
            onClick={semanaAnterior}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="text-center">
            <p className="text-foreground">Semana de</p>
            <p className="text-lg text-primary">
              {formatarSemana(semanaAtual)}
            </p>
          </div>

          <button
            onClick={proximaSemana}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all"
          >
            Próxima
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Botão Imprimir */}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white shadow hover:bg-emerald-700"
          >
            Imprimir Cronograma
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Formulário de Nova Visita */}
      {mostrarFormulario && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-foreground mb-4">
            {visitaEditando
              ? "Editar Atividade"
              : "Nova Atividade no Cronograma"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div>
              <label htmlFor="produtor-id" className="block text-foreground mb-2">
                Produtor <span className="text-muted-foreground text-sm">(Opcional)</span>
              </label>
              <select
                id="produtor-id"
                value={formData.produtorId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    produtorId: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione um produtor (opcional)</option>
                {produtores.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tecnico-id" className="block text-foreground mb-2">
                Técnico Responsável <span className="text-destructive">*</span>
              </label>
              <select
                id="tecnico-id"
                required
                value={formData.tecnico}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tecnico: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Selecione um técnico</option>
                {tecnicos.map((u) => (
                  <option key={u.id} value={u.nome}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="dia-semana-id" className="block text-foreground mb-2">
                Dia da Semana <span className="text-destructive">*</span>
              </label>
              <select
                id="dia-semana-id"
                required
                value={formData.diaSemana}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    diaSemana: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {DIAS_SEMANA.map((dia) => (
                  <option key={dia.key} value={dia.key}>
                    {dia.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="turno-id" className="block text-foreground mb-2">
                Turno <span className="text-destructive">*</span>
              </label>
              <select
                id="turno-id"
                required
                value={formData.turno}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    turno: e.target.value as "manha" | "tarde" | "ambos",
                  })
                }
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            {/* Horários Manhã */}
            {(formData.turno === "manha" || formData.turno === "ambos") && (
              <>
                <div>
                  <label htmlFor="horario-saida-manha-id" className="block text-foreground mb-2">
                    Horário Saída (Manhã) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="horario-saida-manha-id"
                    type="time"
                    required
                    placeholder="08:00"
                    value={formData.horarioSaidaManha}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horarioSaidaManha: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ex: das 08:00 às 14:00 horas
                  </p>
                </div>

                <div>
                  <label htmlFor="horario-entrada-manha-id" className="block text-foreground mb-2">
                    Horário Entrada (Manhã) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="horario-entrada-manha-id"
                    type="time"
                    required
                    placeholder="12:00"
                    value={formData.horarioEntradaManha}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horarioEntradaManha: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            {/* Horários Tarde */}
            {(formData.turno === "tarde" || formData.turno === "ambos") && (
              <>
                <div>
                  <label htmlFor="horario-saida-tarde-id" className="block text-foreground mb-2">
                    Horário Saída (Tarde) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="horario-saida-tarde-id"
                    type="time"
                    required
                    placeholder="13:00"
                    value={formData.horarioSaidaTarde}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horarioSaidaTarde: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Ex: das 08:00 às 14:00 horas
                  </p>
                </div>

                <div>
                  <label htmlFor="horario-entrada-tarde-id" className="block text-foreground mb-2">
                    Horário Entrada (Tarde) <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="horario-entrada-tarde-id"
                    type="time"
                    required
                    placeholder="17:00"
                    value={formData.horarioEntradaTarde}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        horarioEntradaTarde: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="atividade-id" className="block text-foreground mb-2">
                Atividade <span className="text-destructive">*</span>
              </label>
              <input
                id="atividade-id"
                type="text"
                required
                value={formData.atividade}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    atividade: e.target.value,
                  })
                }
                placeholder="Ex: Assistência Técnica"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label htmlFor="observacoes-id" className="block text-foreground mb-2">
                Observações
              </label>
              <textarea
                id="observacoes-id"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    observacoes: e.target.value,
                  })
                }
                rows={2}
                placeholder="Informações adicionais sobre a visita..."
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3">
              <label htmlFor="recomendacoes-id" className="block text-foreground mb-2">
                Recomendações
              </label>
              <textarea
                id="recomendacoes-id"
                value={formData.recomendacoes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recomendacoes: e.target.value,
                  })
                }
                rows={2}
                placeholder="Ex: Melhorar manejo, adubação, controle de pragas..."
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
              >
                {visitaEditando ? "Atualizar" : "Agendar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarFormulario(false);
                  setVisitaEditando(null);
                }}
                className="px-6 py-2.5 border border-border rounded-lg hover:bg-accent transition-all"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Calendário Semanal */}
      <div
        ref={componentRef}
        className="bg-white rounded-xl border border-border overflow-hidden shadow-sm cronograma-visitas-print cronograma-semanal-print"
      >
        {/* Header do Calendário */}
        <div className="bg-primary text-primary-foreground p-4 print:p-6">
          <h3 className="text-center">
            CRONOGRAMA SEMANAL DE VISITAS TÉCNICAS
          </h3>
          <p className="text-center text-sm mt-1 opacity-90">
            Semana de {formatarSemana(semanaAtual)}
          </p>
        </div>

        {/* Grid do Calendário */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th
                  className="border border-gray-300 p-2 text-left text-sm font-semibold w-[80px]"
                >
                  Período
                </th>
                {DIAS_SEMANA.map((dia) => (
                  <th
                    key={dia.key}
                    className="border border-gray-300 p-2 text-center text-sm font-semibold"
                  >
                    {dia.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Manhã */}
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-50 font-semibold text-sm align-top">
                  Manhã
                </td>
                {DIAS_SEMANA.map((dia) => (
                  <td
                    key={dia.key}
                    className="border border-gray-300 p-2 align-top min-w-[150px]"
                  >
                    <div className="space-y-2">
                      {getVisitasDoDia(dia.key, "manha").map(
                        (visita) => (
                          <div
                            key={visita.id}
                            className={`p-2 rounded text-white text-xs group relative print:break-inside-avoid ${getCorVisitaClass(visita.cor)}`}
                          >
                            <div className="font-semibold">
                              {visita.horarioSaidaManha && visita.horarioEntradaManha
                                ? `das ${visita.horarioSaidaManha} às ${visita.horarioEntradaManha} horas`
                                : visita.horario || "Horário não definido"}
                            </div>
                            <div className="mt-1">
                              {visita.produtorNome}
                            </div>
                            <div className="opacity-90">
                              {visita.atividade}
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                              Técnico: {visita.tecnico}
                            </div>
                            {visita.observacoes && (
                              <div className="text-xs opacity-75 mt-1 italic">
                                {visita.observacoes}
                              </div>
                            )}

                            {/* Botões de ação (não aparecem na impressão) */}
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 print:hidden">
                              <button
                                type="button"
                                aria-label="Editar visita de manhã"
                                onClick={() =>
                                  handleEditar(visita)
                                }
                                className="bg-white/20 hover:bg-white/40 p-1 rounded"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                aria-label="Excluir visita de manhã"
                                onClick={() =>
                                  handleExcluir(visita.id)
                                }
                                className="bg-white/20 hover:bg-white/40 p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Tarde */}
              <tr>
                <td className="border border-gray-300 p-2 bg-gray-50 font-semibold text-sm align-top">
                  Tarde
                </td>
                {DIAS_SEMANA.map((dia) => (
                  <td
                    key={dia.key}
                    className="border border-gray-300 p-2 align-top min-w-[150px]"
                  >
                    <div className="space-y-2">
                      {getVisitasDoDia(dia.key, "tarde").map(
                        (visita) => (
                          <div
                            key={visita.id}
                            className={`p-2 rounded text-white text-xs group relative print:break-inside-avoid ${getCorVisitaClass(visita.cor)}`}
                          >
                            <div className="font-semibold">
                              {visita.horarioSaidaTarde && visita.horarioEntradaTarde
                                ? `das ${visita.horarioSaidaTarde} às ${visita.horarioEntradaTarde} horas`
                                : visita.horario || "Horário não definido"}
                            </div>
                            <div className="mt-1">
                              {visita.produtorNome}
                            </div>
                            <div className="opacity-90">
                              {visita.atividade}
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                              Técnico: {visita.tecnico}
                            </div>
                            {visita.observacoes && (
                              <div className="text-xs opacity-75 mt-1 italic">
                                {visita.observacoes}
                              </div>
                            )}

                            {/* Botões de ação (não aparecem na impressão) */}
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 print:hidden">
                              <button
                                type="button"
                                aria-label="Editar visita da tarde"
                                onClick={() =>
                                  handleEditar(visita)
                                }
                                className="bg-white/20 hover:bg-white/40 p-1 rounded"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                aria-label="Excluir visita da tarde"
                                onClick={() =>
                                  handleExcluir(visita.id)
                                }
                                className="bg-white/20 hover:bg-white/40 p-1 rounded"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 text-xs text-gray-600 text-center print:block">
          <p>
            Emitido em: {new Date().toLocaleDateString("pt-BR")}{" "}
            - Sistema de Gestão Rural
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-muted-foreground text-sm">
            Total de atividades
          </div>
          <div className="text-2xl text-primary mt-1">
            {
              visitas.filter(
                (v) =>
                  v.semana ===
                  getSegundaDaSemana(semanaAtual).toISOString(),
              ).length
            }
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-muted-foreground text-sm">
            Manhã
          </div>
          <div className="text-2xl text-primary mt-1">
            {
              visitas.filter(
                (v) =>
                  v.semana ===
                  getSegundaDaSemana(semanaAtual).toISOString() &&
                  (v.turno === "manha" || v.periodo === "manha"),
              ).length
            }
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-muted-foreground text-sm">
            Tarde
          </div>
          <div className="text-2xl text-primary mt-1">
            {
              visitas.filter(
                (v) =>
                  v.semana ===
                  getSegundaDaSemana(semanaAtual).toISOString() &&
                  (v.turno === "tarde" || v.periodo === "tarde"),
              ).length
            }
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-muted-foreground text-sm">
            Ambos
          </div>
          <div className="text-2xl text-primary mt-1">
            {
              visitas.filter(
                (v) =>
                  v.semana ===
                  getSegundaDaSemana(semanaAtual).toISOString() &&
                  v.turno === "ambos",
              ).length
            }
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="text-muted-foreground text-sm">
            Técnicos Atuando
          </div>
          <div className="text-2xl text-primary mt-1">
            {
              new Set(
                visitas
                  .filter(
                    (v) =>
                      v.semana ===
                      getSegundaDaSemana(
                        semanaAtual,
                      ).toISOString(),
                  )
                  .map((v) => v.tecnico),
              ).size
            }
          </div>
        </div>
      </div>
    </div>
  );
}