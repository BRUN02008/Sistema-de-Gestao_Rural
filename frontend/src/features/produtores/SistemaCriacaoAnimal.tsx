interface AviculturaData {
  especies: string[];
  sistemaCriacao: string;
  quantidade: string;
  organica: boolean;
  observacoes: string;
}

interface SistemaCriacaoAnimalProps {
  avicultura?: AviculturaData;
  producaoOrganica?: boolean;
  sistemaCriacao: string;
  onChange: (dados: {
    avicultura: AviculturaData;
    sistemaCriacao: string;
    producaoOrganica: boolean;
  }) => void;
}

const aviculturaVazia: AviculturaData = {
  especies: [],
  sistemaCriacao: "",
  quantidade: "",
  organica: false,
  observacoes: "",
};

export function SistemaCriacaoAnimal({
  avicultura,
  producaoOrganica,
  sistemaCriacao,
  onChange,
}: SistemaCriacaoAnimalProps) {
  const dados = { ...aviculturaVazia, ...avicultura };

  const atualizar = (atualizada: AviculturaData, organica = producaoOrganica) =>
    onChange({
      avicultura: atualizada,
      sistemaCriacao: atualizada.sistemaCriacao || sistemaCriacao,
      producaoOrganica: Boolean(organica),
    });

  return (
    <section className="rounded-xl border border-border bg-muted/20 p-4">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Sistema de Criação</h3>
        <p className="text-sm text-muted-foreground">
          Informe o manejo animal, incluindo avicultura quando houver.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Sistema de criação
          </label>
          <select
            value={dados.sistemaCriacao || sistemaCriacao}
            onChange={(e) =>
              atualizar({ ...dados, sistemaCriacao: e.target.value })
            }
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
          >
            <option value="">Selecione</option>
            {TIPOS_CRIACAO.map((tipo) => (
              <option key={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Quantidade em avicultura
          </label>
          <input
            type="number"
            value={dados.quantidade}
            onChange={(e) => atualizar({ ...dados, quantidade: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5"
          />
        </div>

        <div className="md:col-span-2">
          <p className="mb-2 text-sm font-medium text-foreground">
            Espécies de avicultura
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {AVICULTURA_ESPECIES.map((especie) => {
              const checked = dados.especies.includes(especie);

              return (
                <label
                  key={especie}
                  className={`flex items-center gap-3 rounded-lg border p-3 ${
                    checked
                      ? "border-[#173f31] bg-[#e8f1dc]"
                      : "border-border bg-background"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      atualizar({
                        ...dados,
                        especies: checked
                          ? dados.especies.filter((item) => item !== especie)
                          : [...dados.especies, especie],
                      })
                    }
                  />
                  {especie}
                </label>
              );
            })}
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
          <input
            type="checkbox"
            checked={Boolean(producaoOrganica)}
            onChange={(e) => atualizar(dados, e.target.checked)}
          />
          <span className="font-medium text-foreground">
            Produção ou criação orgânica
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
          <input
            type="checkbox"
            checked={dados.organica}
            onChange={(e) =>
              atualizar({ ...dados, organica: e.target.checked }, e.target.checked)
            }
          />
          <span className="font-medium text-foreground">
            Avicultura orgânica
          </span>
        </label>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Observações do sistema de criação
          </label>
          <textarea
            rows={3}
            value={dados.observacoes}
            onChange={(e) => atualizar({ ...dados, observacoes: e.target.value })}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5"
          />
        </div>
      </div>
    </section>
  );
}
import {
  AVICULTURA_ESPECIES,
  TIPOS_CRIACAO,
} from "../../constants/form-options";
