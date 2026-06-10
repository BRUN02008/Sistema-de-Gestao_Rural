import { useMemo, useRef, useState, type ReactNode } from "react";
import {
  Calendar,
  ChevronDown,
  ClipboardList,
  Download,
  FileCheck,
  FileText,
  MapPin,
  Search,
  Sprout,
  User,
  Users,
  X,
} from "lucide-react";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  [key: string]: unknown;
}

type RegistroGenerico = Record<string, unknown>;

type SecaoId =
  | "identificacao"
  | "endereco"
  | "localizacao"
  | "propriedade"
  | "atividades"
  | "pesca"
  | "recomendacoes"
  | "documentos"
  | "atendimentos";

type CorSecao = "emerald" | "blue" | "amber" | "purple";

interface SecaoRelatorioProps {
  id: SecaoId;
  titulo: string;
  icone: ReactNode;
  cor?: CorSecao;
  secoesAbertas: Record<SecaoId, boolean>;
  alternarSecao: (id: SecaoId) => void;
  registrarSecao: (id: SecaoId, el: HTMLElement | null) => void;
  children: ReactNode;
}

interface CardResumoProps {
  titulo: string;
  valor: string | number;
  icone: ReactNode;
}

const secoesPadrao: Record<SecaoId, boolean> = {
  identificacao: true,
  endereco: true,
  localizacao: true,
  propriedade: true,
  atividades: true,
  pesca: true,
  recomendacoes: true,
  documentos: true,
  atendimentos: true,
};

