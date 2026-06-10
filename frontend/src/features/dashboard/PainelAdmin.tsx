import { useMemo, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  BarChart3,
  ClipboardList,
  FileText,
  MapPinned,
  Search,
  Sprout,
  Users,
  WalletCards,
} from "lucide-react";

type CulturaAgricola = {
  tipoCultura?: string;
  subtipoAgricultura?: string;
  quantidadeProduzida?: string;
  unidadeMedida?: string;
};

type Produtor = {
  id: string;
  nome?: string;
  cpf?: string;
  sexo?: string;
  publico?: string;
  nomePropriedade?: string;
  propriedade?: string;
  localizacaoCaracteristica?: string;
  caracteristicaLocalizacao?: string;
  possuiCarteiraProdutor?: boolean;
  culturasAgricolas?: CulturaAgricola[];
  dataCadastro?: string;
  cadastradoPorNome?: string;
  [key: string]: unknown;
};

type ChartItem = {
  label: string;
  value: number;
};

function getStoredList<T>(key: string): T[] {
  const stored = localStorage.getItem(key);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as T[];
  } catch {
    return [];
  }
}

function countBy<T>(items: T[], getKey: (item: T) => string | undefined) {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item)?.trim() || "Não informado";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function toChartItems(counts: Record<string, number>, limit = 5): ChartItem[] {
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function StatCard({
  title,
  value,
  description,
  icon,
  tone = "green",
}: {
  title: string;
  value: number | string;
  description: string;
  icon: ReactNode;
  tone?: "green" | "blue" | "amber" | "red";
}) {
  const tones = {
    green: "bg-[#dff0e4] text-[#184b36]",
    blue: "bg-[#e3f2fd] text-[#155e91]",
    amber: "bg-[#fff4cf] text-[#8a5a00]",
    red: "bg-[#fde7e7] text-[#b42318]",
  };

  return (
    <article className="rounded-xl border border-[#d7e0d7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#607368]">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-[#12251c]">
            {value}
          </p>
        </div>
        <div className={`rounded-lg p-2.5 ${tones[tone]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-sm leading-5 text-[#607368]">{description}</p>
    </article>
  );
}

function BarList({
  title,
  items,
  empty,
}: {
  title: string;
  items: ChartItem[];
  empty: string;
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <section className="rounded-xl border border-[#d7e0d7] bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-[#184b36]" />
        <h3 className="text-base font-bold text-[#12251c]">{title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg bg-[#f6faf6] p-4 text-sm text-[#607368]">
          {empty}
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-semibold text-[#263a31]">
                  {item.label}
                </span>
                <span className="font-bold text-[#184b36]">{item.value}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-[#edf3ed]">
                <div
                  className="h-full rounded-full bg-[#1b6b49]"
                  style={{ width: `${Math.max((item.value / max) * 100, 8)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function PainelAdmin() {
  const [busca, setBusca] = useState("");
  const [produtores] = useState<Produtor[]>(() => getStoredList("produtores"));
  const [documentos] = useState<unknown[]>(() =>
    getStoredList("historicoDocumentos"),
  );

  const culturas = useMemo(
    () => produtores.flatMap((produtor) => produtor.culturasAgricolas || []),
    [produtores],
  );

  const totalPropriedades = useMemo(() => {
    const nomes = produtores
      .map((produtor) =>
        String(produtor.nomePropriedade || produtor.propriedade || "").trim(),
      )
      .filter(Boolean);

    return nomes.length > 0 ? new Set(nomes).size : produtores.length;
  }, [produtores]);

  const totalCarteiras = produtores.filter(
    (produtor) => produtor.possuiCarteiraProdutor,
  ).length;

  const charts = useMemo(() => {
    const culturasPorTipo = toChartItems(
      countBy(culturas, (cultura) => cultura.tipoCultura || cultura.subtipoAgricultura),
      6,
    );

    const localizacao = toChartItems(
      countBy(
        produtores,
        (produtor) =>
          produtor.localizacaoCaracteristica ||
          produtor.caracteristicaLocalizacao,
      ),
      4,
    );

    const publico = toChartItems(countBy(produtores, (produtor) => produtor.publico), 4);
    const sexo = toChartItems(countBy(produtores, (produtor) => produtor.sexo), 4);

    return { culturasPorTipo, localizacao, publico, sexo };
  }, [culturas, produtores]);

  const ultimosRegistros = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return [...produtores]
      .reverse()
      .filter((produtor) => {
        if (!termo) return true;

        return [produtor.nome, produtor.cpf, produtor.cadastradoPorNome]
          .filter(Boolean)
          .some((valor) => String(valor).toLowerCase().includes(termo));
      })
      .slice(0, 8);
  }, [busca, produtores]);

  return (
    <div className="space-y-5">
      <section className="overflow-hidden rounded-xl border border-[#d7e0d7] bg-[#123d2d] text-white shadow-lg shadow-[#123d2d]/10">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#bce1c7]">
              Centro de gestão
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              Painel administrativo IDAM
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/76">
              Visão consolidada para acompanhar produtores, propriedades,
              culturas, documentos e atendimento técnico no território.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-white/12 bg-white/8 px-4 py-3">
              <p className="text-2xl font-bold">{produtores.length}</p>
              <p className="text-xs text-white/70">Produtores</p>
            </div>
            <div className="rounded-lg border border-white/12 bg-white/8 px-4 py-3">
              <p className="text-2xl font-bold">{culturas.length}</p>
              <p className="text-xs text-white/70">Culturas</p>
            </div>
            <div className="rounded-lg border border-white/12 bg-white/8 px-4 py-3">
              <p className="text-2xl font-bold">{documentos.length}</p>
              <p className="text-xs text-white/70">Documentos</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total de produtores"
          value={produtores.length}
          description="Cadastros ativos no armazenamento local."
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          title="Propriedades"
          value={totalPropriedades}
          description="Propriedades identificadas nos cadastros."
          icon={<MapPinned className="h-5 w-5" />}
          tone="blue"
        />
        <StatCard
          title="Culturas"
          value={culturas.length}
          description="Culturas agrícolas vinculadas aos produtores."
          icon={<Sprout className="h-5 w-5" />}
        />
        <StatCard
          title="Carteiras"
          value={totalCarteiras}
          description="Produtores com carteira informada."
          icon={<WalletCards className="h-5 w-5" />}
          tone="amber"
        />
        <StatCard
          title="Registros"
          value={produtores.length}
          description="Registros disponíveis para acompanhamento."
          icon={<ClipboardList className="h-5 w-5" />}
          tone="blue"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <BarList
          title="Produção por cultura"
          items={charts.culturasPorTipo}
          empty="Cadastre culturas agrícolas para visualizar a distribuição."
        />
        <BarList
          title="Distribuição rural/urbana"
          items={charts.localizacao}
          empty="Informe a característica da localização nos cadastros."
        />
        <BarList
          title="Público atendido"
          items={charts.publico}
          empty="Informe o campo Público no perfil do produtor."
        />
        <BarList
          title="Sexo"
          items={charts.sexo}
          empty="Informe o campo Sexo no perfil do produtor."
        />
      </section>

      <section className="rounded-xl border border-[#d7e0d7] bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[#edf1ed] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-[#184b36]" />
              <h3 className="text-base font-bold text-[#12251c]">
                Últimos registros
              </h3>
            </div>
            <p className="mt-1 text-sm text-[#607368]">
              Consulta rápida por produtor, CPF ou técnico responsável.
            </p>
          </div>

          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Pesquisar registros</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#607368]" />
            <input
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Pesquisar registro"
              className="w-full rounded-lg border border-[#d7e0d7] bg-[#fbfdfb] py-2.5 pl-9 pr-3 text-sm text-[#12251c] outline-none transition focus:border-[#1b6b49] focus:ring-4 focus:ring-[#1b6b49]/12"
            />
          </label>
        </div>

        <div className="responsive-scroll">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[#f6faf6] text-xs uppercase tracking-[0.08em] text-[#607368]">
              <tr>
                <th className="px-4 py-3 font-bold">Produtor</th>
                <th className="px-4 py-3 font-bold">CPF</th>
                <th className="px-4 py-3 font-bold">Público</th>
                <th className="px-4 py-3 font-bold">Localização</th>
                <th className="px-4 py-3 font-bold">Culturas</th>
                <th className="px-4 py-3 font-bold">Técnico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf1ed]">
              {ultimosRegistros.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#607368]" colSpan={6}>
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                ultimosRegistros.map((produtor) => (
                  <tr key={produtor.id} className="transition hover:bg-[#f8fbf8]">
                    <td className="px-4 py-3 font-semibold text-[#12251c]">
                      {produtor.nome || "Não informado"}
                    </td>
                    <td className="px-4 py-3 text-[#607368]">
                      {produtor.cpf || "Não informado"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#dff0e4] px-2.5 py-1 text-xs font-bold text-[#184b36]">
                        {produtor.publico || "Não informado"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#607368]">
                      {produtor.localizacaoCaracteristica ||
                        produtor.caracteristicaLocalizacao ||
                        "Não informado"}
                    </td>
                    <td className="px-4 py-3 text-[#607368]">
                      {produtor.culturasAgricolas?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-[#607368]">
                      {produtor.cadastradoPorNome || "Não informado"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-[#edf1ed] px-4 py-3 text-sm text-[#607368]">
          <span>{ultimosRegistros.length} registros exibidos</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#184b36]">
            <FileText className="h-4 w-4" />
            Dados locais
          </span>
        </div>
      </section>
    </div>
  );
}
