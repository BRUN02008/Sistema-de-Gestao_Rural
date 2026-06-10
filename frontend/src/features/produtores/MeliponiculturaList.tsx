import { Plus, Trash2 } from "lucide-react";
import { ESPECIES_ABELHA } from "../../constants/form-options";

export interface AbelhaItem {
  nomecientifico: string;
  tipo: string;
  numeroColmeias: string;
  producaoMel: string;
  producaoPolen: string;
  producaoPropolis: string;
}

interface MeliponiculturaListProps {
  abelhas: AbelhaItem[];
  onChange: (abelhas: AbelhaItem[]) => void;
}

const abelhaVazia = (): AbelhaItem => ({
  nomecientifico: "",
  tipo: "",
  numeroColmeias: "",
  producaoMel: "",
  producaoPolen: "",
  producaoPropolis: "",
});

export function MeliponiculturaList({
  abelhas,
  onChange,
}: MeliponiculturaListProps) {
  const lista = abelhas.length > 0 ? abelhas : [abelhaVazia()];

  const atualizar = (index: number, atualizada: AbelhaItem) => {
    onChange(lista.map((item, atual) => (atual === index ? atualizada : item)));
  };

  return (
    <div className="space-y-6">
      {lista.map((abelha, index) => (
        <div
          key={index}
          className="rounded-2xl border border-border bg-muted/20 p-5 space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-foreground">
              Espécie {index + 1}
            </h3>

            <button
              type="button"
              onClick={() =>
                onChange(
                  lista.length > 1
                    ? lista.filter((_, atual) => atual !== index)
                    : [abelhaVazia()],
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Remover espécie
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Tipo de abelha
              </label>
              <select
                value={abelha.tipo}
                onChange={(e) => {
                  const especie = ESPECIES_ABELHA.find(
                    (item) => item.tipo === e.target.value,
                  );

                  atualizar(index, {
                    ...abelha,
                    tipo: e.target.value,
                    nomecientifico:
                      especie?.nomecientifico || abelha.nomecientifico,
                  });
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              >
                <option value="">Selecione</option>
                {ESPECIES_ABELHA.map((especie) => (
                  <option key={especie.tipo} value={especie.tipo}>
                    {especie.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Nome científico
              </label>
              <input
                type="text"
                value={abelha.nomecientifico}
                onChange={(e) =>
                  atualizar(index, {
                    ...abelha,
                    nomecientifico: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              />
            </div>

            {[
              ["numeroColmeias", "Nº de colmeias"],
              ["producaoMel", "Produção de mel (kg)"],
              ["producaoPolen", "Produção de pólen (kg)"],
              ["producaoPropolis", "Produção de própolis (kg)"],
            ].map(([campo, label]) => (
              <div key={campo}>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  {label}
                </label>
                <input
                  type="number"
                  value={abelha[campo as keyof AbelhaItem]}
                  onChange={(e) =>
                    atualizar(index, {
                      ...abelha,
                      [campo]: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...lista, abelhaVazia()])}
        className="inline-flex items-center gap-2 rounded-lg bg-[#173f31] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245942]"
      >
        <Plus className="h-4 w-4" />
        Adicionar espécie
      </button>
    </div>
  );
}
