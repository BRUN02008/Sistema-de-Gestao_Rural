import { useEffect, useMemo, useState } from "react";
import {
  Truck,
  CheckCircle,
  Loader2,
  Droplet,
  Plus,
  Pencil,
  Trash2,
  Sparkles,
} from "lucide-react";

export type Veiculo = {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  ano: string;
  cor: string;
  tipo: string;
  quilometragem: string;
  status: "Disponível" | "Em uso" | "Em manutenção" | "Indisponível";
  gasolina: number;
  observacoes: string;
  dataCadastro: string;
  responsavelCadastro: string;
  tecnicoEmUsoId?: string;
  tecnicoEmUsoNome?: string;
  finalidadeUso?: string;
  dataRetirada?: string;
  historicoUso?: {
    tecnicoId: string;
    tecnicoNome: string;
    finalidadeUso: string;
    dataRetirada: string;
    dataDevolucao?: string;
  }[];
};

interface GerenciadorVeiculosProps {
  usuarioLogado?: {
    id: string;
    nome: string;
    email: string;
    tipo: string;
  } | null;
}

const statusStyles: Record<Veiculo["status"], string> = {
  Disponível: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Em uso": "bg-sky-50 text-sky-700 border-sky-200",
  "Em manutenção": "bg-amber-50 text-amber-800 border-amber-200",
  Indisponível: "bg-red-50 text-red-700 border-red-200",
};

const statusOptions: Veiculo["status"][] = [
  "Disponível",
  "Em uso",
  "Em manutenção",
  "Indisponível",
];

const initialFormState: Omit<Veiculo, "id"> = {
  placa: "",
  modelo: "",
  marca: "",
  ano: "",
  cor: "",
  tipo: "",
  quilometragem: "",
  status: "Disponível",
  gasolina: 100,
  observacoes: "",
  dataCadastro: new Date().toISOString().split("T")[0],
  responsavelCadastro: "",
};