export default function RelatorioGeralProdutor() {
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });

  const [atendimentos] = useState<RegistroGenerico[]>(() => {
    const stored = localStorage.getItem("atendimentos");
    return stored ? JSON.parse(stored) : [];
  });

  const [observacoes] = useState<RegistroGenerico[]>(() => {
    const stored = localStorage.getItem("recomendacoesTecnicas");
    return stored ? JSON.parse(stored) : [];
  });

  const [documentos] = useState<RegistroGenerico[]>(() => {
    const stored = localStorage.getItem("historicoDocumentos");
    return stored ? JSON.parse(stored) : [];
  });

  const [produtorSelecionado, setProdutorSelecionado] =
    useState<Produtor | null>(null);

  const [busca, setBusca] = useState("");
  const [secoesAbertas, setSecoesAbertas] =
    useState<Record<SecaoId, boolean>>(secoesPadrao);

  const relatorioRef = useRef<HTMLDivElement>(null);
  const secoesRef = useRef<Record<string, HTMLElement | null>>({});

  const atendimentosDoProdutor = useMemo(
    () => atendimentos.filter((a) => String(a.produtorId ?? "") === String(produtorSelecionado?.id ?? "")),
    [atendimentos, produtorSelecionado]
  );

  const observacoesDoProdutor = useMemo(
    () => observacoes.filter((o) => String(o.produtorId ?? "") === String(produtorSelecionado?.id ?? "")),
    [observacoes, produtorSelecionado]
  );

  const documentosDoProdutor = useMemo(
    () => documentos.filter((d) => String(d.produtorId ?? "") === String(produtorSelecionado?.id ?? "")),
    [documentos, produtorSelecionado]
  );

  const dadosPessoais = [
    "nome",
    "cpf",
    "rg",
    "orgaoExpedidor",
    "dataNascimento",
    "nacionalidade",
    "municipioNascimento",
    "telefone",
    "grauInstrucao",
    "estadoCivil",
    "raca",
    "sexo",
  ];

  const dadosEndereco = [
    "logradouro",
    "bairro",
    "municipio",
    "uf",
    "cep",
    "codigoMunicipio",
  ];

  const dadosLocalizacao = [
    "tipoLocalizacao",
    "especificacaoLocalizacao",
    "km",
    "margem",
    "latitude",
    "longitude",
    "comunidade",
  ];

  const dadosPropriedade = [
    "nomeImovel",
    "situacaoImovel",
    "areaTotal",
    "areaEstado",
    "areaOutroEstado",
    "areaAgricultura",
    "areaPastagem",
    "areaArrendada",
    "areaParceria",
  ];

  const dadosAtividades = [
    "atividadePrincipal",
    "atividadeSecundaria",
    "outrasProducoes",
    "perfil",
    "caracteristicas",
  ];

  const dadosPesca = [
    "tipoPesca",
    "rgPesca",
    "protocoloRgp",
    "localPesca",
    "margemPesca",
    "producaoTotal",
  ];

  const formatarNomeCampo = (campo: string): string => {
    const mapeamento: Record<string, string> = {
      id: "ID",
      nomeCompleto: "Nome Completo",
      nome: "Nome",
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
      tecnicoResponsavel: "Técnico Responsável",
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
      data: "Data",
      tecnico: "Técnico",
      tipoAtendimento: "Tipo de Atendimento",
      descricao: "Descrição",
      recomendacao: "Recomendação",
      produtorNome: "Nome do Produtor",
      produtorCpf: "CPF do Produtor",
      produtorId: "ID do Produtor",
      atendidoPorNome: "Atendido Por",
      tecnicoResponsavelNome: "Técnico Responsável",
      criadoPorNome: "Criado Por",
      geradoPorNome: "Gerado Por",
      tipoDocumento: "Tipo de Documento",
      dataGeracao: "Data de Geração",
    };

    if (mapeamento[campo]) return mapeamento[campo];

    return campo
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(" ");
  };

  const temValor = (valor: unknown): boolean => {
    if (Array.isArray(valor)) return valor.length > 0;
    return valor !== null && valor !== undefined && valor !== "";
  };

  const valorParaTexto = (valor: unknown): string => {
    if (!temValor(valor)) return "Não informado";

    if (typeof valor === "string" || typeof valor === "number" || typeof valor === "boolean") {
      return String(valor);
    }

    if (Array.isArray(valor)) {
      return valor
        .map((item) => {
          if (typeof item === "object" && item !== null) {
            return Object.entries(item)
              .map(([key, val]) => `${formatarNomeCampo(key)}: ${valorParaTexto(val)}`)
              .join(" | ");
          }

          return String(item);
        })
        .join(", ");
    }

    if (typeof valor === "object" && valor !== null) {
      return Object.entries(valor)
        .map(([key, val]) => `${formatarNomeCampo(key)}: ${valorParaTexto(val)}`)
        .join(" | ");
    }

    return String(valor);
  };

  const formatarValorComplexo = (valor: unknown): ReactNode => {
    if (!temValor(valor)) return "Não informado";

    if (Array.isArray(valor)) {
      if (valor.every((item) => typeof item === "string" || typeof item === "number")) {
        return valor.join(", ");
      }

      return (
        <div className="mt-2 space-y-2">
          {valor.map((item, idx) => (
            <div
              key={idx}
              className="rounded border border-border/30 bg-background/50 p-3"
            >
              {typeof item === "object" && item !== null ? (
                <div className="space-y-1">
                  {Object.entries(item).map(([key, val]) => (
                    <div key={key} className="flex gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">
                        {formatarNomeCampo(key)}:
                      </span>
                      <span className="text-xs text-foreground">
                        {valorParaTexto(val)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs">{valorParaTexto(item)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    if (typeof valor === "object" && valor !== null) {
      return (
        <div className="mt-2 space-y-1">
          {Object.entries(valor).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="text-xs font-semibold text-muted-foreground">
                {formatarNomeCampo(key)}:
              </span>
              <span className="text-xs text-foreground">{valorParaTexto(val)}</span>
            </div>
          ))}
        </div>
      );
    }

    return String(valor);
  };

  const formatarValorComplexoPDF = (valor: unknown): string =>
    valorParaTexto(valor).toUpperCase();

  const campoCombinaComBusca = (campo: string, valor: unknown): boolean => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return true;

    return (
      formatarNomeCampo(campo).toLowerCase().includes(termo) ||
      valorParaTexto(valor).toLowerCase().includes(termo)
    );
  };

  const renderCampo = (campo: string, valor: unknown): ReactNode => {
    if (!campoCombinaComBusca(campo, valor)) return null;

    const valorFormatado = formatarValorComplexo(valor);

    return (
      <div className="rounded-lg border border-border/50 bg-gradient-to-br from-accent/20 to-accent/5 p-4 transition-all hover:border-emerald-500/30">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {formatarNomeCampo(campo)}
        </p>
        <div className="text-sm font-medium text-foreground">
          {typeof valorFormatado === "string" ? <p>{valorFormatado}</p> : valorFormatado}
        </div>
      </div>
    );
  };

  const renderCampos = (campos: string[]): ReactNode => (
    <>
      {campos.map((campo) => {
        const conteudo = renderCampo(campo, produtorSelecionado?.[campo]);

        if (!conteudo) return null;

        return <div key={campo}>{conteudo}</div>;
      })}
    </>
  );

  const alternarSecao = (id: SecaoId) => {
    setSecoesAbertas((atual) => ({
      ...atual,
      [id]: !atual[id],
    }));
  };

  const registrarSecao = (id: SecaoId, el: HTMLElement | null) => {
    secoesRef.current[id] = el;
  };

  const irParaSecao = (id: SecaoId) => {
    secoesRef.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const limparSelecao = () => {
    setProdutorSelecionado(null);
    setBusca("");
    setSecoesAbertas(secoesPadrao);
  };

  const gerarPDF = () => {
    if (!relatorioRef.current || !produtorSelecionado) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const temPesca =
      temValor(produtorSelecionado.tipoPesca) ||
      temValor(produtorSelecionado.rgPesca) ||
      temValor(produtorSelecionado.especies);

    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>RELATÓRIO GERAL - ${String(produtorSelecionado.nome).toUpperCase()}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; font-size: 10pt; line-height: 1.4; color: #000; background: #fff; }
          .header { text-align: center; border-bottom: 3px solid #2d5a2d; padding-bottom: 12px; margin-bottom: 20px; }
          .header h1 { font-size: 16pt; font-weight: bold; color: #2d5a2d; letter-spacing: 1px; margin-bottom: 4px; }
          .header p { font-size: 9pt; color: #555; }
          .secao { margin-bottom: 20px; page-break-inside: avoid; }
          .secao-titulo { background: #2d5a2d; color: white; padding: 8px 12px; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-bottom: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
          .campo { border: 1px solid #ddd; padding: 6px 8px; background: #f9f9f9; }
          .campo-label { font-size: 8pt; color: #666; text-transform: uppercase; margin-bottom: 2px; font-weight: bold; }
          .campo-valor { font-size: 10pt; color: #000; }
          .destaque { background: #e8f5e9; border-left: 4px solid #2d5a2d; padding: 10px; margin: 10px 0; }
          .lista-item { border-bottom: 1px solid #eee; padding: 8px 0; }
          .rodape { margin-top: 30px; padding-top: 15px; border-top: 2px solid #2d5a2d; text-align: center; font-size: 8pt; color: #666; }
          .full-width { grid-column: 1 / -1; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GOVERNO DO ESTADO DO AMAZONAS</h1>
          <p>SECRETARIA DE ESTADO DA PRODUÇÃO RURAL</p>
          <p style="margin-top: 8px; font-weight: bold; font-size: 11pt;">RELATÓRIO GERAL DO PRODUTOR RURAL</p>
          <p style="margin-top: 4px;">Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
        </div>

        ${secaoPDF("1. IDENTIFICAÇÃO DO PRODUTOR", dadosPessoais)}
        ${secaoPDF("2. ENDEREÇO", dadosEndereco)}
        ${secaoPDF("3. LOCALIZAÇÃO DA PROPRIEDADE", dadosLocalizacao)}
        ${secaoPDF("4. DADOS DA PROPRIEDADE", dadosPropriedade)}
        ${secaoPDF("5. ATIVIDADES DESENVOLVIDAS", dadosAtividades)}
        ${
          temValor(produtorSelecionado.atividades)
            ? `<div class="secao"><div class="secao-titulo">DETALHAMENTO DAS ATIVIDADES</div><div class="campo"><div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado.atividades)}</div></div></div>`
            : ""
        }
        ${temPesca ? secaoPDF("6. DADOS DE PESCA", dadosPesca) : ""}

        ${
          observacoesDoProdutor.length > 0
            ? `<div class="secao"><div class="secao-titulo">7. RECOMENDAÇÕES E OBSERVAÇÕES TÉCNICAS</div>${observacoesDoProdutor
                .map(
                  (obs, idx) => `
                  <div class="destaque">
                    <strong>${idx + 1}. ${formatarValorComplexoPDF(obs.titulo ?? "OBSERVAÇÃO")}</strong><br>
                    TÉCNICO: ${formatarValorComplexoPDF(obs.tecnicoResponsavelNome ?? obs.tecnicoResponsavel ?? "NÃO INFORMADO")}
                    ${temValor(obs.data) ? ` | DATA: ${formatarValorComplexoPDF(obs.data)}` : ""}
                    <br>${formatarValorComplexoPDF(obs.descricao ?? obs.observacao ?? "SEM DESCRIÇÃO")}
                  </div>`
                )
                .join("")}</div>`
            : ""
        }

        ${
          documentosDoProdutor.length > 0
            ? `<div class="secao"><div class="secao-titulo">8. DOCUMENTOS GERADOS</div>${documentosDoProdutor
                .map(
                  (doc, idx) => `
                  <div class="lista-item">
                    <strong>${idx + 1}. ${formatarValorComplexoPDF(doc.tipoDocumento ?? "DOCUMENTO")}</strong><br>
                    GERADO POR: ${formatarValorComplexoPDF(doc.geradoPorNome ?? "NÃO INFORMADO")} |
                    DATA: ${formatarValorComplexoPDF(doc.dataGeracao ?? "NÃO INFORMADA")}
                  </div>`
                )
                .join("")}</div>`
            : ""
        }

        ${
          atendimentosDoProdutor.length > 0
            ? `<div class="secao"><div class="secao-titulo">9. HISTÓRICO DE ATENDIMENTOS</div>${atendimentosDoProdutor
                .map(
                  (atend, idx) => `
                  <div class="destaque">
                    <strong>ATENDIMENTO ${idx + 1}</strong>
                    <div class="grid">
                      ${Object.entries(atend)
                        .filter(([k]) => k !== "id" && k !== "produtorId")
                        .map(
                          ([campo, valor]) => `
                          <div class="campo">
                            <div class="campo-label">${formatarNomeCampo(campo)}</div>
                            <div class="campo-valor">${formatarValorComplexoPDF(valor)}</div>
                          </div>`
                        )
                        .join("")}
                    </div>
                  </div>`
                )
                .join("")}</div>`
            : ""
        }

        <div class="rodape">
          <p>RELATÓRIO GERADO AUTOMATICAMENTE PELO SISTEMA DE GESTÃO DE PRODUTORES RURAIS</p>
          <p>GOVERNO DO ESTADO DO AMAZONAS - SECRETARIA DE ESTADO DA PRODUÇÃO RURAL</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(conteudoHTML);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  const secaoPDF = (titulo: string, campos: string[]): string => `
    <div class="secao">
      <div class="secao-titulo">${titulo}</div>
      <div class="grid">
        ${campos
          .map(
            (campo) => `
            <div class="campo ${campo === "logradouro" || campo === "nomeImovel" || campo === "especificacaoLocalizacao" ? "full-width" : ""}">
              <div class="campo-label">${formatarNomeCampo(campo)}</div>
              <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado?.[campo])}</div>
            </div>`
          )
          .join("")}
      </div>
    </div>
  `;

  const temPesca =
    !!produtorSelecionado &&
    (temValor(produtorSelecionado.tipoPesca) ||
      temValor(produtorSelecionado.rgPesca) ||
      temValor(produtorSelecionado.especies));

  const menuSecoes: Array<{
    id: SecaoId;
    titulo: string;
    icone: ReactNode;
    mostrar?: boolean;
  }> = [
    { id: "identificacao", titulo: "Identificação", icone: <User className="h-4 w-4" /> },
    { id: "endereco", titulo: "Endereço", icone: <MapPin className="h-4 w-4" /> },
    { id: "localizacao", titulo: "Localização", icone: <MapPin className="h-4 w-4" /> },
    { id: "propriedade", titulo: "Propriedade", icone: <Sprout className="h-4 w-4" /> },
    { id: "atividades", titulo: "Atividades", icone: <Sprout className="h-4 w-4" /> },
    { id: "pesca", titulo: "Pesca", icone: <Sprout className="h-4 w-4" />, mostrar: temPesca },
    { id: "recomendacoes", titulo: "Recomendações", icone: <ClipboardList className="h-4 w-4" /> },
    { id: "documentos", titulo: "Documentos", icone: <FileCheck className="h-4 w-4" /> },
    { id: "atendimentos", titulo: "Atendimentos", icone: <Calendar className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-emerald-600 bg-linear-to-r from-emerald-600 to-emerald-700 p-6 shadow-lg">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/20 p-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Relatório Geral do Produtor
              </h2>
              <p className="mt-1 text-emerald-100">
                Visualização completa, organizada e dinâmica dos dados cadastrais.
              </p>
            </div>
          </div>

          {produtorSelecionado ? (
            <button
              type="button"
              onClick={limparSelecao}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
            >
              <X className="h-4 w-4" />
              Limpar seleção
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <label htmlFor="select-produtor" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-foreground">
          <User className="h-4 w-4 text-emerald-600" />
          Selecionar Produtor
        </label>

        <select
          id="select-produtor"
          className="mt-3 w-full rounded-lg border-2 border-border bg-background px-4 py-3 transition-all hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
          value={produtorSelecionado?.id ?? ""}
          onChange={(e) => {
            const produtor = produtores.find((p) => p.id === e.target.value);
            setProdutorSelecionado(produtor ?? null);
          }}
        >
          <option value="">Selecione um produtor...</option>
          {produtores.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} - {p.cpf}
            </option>
          ))}
        </select>
      </div>

      {produtorSelecionado ? (
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-xl border border-border bg-card p-4 shadow-sm lg:sticky lg:top-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Menu do relatório
            </p>

            <div className="space-y-2">
              {menuSecoes
                .filter((secao) => secao.mostrar !== false)
                .map((secao) => (
                  <button
                    key={secao.id}
                    type="button"
                    onClick={() => irParaSecao(secao.id)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground transition hover:bg-emerald-500/10 hover:text-emerald-700"
                  >
                    {secao.icone}
                    {secao.titulo}
                  </button>
                ))}
            </div>
          </aside>

          <div className="space-y-6" ref={relatorioRef}>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <CardResumo
                titulo="Atendimentos"
                valor={atendimentosDoProdutor.length}
                icone={<Calendar className="h-5 w-5" />}
              />
              <CardResumo
                titulo="Documentos"
                valor={documentosDoProdutor.length}
                icone={<FileCheck className="h-5 w-5" />}
              />
              <CardResumo
                titulo="Recomendações"
                valor={observacoesDoProdutor.length}
                icone={<ClipboardList className="h-5 w-5" />}
              />
              <CardResumo
                titulo="Atividade principal"
                valor={valorParaTexto(produtorSelecionado.atividadePrincipal)}
                icone={<Sprout className="h-5 w-5" />}
              />
            </div>

            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Pesquisar no relatório..."
                    className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSecoesAbertas(secoesPadrao)}
                    className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:bg-accent"
                  >
                    Expandir
                  </button>
                  <button
                    type="button"
                    onClick={gerarPDF}
                    className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow transition hover:from-emerald-700 hover:to-emerald-800"
                  >
                    <Download className="h-4 w-4" />
                    Gerar PDF
                  </button>
                </div>
              </div>
            </div>

            <SecaoRelatorio
              id="identificacao"
              titulo="1. Identificação do Produtor"
              icone={<User className="h-6 w-6" />}
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderCampos(dadosPessoais)}
              </div>
            </SecaoRelatorio>

            <SecaoRelatorio
              id="endereco"
              titulo="2. Endereço"
              icone={<MapPin className="h-6 w-6" />}
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderCampos(dadosEndereco)}
              </div>
            </SecaoRelatorio>

            <SecaoRelatorio
              id="localizacao"
              titulo="3. Localização da Propriedade"
              icone={<MapPin className="h-6 w-6" />}
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderCampos(dadosLocalizacao)}
              </div>
            </SecaoRelatorio>

            <SecaoRelatorio
              id="propriedade"
              titulo="4. Dados da Propriedade"
              icone={<Sprout className="h-6 w-6" />}
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {renderCampos(dadosPropriedade)}
              </div>
            </SecaoRelatorio>

            <SecaoRelatorio
              id="atividades"
              titulo="5. Atividades Desenvolvidas"
              icone={<Sprout className="h-6 w-6" />}
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {renderCampos(dadosAtividades)}
              </div>

              {temValor(produtorSelecionado.atividades) ? (
                <div className="mt-6">
                  {renderCampo("atividades", produtorSelecionado.atividades)}
                </div>
              ) : null}
            </SecaoRelatorio>

            {temPesca ? (
              <SecaoRelatorio
                id="pesca"
                titulo="6. Dados de Pesca"
                icone={<Sprout className="h-6 w-6" />}
                cor="blue"
                secoesAbertas={secoesAbertas}
                alternarSecao={alternarSecao}
                registrarSecao={registrarSecao}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {renderCampos(dadosPesca)}
                </div>

                {temValor(produtorSelecionado.especies) ? (
                  <div className="mt-6">
                    {renderCampo("especies", produtorSelecionado.especies)}
                  </div>
                ) : null}
              </SecaoRelatorio>
            ) : null}

            <SecaoRelatorio
              id="recomendacoes"
              titulo="7. Recomendações e Observações Técnicas"
              icone={<ClipboardList className="h-6 w-6" />}
              cor="amber"
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              {observacoesDoProdutor.length === 0 ? (
                <EstadoVazio
                  icone={<ClipboardList className="h-12 w-12" />}
                  texto="Nenhuma recomendação técnica registrada"
                />
              ) : (
                <div className="space-y-4">
                  {observacoesDoProdutor.map((obs, i) => (
                    <div
                      key={i}
                      className="rounded-lg border-l-4 border-amber-500 bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <h4 className="text-lg font-bold text-amber-900">
                          {valorParaTexto(obs.titulo ?? "Observação Técnica")}
                        </h4>
                        <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold text-white">
                          #{i + 1}
                        </span>
                      </div>

                      <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-amber-700">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <strong>Técnico:</strong>{" "}
                          {valorParaTexto(
                            obs.tecnicoResponsavelNome ??
                              obs.tecnicoResponsavel ??
                              "Não informado"
                          )}
                        </span>

                        {temValor(obs.data) ? (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <strong>Data:</strong> {valorParaTexto(obs.data)}
                          </span>
                        ) : null}
                      </div>

                      <p className="rounded bg-white/50 p-3 text-sm leading-relaxed text-amber-900">
                        {valorParaTexto(obs.descricao ?? obs.observacao ?? "Sem descrição")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </SecaoRelatorio>

            <SecaoRelatorio
              id="documentos"
              titulo="8. Documentos Gerados"
              icone={<FileCheck className="h-6 w-6" />}
              cor="purple"
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              {documentosDoProdutor.length === 0 ? (
                <EstadoVazio
                  icone={<FileCheck className="h-12 w-12" />}
                  texto="Nenhum documento gerado"
                />
              ) : (
                <div className="space-y-3">
                  {documentosDoProdutor.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-purple-200 bg-linear-to-r from-purple-50 to-purple-100/30 p-4 transition hover:shadow-md"
                    >
                      <div className="flex-1">
                        <p className="mb-1 font-bold text-purple-900">
                          {valorParaTexto(doc.tipoDocumento ?? "Documento")}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-purple-700">
                          <span>
                            <strong>Gerado por:</strong>{" "}
                            {valorParaTexto(doc.geradoPorNome ?? "Não informado")}
                          </span>
                          <span>
                            <strong>Data:</strong>{" "}
                            {valorParaTexto(doc.dataGeracao ?? "Não informada")}
                          </span>
                        </div>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 font-bold text-white">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SecaoRelatorio>

            <SecaoRelatorio
              id="atendimentos"
              titulo="9. Histórico de Atendimentos"
              icone={<Calendar className="h-6 w-6" />}
              secoesAbertas={secoesAbertas}
              alternarSecao={alternarSecao}
              registrarSecao={registrarSecao}
            >
              {atendimentosDoProdutor.length === 0 ? (
                <EstadoVazio
                  icone={<Calendar className="h-12 w-12" />}
                  texto="Nenhum atendimento registrado"
                />
              ) : (
                <div className="space-y-5">
                  {atendimentosDoProdutor.map((atend, i) => (
                    <div
                      key={i}
                      className="rounded-lg border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-emerald-100/30 p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <h4 className="text-lg font-bold text-emerald-900">
                          Atendimento #{i + 1}
                        </h4>
                        <span className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                          {valorParaTexto(atend.data ?? "Sem data")}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {Object.entries(atend)
                          .filter(([k]) => k !== "id" && k !== "produtorId")
                          .map(([campo, valor]) => {
                            if (!campoCombinaComBusca(campo, valor)) return null;

                            const valorFormatado = formatarValorComplexo(valor);

                            return (
                              <div
                                key={campo}
                                className="rounded border border-emerald-200 bg-white/70 p-3"
                              >
                                <p className="mb-1 text-xs font-semibold uppercase text-emerald-700">
                                  {formatarNomeCampo(campo)}
                                </p>
                                <div className="text-sm text-emerald-900">
                                  {typeof valorFormatado === "string" ? (
                                    <p>{valorFormatado}</p>
                                  ) : (
                                    valorFormatado
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SecaoRelatorio>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CardResumo({ titulo, valor, icone }: CardResumoProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-700">
          {icone}
        </span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {titulo}
      </p>
      <p className="mt-1 truncate text-xl font-bold text-foreground">{valor}</p>
    </div>
  );
}

function EstadoVazio({ icone, texto }: { icone: ReactNode; texto: string }) {
  return (
    <div className="py-8 text-center text-muted-foreground">
      <div className="mx-auto mb-3 flex justify-center opacity-30">{icone}</div>
      <p>{texto}</p>
    </div>
  );
}

function SecaoRelatorio({
  id,
  titulo,
  icone,
  cor = "emerald",
  secoesAbertas,
  alternarSecao,
  registrarSecao,
  children,
}: SecaoRelatorioProps) {
  const cores: Record<CorSecao, string> = {
    emerald: "from-emerald-600 to-emerald-700 border-emerald-500/20",
    blue: "from-blue-600 to-blue-700 border-blue-500/20",
    amber: "from-amber-600 to-amber-700 border-amber-500/20",
    purple: "from-purple-600 to-purple-700 border-purple-500/20",
  };

  const aberta = secoesAbertas[id];

  return (
    <section
      ref={(el) => {
        registrarSecao(id, el);
      }}
      className={`scroll-mt-6 overflow-hidden rounded-xl border-2 bg-card shadow-md ${cores[cor].split(" ").at(-1)}`}
    >
      <button
        type="button"
        onClick={() => alternarSecao(id)}
        className={`flex w-full items-center justify-between bg-linear-to-r p-4 text-left text-white ${cores[cor]}`}
      >
        <span className="flex items-center gap-3">
          {icone}
          <span className="text-lg font-bold uppercase tracking-wide">{titulo}</span>
        </span>

        <ChevronDown
          className={`h-5 w-5 transition-transform ${aberta ? "rotate-180" : ""}`}
        />
      </button>

      {aberta ? <div className="p-6">{children}</div> : null}
    </section>
  );
}