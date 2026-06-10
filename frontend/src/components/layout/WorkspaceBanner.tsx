import { ChevronRight, Leaf } from "lucide-react";
import type { MenuLink } from "../../types/app";

interface WorkspaceBannerProps {
  activeMenuItem?: MenuLink;
}

export function WorkspaceBanner({ activeMenuItem }: WorkspaceBannerProps) {
  const ActiveIcon = activeMenuItem?.icon || Leaf;

  return (
    <section className="mb-5 rounded-xl border border-[#d7e0d7] bg-white px-4 py-4 shadow-sm sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <nav
            className="mb-2 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#607368]"
            aria-label="Breadcrumb"
          >
            <span>IDAM</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span>Sistema</span>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-[#184b36]">
              {activeMenuItem?.label || "Área de trabalho"}
            </span>
          </nav>

          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#184b36] text-white">
              <ActiveIcon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-bold leading-tight text-[#12251c] sm:text-2xl">
                {activeMenuItem?.label || "Área de trabalho"}
              </h2>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-[#607368]">
                Fluxo operacional para cadastro, acompanhamento técnico,
                documentação rural e gestão pública do Instituto.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          {["Atendimento", "Campo", "Documento"].map((item) => (
            <div
              key={item}
              className="rounded-md border border-[#d7e0d7] bg-[#f6faf6] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[#184b36]"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
