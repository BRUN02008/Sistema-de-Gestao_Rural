import { useMemo, useState } from "react";
import {
  FileText,
  History,
  MapPin,
  Search,
  UserRoundCheck,
} from "lucide-react";

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
  [key: string]: unknown;
}

function mostrarValor(valor: unknown) {
  if (valor === null || valor === undefined || valor === "") {
    return "Não informado";
  }

  if (Array.isArray(valor)) {
    if (valor.length === 0) return "Não informado";

    return valor
      .map((item) =>
        typeof item === "object" ? JSON.stringify(item, null, 2) : String(item),
      )
      .join(", ");
  }

  if (typeof valor === "object") {
    return JSON.stringify(valor, null, 2);
  }

  return String(valor);
}

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

export default function HistoricoTecnico({
  usuarioLogado,
}: {
  usuarioLogado: UsuarioLogado | null;
}) {
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });
  const [busca, setBusca] = useState("");

  const produtoresPermitidos = useMemo(() => {
    if (!usuarioLogado) return [];

    if (usuarioLogado.tipo === "adm") {
      return produtores;
    }

    return produtores.filter(
      (produtor) => produtor.cadastradoPorId === usuarioLogado.id,
    );
  }, [produtores, usuarioLogado]);

  const produtoresFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) return produtoresPermitidos;

    return produtoresPermitidos.filter((produtor) =>
      [
        produtor.nome,
        produtor.cpf,
        produtor.municipio,
        produtor.comunidade,
        produtor.cadastradoPorNome,
      ]
        .filter(Boolean)
        .some((valor) => String(valor).toLowerCase().includes(termo)),
    );
  }, [busca, produtoresPermitidos]);

  const totalPescadores = useMemo(
    () => produtoresPermitidos.filter(isPescador).length,
    [produtoresPermitidos],
  );

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        <div className="bg-linear-to-r from-amber-50 via-white to-primary/5 p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-amber-500 p-3 shadow-sm">
                <History className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                  Histórico
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                  Produtores cadastrados
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                  {usuarioLogado?.tipo === "adm"
                    ? "Visualização completa dos produtores registrados pela equipe."
                    : "Visualização dos produtores vinculados ao técnico logado."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-amber-200 bg-white/80 p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Total</p>
                <p className="text-2xl font-semibold text-slate-950">
                  {produtoresPermitidos.length}
                </p>
              </div>
              <div className="rounded-lg border border-amber-200 bg-white/80 p-3 shadow-sm">
                <p className="text-xs font-medium text-slate-500">Pescadores</p>
                <p className="text-2xl font-semibold text-slate-950">
                  {totalPescadores}
                </p>
              </div>
              <div className="col-span-2 rounded-lg border border-primary/15 bg-white/80 p-3 shadow-sm sm:col-span-1">
                <p className="text-xs font-medium text-slate-500">Perfil</p>
                <p className="truncate text-sm font-semibold text-primary">
                  {usuarioLogado?.tipo === "adm" ? "Admin" : "Técnico"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              Registros disponíveis
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Consulte por nome, CPF, município, comunidade ou responsável.
            </p>
          </div>

          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar produtor"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
            />
          </div>
        </div>

        {produtoresPermitidos.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <UserRoundCheck className="mx-auto h-10 w-10 text-slate-400" />
            <p className="mt-3 font-semibold text-slate-800">
              Nenhum produtor encontrado
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Quando houver cadastros vinculados a este usuário, eles aparecerão aqui.
            </p>
          </div>
        ) : produtoresFiltrados.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center">
            <Search className="mx-auto h-10 w-10 text-amber-600" />
            <p className="mt-3 font-semibold text-amber-900">
              Nenhum resultado para a busca
            </p>
            <p className="mt-1 text-sm text-amber-800">
              Tente pesquisar por outro nome, CPF ou localidade.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {produtoresFiltrados.map((produtor) => (
              <div
                key={produtor.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-lg font-semibold text-slate-950">
                        {produtor.nome || "Nome não informado"}
                      </p>
                      {isPescador(produtor) && (
                        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                          Pescador
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500">
                      CPF: {produtor.cpf || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-500 md:text-right">
                    <p>Cadastrado por:</p>
                    <p className="font-semibold text-slate-800">
                      {produtor.cadastradoPorNome || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="mb-2 text-sm font-semibold text-slate-800">
                    Documentos disponíveis:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {documentosDisponiveis(produtor).map((doc) => (
                      <span
                        key={doc}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      Município
                    </p>
                    <p className="mt-1 font-medium text-slate-950">
                      {produtor.municipio || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <p className="flex items-center gap-1.5 font-semibold text-slate-600">
                      <MapPin className="h-4 w-4 text-amber-600" />
                      Comunidade
                    </p>
                    <p className="mt-1 font-medium text-slate-950">
                      {produtor.comunidade || "Não informado"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
                    <p className="font-semibold text-slate-600">Perfil</p>
                    <p className="mt-1 font-medium text-slate-950">
                      {mostrarValor(produtor.perfil)}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
                    <p className="font-semibold text-slate-600">Atividades</p>
                    <p className="mt-1 font-medium text-slate-950">
                      {mostrarValor(produtor.atividades)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