export default function GerenciadorVeiculos({ usuarioLogado }: GerenciadorVeiculosProps) {
  const [veiculos, setVeiculos] = useState<Veiculo[]>(() => {
    const stored = localStorage.getItem("veiculosUnidade");
    return stored ? JSON.parse(stored) : [];
  });
  const [form, setForm] = useState(() => ({
    ...initialFormState,
    responsavelCadastro: usuarioLogado?.nome || "",
  }));
  const [editId, setEditId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string>("");
  const [veiculoSelecionadoId, setVeiculoSelecionadoId] = useState<string | null>(null);
  const [finalidadeUso, setFinalidadeUso] = useState("");

  const isTecnicoUser =
    usuarioLogado?.tipo === "tecnico" ||
    usuarioLogado?.tipo === "Técnico" ||
    usuarioLogado?.tipo === "Tecnico";

  const getVeiculoDoTecnico = () =>
    veiculos.find(
      (item) =>
        item.status === "Em uso" &&
        item.tecnicoEmUsoId &&
        item.tecnicoEmUsoId === usuarioLogado?.id,
    );

  const tecnicoJaPossuiVeiculo = () => Boolean(getVeiculoDoTecnico());

  useEffect(() => {
    localStorage.setItem("veiculosUnidade", JSON.stringify(veiculos));
  }, [veiculos]);

  const summary = useMemo(() => {
    const disponiveis = veiculos.filter((item) => item.status === "Disponível").length;
    const manutencao = veiculos.filter((item) => item.status === "Em manutenção").length;
    const totalGasolina = veiculos.reduce((sum, item) => sum + item.gasolina, 0);
    const nivelMedio = veiculos.length ? Math.round(totalGasolina / veiculos.length) : 0;

    return {
      total: veiculos.length,
      disponiveis,
      manutencao,
      nivelMedio,
    };
  }, [veiculos]);

  const getStatusLabelColor = (status: Veiculo["status"]) => {
    return statusStyles[status];
  };

  const veiculoEmUsoDoTecnico = getVeiculoDoTecnico();

  const limparFormulario = () => {
    setForm({
      ...initialFormState,
      dataCadastro: new Date().toISOString().split("T")[0],
      responsavelCadastro: usuarioLogado?.nome || "",
    });
    setEditId(null);
  };

  const iniciarEscolhaVeiculo = (veiculoId: string) => {
    if (!usuarioLogado) {
      setMensagem("Usuário não identificado.");
      return;
    }

    if (!isTecnicoUser) {
      setMensagem("Apenas técnicos podem escolher veículo para uso.");
      return;
    }

    if (tecnicoJaPossuiVeiculo()) {
      setMensagem("Você já possui um veículo em uso.");
      return;
    }

    setVeiculoSelecionadoId(veiculoId);
    setFinalidadeUso("");
    setMensagem("");
  };

  const cancelarSelecaoVeiculo = () => {
    setVeiculoSelecionadoId(null);
    setFinalidadeUso("");
    setMensagem("");
  };

  const confirmarUsoVeiculo = (veiculoId: string) => {
    if (!usuarioLogado) {
      setMensagem("Usuário não identificado.");
      return;
    }

    if (!isTecnicoUser) {
      setMensagem("Apenas técnicos podem escolher veículo para uso.");
      return;
    }

    if (!finalidadeUso.trim()) {
      setMensagem("Informe a finalidade do uso antes de confirmar.");
      return;
    }

    if (tecnicoJaPossuiVeiculo()) {
      setMensagem("Você já possui um veículo em uso.");
      return;
    }

    const retirada = new Date().toISOString();

    setVeiculos((atual) =>
      atual.map((veiculo) => {
        if (veiculo.id !== veiculoId || veiculo.status !== "Disponível") {
          return veiculo;
        }

        return {
          ...veiculo,
          status: "Em uso",
          tecnicoEmUsoId: usuarioLogado.id,
          tecnicoEmUsoNome: usuarioLogado.nome,
          finalidadeUso: finalidadeUso.trim(),
          dataRetirada: retirada,
          historicoUso: [
            ...(veiculo.historicoUso ?? []),
            {
              tecnicoId: usuarioLogado.id,
              tecnicoNome: usuarioLogado.nome,
              finalidadeUso: finalidadeUso.trim(),
              dataRetirada: retirada,
            },
          ],
        };
      }),
    );

    setMensagem("Veículo registrado para uso.");
    setVeiculoSelecionadoId(null);
    setFinalidadeUso("");
  };

  const devolverVeiculo = (veiculoId: string) => {
    if (!usuarioLogado) {
      setMensagem("Usuário não identificado.");
      return;
    }

    setVeiculos((atual) =>
      atual.map((veiculo) => {
        if (veiculo.id !== veiculoId) return veiculo;
        if (veiculo.tecnicoEmUsoId !== usuarioLogado.id) return veiculo;

        const devolucao = new Date().toISOString();

        return {
          ...veiculo,
          status: "Disponível",
          tecnicoEmUsoId: undefined,
          tecnicoEmUsoNome: undefined,
          finalidadeUso: undefined,
          dataRetirada: undefined,
          historicoUso: veiculo.historicoUso
            ? veiculo.historicoUso.map((registro, index, array) =>
                index === array.length - 1
                  ? { ...registro, dataDevolucao: devolucao }
                  : registro,
              )
            : [],
        };
      }),
    );

    setMensagem("Veículo devolvido e liberado com sucesso.");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTecnicoUser) {
      setMensagem("Técnicos não podem cadastrar ou editar veículos.");
      return;
    }

    if (!form.placa || !form.modelo || !form.marca || !form.ano || !form.responsavelCadastro) {
      setMensagem("Preencha os campos obrigatórios antes de salvar.");
      return;
    }

    const novoVeiculo: Veiculo = {
      ...form,
      id: editId ?? Date.now().toString(),
      gasolina: Number(form.gasolina),
    };

    setVeiculos((atual) => {
      if (editId) {
        return atual.map((item) => (item.id === editId ? novoVeiculo : item));
      }

      return [novoVeiculo, ...atual];
    });

    setMensagem(editId ? "Veículo atualizado com sucesso." : "Veículo cadastrado com sucesso.");
    limparFormulario();
  };

  const handleEdit = (veiculo: Veiculo) => {
    if (isTecnicoUser) {
      setMensagem("Técnicos não podem editar veículos.");
      return;
    }

    setEditId(veiculo.id);
    setForm({ ...veiculo });
    setMensagem("");
  };

  const handleDelete = (id: string) => {
    if (isTecnicoUser) {
      setMensagem("Técnicos não podem excluir veículos.");
      return;
    }

    if (!window.confirm("Deseja realmente excluir este veículo?")) {
      return;
    }

    setVeiculos((atual) => atual.filter((item) => item.id !== id));
    setMensagem("Veículo excluído.");
    if (editId === id) {
      limparFormulario();
    }
  };

  const handleFieldChange = <K extends keyof Omit<Veiculo, "id">>(field: K, value: Veiculo[K]) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 xl:grid-cols-4">
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-700">
            <Truck className="w-6 h-6" />
            <div>
              <p className="text-sm uppercase font-semibold tracking-[0.2em]">Total de veículos</p>
              <p className="text-3xl font-bold">{summary.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-sky-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-sky-700">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="text-sm uppercase font-semibold tracking-[0.2em]">Disponíveis</p>
              <p className="text-3xl font-bold">{summary.disponiveis}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-100 bg-amber-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-amber-700">
            <Loader2 className="w-6 h-6" />
            <div>
              <p className="text-sm uppercase font-semibold tracking-[0.2em]">Em manutenção</p>
              <p className="text-3xl font-bold">{summary.manutencao}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700">
            <Droplet className="w-6 h-6" />
            <div>
              <p className="text-sm uppercase font-semibold tracking-[0.2em]">Nível médio de gasolina</p>
              <p className="text-3xl font-bold">{summary.nivelMedio}%</p>
            </div>
          </div>
        </div>
      </div>

      {isTecnicoUser && (
        <section className="rounded-[2rem] border border-border bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Meu veículo em uso</p>
              <h2 className="text-2xl font-bold text-foreground">Veículo em uso</h2>
            </div>
            <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              Técnico
            </div>
          </div>

          {veiculoEmUsoDoTecnico ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">Placa</p>
                <p className="mt-2 text-xl font-bold text-foreground">{veiculoEmUsoDoTecnico.placa}</p>
                <p className="mt-1 text-sm text-slate-500">{veiculoEmUsoDoTecnico.modelo} - {veiculoEmUsoDoTecnico.marca}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-700">Status</p>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusLabelColor(veiculoEmUsoDoTecnico.status)}`}>{veiculoEmUsoDoTecnico.status}</span>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-700">Gasolina</p>
                  <progress
                    value={veiculoEmUsoDoTecnico.gasolina}
                    max={100}
                    className={`mt-2 h-3 w-full appearance-none overflow-hidden rounded-full bg-slate-200 ${
                      veiculoEmUsoDoTecnico.gasolina <= 20
                        ? "accent-red-500"
                        : veiculoEmUsoDoTecnico.gasolina <= 50
                        ? "accent-amber-500"
                        : "accent-emerald-500"
                    }`}
                  />
                </div>
              </div>
              <div className="sm:col-span-2 rounded-3xl border border-slate-200 bg-white p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Retirado em</p>
                    <p className="mt-1 text-slate-600">{new Date(veiculoEmUsoDoTecnico.dataRetirada || "").toLocaleString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Finalidade</p>
                    <p className="mt-1 text-slate-600">{veiculoEmUsoDoTecnico.finalidadeUso || "Não informada"}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => devolverVeiculo(veiculoEmUsoDoTecnico.id)}
                    className="inline-flex items-center justify-center rounded-3xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                  >
                    Devolver veículo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-slate-600">
              Você não possui nenhum veículo em uso no momento.
            </div>
          )}
        </section>
      )}

      {isTecnicoUser && (
        <section className="rounded-[2rem] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-blue-100 p-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 9a1 1 0 100-2 1 1 0 000 2zm5-1a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-blue-900">Informações para Técnicos</p>
              <p className="mt-2 text-sm text-blue-800">Nesta seção você pode:</p>
              <ul className="mt-2 space-y-1 text-sm text-blue-800 list-disc list-inside">
                <li>Consultar todos os veículos disponíveis</li>
                <li>Selecionar um veículo informando a finalidade do uso</li>
                <li>Devolver o veículo quando não precisar mais</li>
              </ul>
              <p className="mt-2 text-sm text-blue-700"><strong>Nota:</strong> Você só pode utilizar um veículo por vez. Devolva o veículo em uso antes de escolher outro.</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
        {!isTecnicoUser && (
          <section className="rounded-[2rem] border border-border bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Formulário</p>
                <h2 className="text-2xl font-bold text-foreground">Cadastro de Veículo</h2>
              </div>
              <div className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
                {editId ? "Modo edição" : "Novo"}
              </div>
            </div>

            {mensagem && (
              <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
                {mensagem}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Placa</span>
                  <input
                    type="text"
                    value={form.placa}
                    onChange={(e) => handleFieldChange("placa", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Modelo</span>
                  <input
                    type="text"
                    value={form.modelo}
                    onChange={(e) => handleFieldChange("modelo", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Marca</span>
                  <input
                    type="text"
                    value={form.marca}
                    onChange={(e) => handleFieldChange("marca", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Ano</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.ano}
                    onChange={(e) => handleFieldChange("ano", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Cor</span>
                  <input
                    type="text"
                    value={form.cor}
                    onChange={(e) => handleFieldChange("cor", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-200"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Tipo de veículo</span>
                  <input
                    type="text"
                    value={form.tipo}
                    onChange={(e) => handleFieldChange("tipo", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                    placeholder="Ex: Caminhonete, Ônibus, Van"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Quilometragem atual</span>
                  <input
                    type="text"
                    value={form.quilometragem}
                    onChange={(e) => handleFieldChange("quilometragem", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Status</span>
                  <select
                    value={form.status}
                    onChange={(e) => handleFieldChange("status", e.target.value as Veiculo["status"]) }
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <label htmlFor="gasolina-range" className="block">
                    Nível de gasolina
                  </label>
                  <span>{form.gasolina}%</span>
                </div>
                <input
                  id="gasolina-range"
                  type="range"
                  min="0"
                  max="100"
                  value={form.gasolina}
                  onChange={(e) => handleFieldChange("gasolina", Number(e.target.value))}
                  className="w-full accent-emerald-500"
                  aria-label="Nível de gasolina"
                />
                <progress
                  value={form.gasolina}
                  max={100}
                  className="mt-2 h-3 w-full appearance-none overflow-hidden rounded-full bg-slate-100 accent-emerald-500"
                />
              </div>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Observações</span>
                <textarea
                  value={form.observacoes}
                  onChange={(e) => handleFieldChange("observacoes", e.target.value)}
                  className="w-full min-h-[110px] rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Detalhes sobre uso, manutenção ou características específicas"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Data do cadastro</span>
                  <input
                    type="date"
                    value={form.dataCadastro}
                    onChange={(e) => handleFieldChange("dataCadastro", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200"
                    required
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Responsável pelo cadastro</span>
                  <input
                    type="text"
                    value={form.responsavelCadastro}
                    onChange={(e) => handleFieldChange("responsavelCadastro", e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-sky-500/30"
                >
                  <Plus className="w-4 h-4" />
                  {editId ? "Atualizar veículo" : "Adicionar veículo"}
                </button>
                <button
                  type="button"
                  onClick={limparFormulario}
                  className="rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Limpar formulário
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-[2rem] border border-border bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.08)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Lista</p>
              <h2 className="text-2xl font-bold text-foreground">Veículos cadastrados</h2>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              {veiculos.length} itens
            </span>
          </div>

          {veiculos.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-600">
              Nenhum veículo registrado ainda. Adicione um veículo para acompanhar a frota.
            </div>
          ) : (
            <div className="space-y-4">
              {veiculos.map((veiculo) => (
                <div
                  key={veiculo.id}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-slate-700">{veiculo.modelo} - {veiculo.marca}</span>
                        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusLabelColor(veiculo.status)}`}>{veiculo.status}</span>
                      </div>
                      <p className="text-sm text-slate-500">Placa: <span className="font-semibold text-slate-700">{veiculo.placa}</span></p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!isTecnicoUser ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEdit(veiculo)}
                            className="inline-flex items-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50"
                          >
                            <Pencil className="w-4 h-4" />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(veiculo.id)}
                            className="inline-flex items-center gap-2 rounded-3xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                          >
                            <Trash2 className="w-4 h-4" />
                            Excluir
                          </button>
                        </>
                      ) : (
                        <>
                          {veiculo.status === "Disponível" && (
                            <button
                              type="button"
                              onClick={() => iniciarEscolhaVeiculo(veiculo.id)}
                              disabled={
                                tecnicoJaPossuiVeiculo() ||
                                (veiculoSelecionadoId !== null && veiculoSelecionadoId !== veiculo.id)
                              }
                              className={`inline-flex items-center gap-2 rounded-3xl border px-4 py-2 text-sm font-semibold transition ${
                                tecnicoJaPossuiVeiculo() ||
                                (veiculoSelecionadoId !== null && veiculoSelecionadoId !== veiculo.id)
                                  ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                              }`}
                            >
                              Usar veículo
                            </button>
                          )}
                          {veiculoSelecionadoId === veiculo.id && (
                            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
                              <label className="block text-sm font-semibold text-slate-700">Finalidade do uso</label>
                              <textarea
                                value={finalidadeUso}
                                onChange={(e) => setFinalidadeUso(e.target.value)}
                                className="mt-2 min-h-[100px] w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                                placeholder="Informe o motivo/finalidade do uso"
                              />
                              <div className="mt-3 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => confirmarUsoVeiculo(veiculo.id)}
                                  className="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                                >
                                  Confirmar uso
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelarSelecaoVeiculo}
                                  className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                          {veiculo.tecnicoEmUsoId === usuarioLogado?.id && (
                            <button
                              type="button"
                              onClick={() => devolverVeiculo(veiculo.id)}
                              className="inline-flex items-center gap-2 rounded-3xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                            >
                              Devolver veículo
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ano</p>
                      <p className="mt-2 font-semibold text-slate-700">{veiculo.ano}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cor</p>
                      <p className="mt-2 font-semibold text-slate-700">{veiculo.cor}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tipo</p>
                      <p className="mt-2 font-semibold text-slate-700">{veiculo.tipo || "Não informado"}</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Responsável</p>
                      <p className="mt-2 font-semibold text-slate-700">{veiculo.responsavelCadastro}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <div className="rounded-3xl bg-slate-100 p-4">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>Gasolina</span>
                        <span>{veiculo.gasolina}%</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                        <progress
                          value={veiculo.gasolina}
                          max={100}
                          className={`h-3 w-full appearance-none overflow-hidden rounded-full ${
                            veiculo.gasolina <= 20
                              ? "accent-red-500"
                              : veiculo.gasolina <= 50
                              ? "accent-amber-500"
                              : "accent-emerald-500"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Observações</p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">{veiculo.observacoes || "Sem observações"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium">Cadastro</p>
                        <p className="mt-1">{new Date(veiculo.dataCadastro).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                        <p className="font-medium">Quilômetro</p>
                        <p className="mt-1">{veiculo.quilometragem || "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
