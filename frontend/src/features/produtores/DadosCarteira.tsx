interface CarteiraProdutor {
  numero: string;
  emissao: string;
  vencimento: string;
  orgaoEmissor: string;
  observacoes: string;
}

interface DadosCarteiraProps {
  possuiCarteira: boolean;
  numeroCarteira: string;
  vencimentoCarteira: string;
  carteira?: CarteiraProdutor;
  onChange: (dados: {
    possuiCarteiraProdutor: boolean;
    numeroCarteiraProdutor: string;
    vencimentoCarteiraProdutor: string;
    carteiraProdutor: CarteiraProdutor;
  }) => void;
}

const carteiraVazia: CarteiraProdutor = {
  numero: "",
  emissao: "",
  vencimento: "",
  orgaoEmissor: "",
  observacoes: "",
};

export function DadosCarteira({
  possuiCarteira,
  numeroCarteira,
  vencimentoCarteira,
  carteira,
  onChange,
}: DadosCarteiraProps) {
  const dadosCarteira = {
    ...carteiraVazia,
    ...carteira,
    numero: carteira?.numero || numeroCarteira,
    vencimento: carteira?.vencimento || vencimentoCarteira,
  };

  const atualizarCarteira = (
    campo: keyof CarteiraProdutor,
    valor: string,
  ) => {
    const atualizada = { ...dadosCarteira, [campo]: valor };

    onChange({
      possuiCarteiraProdutor: possuiCarteira,
      numeroCarteiraProdutor:
        campo === "numero" ? valor : atualizada.numero,
      vencimentoCarteiraProdutor:
        campo === "vencimento" ? valor : atualizada.vencimento,
      carteiraProdutor: atualizada,
    });
  };

  return (
    <section className="rounded-xl border border-border p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-foreground">Carteira</h3>
        <p className="text-sm text-muted-foreground">
          Dados vinculados ao cadastro do produtor/agricultor.
        </p>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={possuiCarteira}
          onChange={(e) =>
            onChange({
              possuiCarteiraProdutor: e.target.checked,
              numeroCarteiraProdutor: e.target.checked
                ? dadosCarteira.numero
                : "",
              vencimentoCarteiraProdutor: e.target.checked
                ? dadosCarteira.vencimento
                : "",
              carteiraProdutor: e.target.checked
                ? dadosCarteira
                : carteiraVazia,
            })
          }
          className="h-4 w-4"
        />
        <span className="font-medium text-foreground">Possui carteira?</span>
      </label>

      {possuiCarteira && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="numeroCarteira" className="mb-2 block text-sm font-medium text-foreground">
              Número da carteira
            </label>
            <input
              id="numeroCarteira"
              title="Número da carteira"
              type="text"
              value={dadosCarteira.numero}
              onChange={(e) => atualizarCarteira("numero", e.target.value)}
              placeholder="Digite o número da carteira"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5"
            />
          </div>

          <div>
            <label htmlFor="orgaoEmissor" className="mb-2 block text-sm font-medium text-foreground">
              Órgão emissor
            </label>
            <input
              id="orgaoEmissor"
              title="Órgão emissor"
              type="text"
              value={dadosCarteira.orgaoEmissor}
              onChange={(e) =>
                atualizarCarteira("orgaoEmissor", e.target.value)
              }
              placeholder="Digite o órgão emissor"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5"
            />
          </div>

          <div>
            <label htmlFor="emissaoCarteira" className="mb-2 block text-sm font-medium text-foreground">
              Data de emissão
            </label>
            <input
              id="emissaoCarteira"
              title="Data de emissão"
              type="date"
              value={dadosCarteira.emissao}
              onChange={(e) => atualizarCarteira("emissao", e.target.value)}
              placeholder="Selecionar data de emissão"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5"
            />
          </div>

          <div>
            <label htmlFor="vencimentoCarteira" className="mb-2 block text-sm font-medium text-foreground">
              Data de vencimento
            </label>
            <input
              id="vencimentoCarteira"
              title="Data de vencimento"
              type="date"
              value={dadosCarteira.vencimento}
              onChange={(e) => atualizarCarteira("vencimento", e.target.value)}
              placeholder="Selecionar data de vencimento"
              className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="observacoesCarteira" className="mb-2 block text-sm font-medium text-foreground">
              Observações da carteira
            </label>
            <textarea
              id="observacoesCarteira"
              title="Observações da carteira"
              placeholder="Digite observações sobre a carteira"
              rows={3}
              value={dadosCarteira.observacoes}
              onChange={(e) => atualizarCarteira("observacoes", e.target.value)}
              className="w-full resize-none rounded-lg border border-border bg-input-background px-4 py-2.5"
            />
          </div>
        </div>
      )}
    </section>
  );
}
