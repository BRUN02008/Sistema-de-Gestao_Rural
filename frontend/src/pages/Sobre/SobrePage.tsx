import {
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  Leaf,
  MapPinned,
  ShieldCheck,
} from "lucide-react";

const frentes = [
  {
    titulo: "Cadastro produtivo",
    descricao:
      "Registro de produtores, propriedades, atividades agropecuárias, pesca, extrativismo e informações técnicas de campo.",
    icon: ClipboardList,
  },
  {
    titulo: "Acompanhamento técnico",
    descricao:
      "Histórico, recomendações, responsáveis e observações para apoiar a continuidade do atendimento rural.",
    icon: MapPinned,
  },
  {
    titulo: "Rotina de visitas",
    descricao:
      "Organização de cronogramas, comunidades e deslocamentos para melhorar o planejamento da equipe.",
    icon: CalendarCheck,
  },
  {
    titulo: "Emissão documental",
    descricao:
      "Geração de declarações, relatórios e documentos vinculados aos cadastros realizados no sistema.",
    icon: FileCheck2,
  },
];

export default function SobrePage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_18rem] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#d8d6c9] bg-white px-3 py-2 text-sm font-semibold text-[#173f31]">
              <Leaf className="h-4 w-4" />
              Sistema IDAM
            </div>
            <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-[#13251d] sm:text-4xl">
              Sistema de atendimento rural do Instituto de Desenvolvimento
              Agropecuário e Florestal.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#607368]">
              Esta plataforma reúne as rotinas de cadastro, acompanhamento,
              planejamento de visitas e emissão documental em um único ambiente
              para apoiar equipes técnicas e administrativas do IDAM.
            </p>
          </div>

          <div className="rounded-xl border border-[#d8d6c9] bg-[#173f31] p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#e6c46a]">
              Finalidade
            </p>
            <p className="mt-3 text-2xl font-semibold leading-tight">
              Atendimento com histórico, contexto e documentação no mesmo fluxo.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {frentes.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.titulo}
              className="rounded-xl border border-[#d8d6c9] bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f1dc] text-[#173f31]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#13251d]">
                {item.titulo}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#607368]">
                {item.descricao}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl border border-[#d8d6c9] bg-[#fbfaf5] p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-[#173f31]">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="font-semibold">Uso institucional</h3>
          </div>
          <p className="text-sm leading-6 text-[#607368]">
            O acesso é destinado a perfis técnicos e administrativos, com
            recursos organizados para apoiar o trabalho de campo e o controle
            interno das informações cadastradas.
          </p>
        </div>

        <div className="rounded-xl border border-[#d8d6c9] bg-[#fbfaf5] p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-[#173f31]">
            <Leaf className="h-5 w-5" />
            <h3 className="font-semibold">Escopo do sistema</h3>
          </div>
          <p className="text-sm leading-6 text-[#607368]">
            O sistema centraliza informações de produtores, comunidades,
            veículos, atendimentos, recomendações e documentos emitidos durante
            a rotina de assistência rural.
          </p>
        </div>
      </section>
    </div>
  );
}
