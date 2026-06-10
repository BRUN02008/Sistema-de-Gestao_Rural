import { Leaf, ShieldCheck } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-[#d7e0d7] bg-white text-[#263a31]">
      <div className="grid gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#184b36] text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#607368]">
              IDAM
            </p>
            <p className="truncate text-sm font-bold text-[#12251c]">
              Instituto de Desenvolvimento Agropecuário e Florestal
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#607368]">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#dff0e4] px-3 py-1.5 font-bold text-[#184b36]">
            <ShieldCheck className="h-4 w-4" />
            Ambiente interno
          </span>
          <span>Cadastro rural, atendimento técnico e documentos oficiais.</span>
        </div>
      </div>
    </footer>
  );
}
