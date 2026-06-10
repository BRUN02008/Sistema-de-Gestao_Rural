import { useState, useRef } from "react";
import { Calendar, TrendingUp, AlertCircle, Search, ChevronRight, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface HistoricoTrimestre {
  id: string;
  produtorId: string;
  produtorCpf: string;
  produtorNome: string;
  trimestre: "1" | "2" | "3" | "4";
  ano: string;
  dadosAtualizados: Record<string, unknown>;
  observacoesTecnicas: string;
  tecnicoResponsavel: string;
  tecnicoId: string;
  dataAtualizacao: string;
  camposAlterados: string[];
}

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  trimestre?: string;
  anoTrimestre?: string;
  historico?: HistoricoTrimestre[];
  [key: string]: unknown;
}

export default function HistoricoTrimestreComponent() {
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });
  const [produtorSelecionado, setProdutorSelecionado] = useState<Produtor | null>(null);
  const [trimestreSelecionado, setTrimestreSelecionado] = useState<string>("1");
  const [historico] = useState<HistoricoTrimestre[]>(() => {
    const stored = localStorage.getItem("historicoTrimestres");
    return stored ? JSON.parse(stored) : [];
  });
  const [buscaCpf, setBuscaCpf] = useState("");
  const componentRef = useRef<HTMLDivElement>(null);

  const limparCpf = (valor: string) => valor.replace(/\D/g, "");

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Historico_Trimestre_${produtorSelecionado?.nome || "Produtor"}`,
  });

  const buscarProdutorPorCpf = () => {
    const produtor = produtores.find(
      (p) => limparCpf(p.cpf) === limparCpf(buscaCpf),
    );
    if (produtor) {
      setProdutorSelecionado(produtor);
      setTrimestreSelecionado(produtor.trimestre || "1");
    } else {
      alert("Produtor não encontrado com este CPF");
    }
  };

  const historicoDoProdutor = historico.filter(
    (h) =>
      limparCpf(h.produtorCpf) ===
      limparCpf(produtorSelecionado?.cpf || ""),
  ).sort((a, b) => {
    const anoA = parseInt(a.ano);
    const anoB = parseInt(b.ano);
    if (anoA !== anoB) return anoA - anoB;
    return parseInt(a.trimestre) - parseInt(b.trimestre);
  });

  const historicoDoTrimestre = historicoDoProdutor.find(
    h => h.trimestre === trimestreSelecionado
  );

  const getTrimestreAnterior = (trimestre: string) => {
    const index = historicoDoProdutor.findIndex(h => h.trimestre === trimestre);
    return index > 0 ? historicoDoProdutor[index - 1] : null;
  };

  const formatarNomeCampo = (campo: string): string => {
    const mapeamento: { [key: string]: string } = {
      id: "ID",
      nome: "Nome Completo",
      cpf: "CPF",
      rg: "RG",
      orgaoExpedidor: "Órgão Expedidor",
      dataNascimento: "Data de Nascimento",
      nacionalidade: "Nacionalidade",
      municipioNascimento: "Município de Nascimento",
      telefone: "Telefone",
      grauInstrucao: "Grau de Instrução",
      estadoCivil: "Estado Civil",
      raca: "Raça/Cor",
      sexo: "Sexo",
      logradouro: "Logradouro",
      bairro: "Bairro",
      municipio: "Município",
      uf: "UF",
      cep: "CEP",
      codigoMunicipio: "Código do Município",
      tipoLocalizacao: "Tipo de Localização",
      especificacaoLocalizacao: "Especificação da Localização",
      km: "KM",
      margem: "Margem",
      latitude: "Latitude",
      longitude: "Longitude",
      comunidade: "Comunidade",
      perfil: "Perfil do Produtor",
      situacaoImovel: "Situação do Imóvel",
      caracteristicas: "Características",
      nomeImovel: "Nome do Imóvel",
      areaTotal: "Área Total (ha)",
      areaEstado: "Área no Estado (ha)",
      areaOutroEstado: "Área em Outro Estado (ha)",
      areaAgricultura: "Área de Agricultura (ha)",
      areaPastagem: "Área de Pastagem (ha)",
      areaArrendada: "Área Arrendada (ha)",
      areaParceria: "Área em Parceria (ha)",
      atividadePrincipal: "Atividade Principal",
      atividadeSecundaria: "Atividade Secundária",
      atividades: "Detalhamento das Atividades",
      outrasProducoes: "Outras Produções",
      tipoPesca: "Tipo de Pesca",
      rgPesca: "RG Pesca",
      protocoloRgp: "Protocolo RGP",
      localPesca: "Local de Pesca",
      margemPesca: "Margem de Pesca",
      producaoTotal: "Produção Total",
      producaoAnual: "Produção Anual",
      producaoEsperada: "Produção Esperada",
      producaoObtida: "Produção Obtida",
      tecnicoResponsavel: "Técnico Responsável",
      numeroConselho: "Número do Conselho",
      gerente: "Gerente",
      observacoes: "Observações",
      cadastradoPorNome: "Cadastrado Por",
      dataCadastro: "Data de Cadastro",
      dataAtualizacao: "Última Atualização",
      dataRegistro: "Data de Registro",
      dataEmissao: "Data de Emissão",
      anoEmissao: "Ano de Emissão",
      trimestre: "Trimestre",
      anoTrimestre: "Ano do Trimestre",
      culturaPrincipal: "Cultura Principal",
      areaPlantada: "Área Plantada",
      areaColhida: "Área Colhida",
      quantidadeProduzida: "Quantidade Produzida",
      produtividade: "Produtividade",
      numeroCabecas: "Número de Cabeças",
      numeroAnimais: "Número de Animais",
      racaAnimal: "Raça do Animal",
      tipoGado: "Tipo de Gado",
      finalidade: "Finalidade",
      especies: "Espécies",
      quantidadeCapturada: "Quantidade Capturada",
      embarcacao: "Embarcação",
      tipoEmbarcacao: "Tipo de Embarcação",
      codigoRgp: "Código RGP",
      codigoUnloc: "Código UNLOC",
      municipioUf: "Município/UF",
      producaoFlorestal: "Produção Florestal",
      pecuaria: "Pecuária",
      abelhas: "Apicultura/Meliponicultura",
      piscicultura: "Piscicultura",
      categoria: "Categoria",
      tipos: "Tipos",
      tipo: "Tipo",
      produto: "Produto",
      quantidade: "Quantidade",
      kg: "Quantidade (kg)",
    };

    if (mapeamento[campo]) {
      return mapeamento[campo];
    }

    return campo
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(" ");
  };

  const formatarValor = (valor: unknown): string => {
    if (valor === null || valor === undefined || valor === "") {
      return "Não informado";
    }

    if (Array.isArray(valor)) {
      if (valor.length === 0) return "Não informado";

      if (valor.every((item) => typeof item === "string" || typeof item === "number")) {
        return (valor as Array<string | number>).join(", ");
      }

      return valor
        .map((item, idx) => {
          if (typeof item === "object" && item !== null) {
            const props = Object.entries(item as Record<string, unknown>)
              .map(([key, val]) => `${formatarNomeCampo(key)}: ${val || "—"}`)
              .join(" | ");
            return `${idx + 1}. ${props}`;
          }
          return `${idx + 1}. ${String(item)}`;
        })
        .join("; ");
    }

    if (typeof valor === "object" && valor !== null) {
      return Object.entries(valor as Record<string, unknown>)
        .map(([key, val]) => `${formatarNomeCampo(key)}: ${val || "—"}`)
        .join(" | ");
    }

    return String(valor);
  };

  const compararDados = (
    atual: Record<string, unknown>,
    anterior: Record<string, unknown> | null,
  ) => {
    const alteracoes: { campo: string; anterior: string; atual: string }[] = [];

    if (!anterior) return alteracoes;

    Object.keys(atual).forEach((campo) => {
      if (campo === "id" || campo === "historico" || campo === "trimestre") return;

      const valorAtual = JSON.stringify(atual[campo]);
      const valorAnterior = JSON.stringify(anterior[campo]);

      if (valorAtual !== valorAnterior) {
        alteracoes.push({
          campo,
          anterior: formatarValor(anterior[campo]),
          atual: formatarValor(atual[campo]),
        });
      }
    });

    return alteracoes;
  };

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* HEADER */}
        <div
          className="rounded-xl p-6 shadow-lg text-white bg-[linear-gradient(135deg,_#6366f1_0%,_#8b5cf6_50%,_#a855f7_100%)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Histórico por Trimestre</h2>
                <p className="text-white/90 mt-1">
                  Acompanhe a evolução dos dados do produtor ao longo dos trimestres
                </p>
              </div>
            </div>

            {produtorSelecionado && (
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-2 px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-all shadow-lg font-semibold"
              >
                <Printer className="w-5 h-5" />
                Imprimir
              </button>
            )}
          </div>
        </div>

        {/* BUSCA POR CPF */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm no-print">
          <h3 className="text-lg font-semibold text-foreground mb-4">Buscar Produtor</h3>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Digite o CPF do produtor"
              value={buscaCpf}
              onChange={(e) => setBuscaCpf(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={buscarProdutorPorCpf}
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
            >
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </div>

          <div className="mt-4">
            <label htmlFor="produtor-seletor" className="text-sm font-medium text-foreground block mb-2">
              Ou selecione da lista
            </label>
            <select
              id="produtor-seletor"
              value={produtorSelecionado?.id || ""}
              onChange={(e) => {
                const produtor = produtores.find(p => p.id === e.target.value);
                if (produtor) {
                  setProdutorSelecionado(produtor);
                  setBuscaCpf(produtor.cpf);
                  setTrimestreSelecionado(produtor.trimestre || "1");
                }
              }}
              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Selecione um produtor...</option>
              {produtores.map(p => (
                <option key={p.id} value={p.id}>
                  {p.nome} - {p.cpf} (Trimestre {p.trimestre || "1"}/{p.anoTrimestre || new Date().getFullYear()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CONTEÚDO DO PRODUTOR — envolvido pelo ref para impressão */}
        {produtorSelecionado && (
          <div ref={componentRef} className="space-y-6">
            {/* CARD DO PRODUTOR + SELETOR DE TRIMESTRE */}
            <div className="bg-card rounded-xl border-2 border-purple-500/20 p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    {produtorSelecionado.nome}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    CPF: {produtorSelecionado.cpf}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-purple-700">Trimestre Atual</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {produtorSelecionado.trimestre || "1"}º Trimestre
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {produtorSelecionado.anoTrimestre || new Date().getFullYear()}
                  </p>
                </div>
              </div>

              {/* SELETOR DE TRIMESTRE */}
              <div className="mt-6">
                <label className="text-sm font-semibold text-foreground mb-3 block">
                  Visualizar Trimestre
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["1", "2", "3", "4"].map((trim) => (
                    <button
                      key={trim}
                      onClick={() => setTrimestreSelecionado(trim)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        trimestreSelecionado === trim
                          ? "border-purple-500 bg-purple-50 text-purple-700 shadow-md"
                          : "border-border hover:border-purple-300 hover:bg-purple-50/50"
                      }`}
                    >
                      <div className="text-lg font-bold">{trim}º Trimestre</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {historicoDoProdutor.find(h => h.trimestre === trim)
                          ? "Disponível"
                          : trim === "1"
                          ? "Cadastro inicial"
                          : "Não registrado"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* DADOS DO TRIMESTRE SELECIONADO */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-foreground">
                  Dados do {trimestreSelecionado}º Trimestre
                </h3>
              </div>

              {trimestreSelecionado === "1" ? (
                <div className="space-y-4">
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-purple-600" />
                      <p className="font-semibold text-purple-900">Cadastro Inicial</p>
                    </div>
                    <p className="text-sm text-purple-700">
                      Este é o primeiro trimestre, representando o cadastro inicial do produtor.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(produtorSelecionado)
                      .filter(([key]) => !["id", "historico", "senha"].includes(key))
                      .map(([campo, valor]) => (
                        <div key={campo} className="bg-accent/20 p-3 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase">
                            {formatarNomeCampo(campo)}
                          </p>
                          <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                            {formatarValor(valor)}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              ) : historicoDoTrimestre ? (
                <div className="space-y-4">
                  {/* Informações da Atualização */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-accent/20 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Data de Atualização
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(historicoDoTrimestre.dataAtualizacao).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div className="bg-accent/20 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Técnico Responsável
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {historicoDoTrimestre.tecnicoResponsavel}
                      </p>
                    </div>

                    <div className="bg-accent/20 p-4 rounded-lg">
                      <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                        Campos Alterados
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {historicoDoTrimestre.camposAlterados?.length || 0} campos
                      </p>
                    </div>
                  </div>

                  {/* Observações Técnicas */}
                  {historicoDoTrimestre.observacoesTecnicas && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-amber-900 mb-2">
                        Observações Técnicas do Trimestre
                      </p>
                      <p className="text-sm text-amber-800 whitespace-pre-wrap">
                        {historicoDoTrimestre.observacoesTecnicas}
                      </p>
                    </div>
                  )}

                  {/* Comparação com Trimestre Anterior */}
                  {(() => {
                    const anterior = getTrimestreAnterior(trimestreSelecionado);
                    if (!anterior) return null;

                    const alteracoes = compararDados(
                      historicoDoTrimestre.dadosAtualizados,
                      anterior.dadosAtualizados
                    );

                    return alteracoes.length > 0 ? (
                      <div className="bg-card border border-border p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <ChevronRight className="w-5 h-5 text-blue-600" />
                          <p className="font-semibold text-foreground">
                            Alterações em relação ao {anterior.trimestre}º Trimestre
                          </p>
                        </div>

                        <div className="space-y-3">
                          {alteracoes.map((alt, idx) => (
                            <div
                              key={idx}
                              className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-accent/20 rounded-lg"
                            >
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                  Campo
                                </p>
                                <p className="text-sm font-medium text-foreground">
                                  {formatarNomeCampo(alt.campo)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-red-600 uppercase mb-1">
                                  Valor Anterior
                                </p>
                                <p className="text-sm text-red-700">{alt.anterior}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-green-600 uppercase mb-1">
                                  Valor Atual
                                </p>
                                <p className="text-sm text-green-700">{alt.atual}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <p className="text-sm text-green-700">
                          Nenhuma alteração em relação ao trimestre anterior.
                        </p>
                      </div>
                    );
                  })()}

                  {/* Dados Atualizados */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3">
                      Todos os Dados do Trimestre
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.entries(historicoDoTrimestre.dadosAtualizados)
                        .filter(([key]) => !["id", "historico", "senha"].includes(key))
                        .map(([campo, valor]) => (
                          <div key={campo} className="bg-accent/20 p-3 rounded-lg">
                            <p className="text-xs font-semibold text-muted-foreground uppercase">
                              {formatarNomeCampo(campo)}
                            </p>
                            <p className="text-sm text-foreground mt-1 whitespace-pre-wrap">
                              {formatarValor(valor)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Não há registro para o {trimestreSelecionado}º trimestre. O produtor ainda não
                      atualizou seus dados neste período.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Linha do Tempo */}
            {historicoDoProdutor.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">Linha do Tempo</h3>

                <div className="space-y-3">
                  {historicoDoProdutor.map((hist) => (
                    <div
                      key={hist.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        hist.trimestre === trimestreSelecionado
                          ? "border-purple-500 bg-purple-50"
                          : "border-border hover:border-purple-300"
                      }`}
                      onClick={() => setTrimestreSelecionado(hist.trimestre)}
                    >
                      <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
                        {hist.trimestre}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {hist.trimestre}º Trimestre de {hist.ano}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Atualizado em{" "}
                          {new Date(hist.dataAtualizacao).toLocaleDateString("pt-BR")} por{" "}
                          {hist.tecnicoResponsavel}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}