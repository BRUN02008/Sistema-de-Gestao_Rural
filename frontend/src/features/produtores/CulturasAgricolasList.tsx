import { Plus, Trash2 } from "lucide-react";
import {
  SUBTIPOS_AGRICULTURA,
  UNIDADES_PRODUCAO,
} from "../../constants/form-options";

export interface CulturaAgricola {
  id: string;
  tipoCultura: string;
  subtipoAgricultura: string;
  areaPlantada: string;
  areaColhida: string;
  quantidadeProduzida: string;
  unidadeMedida: string;
  produtividadeEstimada: string;
  observacoes: string;
}

interface CulturasAgricolasListProps {
  culturas: CulturaAgricola[];
  onChange: (culturas: CulturaAgricola[]) => void;
}

const novaCultura = (): CulturaAgricola => ({
  id: crypto.randomUUID?.() || String(Date.now()),
  tipoCultura: "",
  subtipoAgricultura: "",
  areaPlantada: "",
  areaColhida: "",
  quantidadeProduzida: "",
  unidadeMedida: "kg",
  produtividadeEstimada: "",
  observacoes: "",
});

const calcularProdutividade = (
  quantidadeProduzida: string,
  areaColhida: string,
) => {
  const quantidade = Number(quantidadeProduzida);
  const area = Number(areaColhida);

  if (!Number.isFinite(quantidade) || !Number.isFinite(area) || area <= 0) {
    return "";
  }

  return (quantidade / area).toFixed(2);
};

export function CulturasAgricolasList({
  culturas,
  onChange,
}: CulturasAgricolasListProps) {
  const lista = culturas.length > 0 ? culturas : [novaCultura()];

  const atualizar = (
    index: number,
    campo: keyof CulturaAgricola,
    valor: string,
  ) => {
    const novas = lista.map((cultura, atual) => {
      if (atual !== index) return cultura;

      const atualizada = { ...cultura, [campo]: valor };

      if (campo === "quantidadeProduzida" || campo === "areaColhida") {
        atualizada.produtividadeEstimada = calcularProdutividade(
          campo === "quantidadeProduzida" ? valor : atualizada.quantidadeProduzida,
          campo === "areaColhida" ? valor : atualizada.areaColhida,
        );
      }

      return atualizada;
    });

    onChange(novas);
  };

  return (
    <div className="space-y-4">
      {lista.map((cultura, index) => (
        <div
          key={cultura.id || index}
          className="rounded-xl border border-border bg-muted/20 p-4"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="font-semibold text-foreground">
              Cultura {index + 1}
            </h3>
            <button
              type="button"
              onClick={() =>
                onChange(
                  lista.length > 1
                    ? lista.filter((_, atual) => atual !== index)
                    : [novaCultura()],
                )
              }
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Remover cultura
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Tipo de cultura
              </label>
              <input
                type="text"
                value={cultura.tipoCultura}
                onChange={(e) => atualizar(index, "tipoCultura", e.target.value)}
                placeholder="Ex: Mandioca"
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Subtipo de agricultura
              </label>
              <select
                value={cultura.subtipoAgricultura}
                onChange={(e) =>
                  atualizar(index, "subtipoAgricultura", e.target.value)
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              >
                <option value="">Selecione</option>
                {SUBTIPOS_AGRICULTURA.map((subtipo) => (
                  <option key={subtipo}>{subtipo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Área plantada (ha)
              </label>
              <input
                type="number"
                step="0.01"
                value={cultura.areaPlantada}
                onChange={(e) => atualizar(index, "areaPlantada", e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Área colhida (ha)
              </label>
              <input
                type="number"
                step="0.01"
                value={cultura.areaColhida}
                onChange={(e) => atualizar(index, "areaColhida", e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Quantidade produzida
              </label>
              <input
                type="number"
                step="0.01"
                value={cultura.quantidadeProduzida}
                onChange={(e) =>
                  atualizar(index, "quantidadeProduzida", e.target.value)
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Unidade
              </label>
              <select
                value={cultura.unidadeMedida}
                onChange={(e) => atualizar(index, "unidadeMedida", e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
              >
                {UNIDADES_PRODUCAO.map((unidade) => (
                  <option key={unidade} value={unidade}>
                    {unidade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Produção calculada
              </label>
              <input
                type="text"
                value={
                  cultura.produtividadeEstimada
                    ? `${cultura.produtividadeEstimada} ${cultura.unidadeMedida || "un"}/ha`
                    : ""
                }
                readOnly
                placeholder="Quantidade / área colhida"
                className="w-full rounded-xl border border-border bg-muted px-4 py-2.5 text-muted-foreground"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Observações
              </label>
              <textarea
                rows={3}
                value={cultura.observacoes}
                onChange={(e) => atualizar(index, "observacoes", e.target.value)}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...lista, novaCultura()])}
        className="inline-flex items-center gap-2 rounded-lg bg-[#173f31] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#245942]"
      >
        <Plus className="h-4 w-4" />
        Adicionar cultura
      </button>
    </div>
  );
}
