import { useEffect, useState, useRef } from "react";
import { FileText, Download, User, MapPin, Sprout, FileCheck, Calendar, ClipboardList, Users } from "lucide-react";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  [key: string]: any;
}

export default function RelatorioGeralProdutor() {
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [atendimentos, setAtendimentos] = useState<any[]>([]);
  const [observacoes, setObservacoes] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [produtorSelecionado, setProdutorSelecionado] =
    useState<Produtor | null>(null);
  const relatorioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProdutores(JSON.parse(localStorage.getItem("produtores") || "[]"));
    setAtendimentos(JSON.parse(localStorage.getItem("atendimentos") || "[]"));
    setObservacoes(
      JSON.parse(localStorage.getItem("recomendacoesTecnicas") || "[]")
    );
    setDocumentos(
      JSON.parse(localStorage.getItem("historicoDocumentos") || "[]")
    );
  }, []);

  const atendimentosDoProdutor = atendimentos.filter(
    (a) => a.produtorId === produtorSelecionado?.id
  );

  const observacoesDoProdutor = observacoes.filter(
    (o) => o.produtorId === produtorSelecionado?.id
  );

  const documentosDoProdutor = documentos.filter(
    (d) => d.produtorId === produtorSelecionado?.id
  );

  // Função para formatar nome de campo
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
      // Agricultura
      culturaPrincipal: "Cultura Principal",
      areaPlantada: "Área Plantada",
      areaColhida: "Área Colhida",
      quantidadeProduzida: "Quantidade Produzida",
      produtividade: "Produtividade",
      // Pecuária
      numeroCabecas: "Número de Cabeças",
      numeroAnimais: "Número de Animais",
      racaAnimal: "Raça do Animal",
      tipoGado: "Tipo de Gado",
      finalidade: "Finalidade",
      // Pesca
      especies: "Espécies",
      quantidadeCapturada: "Quantidade Capturada",
      embarcacao: "Embarcação",
      tipoEmbarcacao: "Tipo de Embarcação",
      // Documentação
      codigoRgp: "Código RGP",
      codigoUnloc: "Código UNLOC",
      municipioUf: "Município/UF",
      // Produção
      producaoFlorestal: "Produção Florestal",
      pecuaria: "Pecuária",
      abelhas: "Apicultura/Meliponicultura",
      piscicultura: "Piscicultura",
      // Campos de objetos
      categoria: "Categoria",
      tipos: "Tipos",
      tipo: "Tipo",
      produto: "Produto",
      quantidade: "Quantidade",
      kg: "Quantidade (kg)",
      nome: "Nome",
      // Atendimento
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
      // Sistema
      criadoPorNome: "Criado Por",
      geradoPorNome: "Gerado Por",
      tipoDocumento: "Tipo de Documento",
      dataGeracao: "Data de Geração",
    };

    // Se não encontrar no mapeamento, formata automaticamente
    if (mapeamento[campo]) {
      return mapeamento[campo];
    }

    // Capitaliza primeira letra de cada palavra e separa por espaços
    return campo
      .replace(/([A-Z])/g, " $1") // Adiciona espaço antes de maiúsculas
      .trim()
      .split(" ")
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
      .join(" ");
  };

  // Função para gerar PDF
  const gerarPDF = () => {
    if (!relatorioRef.current || !produtorSelecionado) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const conteudoHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>RELATÓRIO GERAL - ${produtorSelecionado.nome?.toUpperCase()}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Arial', sans-serif;
            font-size: 10pt;
            line-height: 1.4;
            color: #000;
            background: #fff;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #2d5a2d;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .header h1 {
            font-size: 16pt;
            font-weight: bold;
            color: #2d5a2d;
            letter-spacing: 1px;
            margin-bottom: 4px;
          }
          .header p {
            font-size: 9pt;
            color: #555;
          }
          .secao {
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .secao-titulo {
            background: #2d5a2d;
            color: white;
            padding: 8px 12px;
            font-size: 11pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 10px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-bottom: 10px;
          }
          .campo {
            border: 1px solid #ddd;
            padding: 6px 8px;
            background: #f9f9f9;
          }
          .campo-label {
            font-size: 8pt;
            color: #666;
            text-transform: uppercase;
            margin-bottom: 2px;
            font-weight: bold;
          }
          .campo-valor {
            font-size: 10pt;
            color: #000;
            font-weight: normal;
          }
          .destaque {
            background: #e8f5e9;
            border-left: 4px solid #2d5a2d;
            padding: 10px;
            margin: 10px 0;
          }
          .lista-item {
            border-bottom: 1px solid #eee;
            padding: 8px 0;
          }
          .lista-item:last-child {
            border-bottom: none;
          }
          .rodape {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid #2d5a2d;
            text-align: center;
            font-size: 8pt;
            color: #666;
          }
          .full-width {
            grid-column: 1 / -1;
          }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GOVERNO DO ESTADO DO AMAZONAS</h1>
          <p>SECRETARIA DE ESTADO DA PRODUÇÃO RURAL</p>
          <p style="margin-top: 8px; font-weight: bold; font-size: 11pt;">RELATÓRIO GERAL DO PRODUTOR RURAL</p>
          <p style="margin-top: 4px;">Emitido em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
        </div>

        <!-- IDENTIFICAÇÃO -->
        <div class="secao">
          <div class="secao-titulo">1. IDENTIFICAÇÃO DO PRODUTOR</div>
          <div class="grid">
            ${dadosPessoais.map(campo => `
              <div class="campo">
                <div class="campo-label">${formatarNomeCampo(campo)}</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado[campo])}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- ENDEREÇO -->
        <div class="secao">
          <div class="secao-titulo">2. ENDEREÇO</div>
          <div class="grid">
            ${dadosEndereco.map(campo => `
              <div class="campo ${campo === "logradouro" ? "full-width" : ""}">
                <div class="campo-label">${formatarNomeCampo(campo)}</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado[campo])}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- LOCALIZAÇÃO -->
        <div class="secao">
          <div class="secao-titulo">3. LOCALIZAÇÃO DA PROPRIEDADE</div>
          <div class="grid">
            ${dadosLocalizacao.map(campo => `
              <div class="campo ${campo === "especificacaoLocalizacao" ? "full-width" : ""}">
                <div class="campo-label">${formatarNomeCampo(campo)}</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado[campo])}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- DADOS DA PROPRIEDADE -->
        <div class="secao">
          <div class="secao-titulo">4. DADOS DA PROPRIEDADE</div>
          <div class="grid">
            ${dadosPropriedade.map(campo => `
              <div class="campo ${campo === "nomeImovel" ? "full-width" : ""}">
                <div class="campo-label">${formatarNomeCampo(campo)}</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado[campo])}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- ATIVIDADES -->
        <div class="secao">
          <div class="secao-titulo">5. ATIVIDADES DESENVOLVIDAS</div>
          <div class="grid">
            ${dadosAtividades.map(campo => `
              <div class="campo ${["perfil", "caracteristicas", "outrasProducoes"].includes(campo) ? "full-width" : ""}">
                <div class="campo-label">${formatarNomeCampo(campo)}</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado[campo])}</div>
              </div>
            `).join("")}
            ${produtorSelecionado.atividades && Array.isArray(produtorSelecionado.atividades) && produtorSelecionado.atividades.length > 0 ? `
              <div class="campo full-width">
                <div class="campo-label">Detalhamento das Atividades</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado.atividades)}</div>
              </div>
            ` : ""}
          </div>
        </div>

        <!-- PESCA -->
        ${produtorSelecionado.tipoPesca || produtorSelecionado.rgPesca || produtorSelecionado.especies ? `
        <div class="secao">
          <div class="secao-titulo">6. DADOS DE PESCA</div>
          <div class="grid">
            ${dadosPesca.map(campo => `
              <div class="campo">
                <div class="campo-label">${formatarNomeCampo(campo)}</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado[campo])}</div>
              </div>
            `).join("")}
            ${produtorSelecionado.especies && Array.isArray(produtorSelecionado.especies) && produtorSelecionado.especies.length > 0 ? `
              <div class="campo full-width">
                <div class="campo-label">Espécies Capturadas</div>
                <div class="campo-valor">${formatarValorComplexoPDF(produtorSelecionado.especies)}</div>
              </div>
            ` : ""}
          </div>
        </div>
        ` : ""}

        <!-- RECOMENDAÇÕES TÉCNICAS -->
        ${observacoesDoProdutor.length > 0 ? `
        <div class="secao">
          <div class="secao-titulo">7. RECOMENDAÇÕES E OBSERVAÇÕES TÉCNICAS</div>
          ${observacoesDoProdutor.map((obs: any, idx: number) => `
            <div class="destaque" style="margin-bottom: 10px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${idx + 1}. ${(obs.titulo || "OBSERVAÇÃO").toUpperCase()}</div>
              <div style="font-size: 9pt; color: #555; margin-bottom: 6px;">
                TÉCNICO: ${(obs.tecnicoResponsavelNome || obs.tecnicoResponsavel || "NÃO INFORMADO").toUpperCase()}
                ${obs.data ? ` | DATA: ${obs.data}` : ""}
              </div>
              <div style="font-size: 10pt;">${(obs.descricao || obs.observacao || "SEM DESCRIÇÃO").toUpperCase()}</div>
            </div>
          `).join("")}
        </div>
        ` : ""}

        <!-- DOCUMENTOS GERADOS -->
        ${documentosDoProdutor.length > 0 ? `
        <div class="secao">
          <div class="secao-titulo">8. DOCUMENTOS GERADOS</div>
          ${documentosDoProdutor.map((doc: any, idx: number) => `
            <div class="lista-item">
              <div style="font-weight: bold;">${idx + 1}. ${(doc.tipoDocumento || "DOCUMENTO").toUpperCase()}</div>
              <div style="font-size: 9pt; color: #555;">
                GERADO POR: ${(doc.geradoPorNome || "NÃO INFORMADO").toUpperCase()} |
                DATA: ${doc.dataGeracao || "NÃO INFORMADA"}
              </div>
            </div>
          `).join("")}
        </div>
        ` : ""}

        <!-- HISTÓRICO DE ATENDIMENTOS -->
        ${atendimentosDoProdutor.length > 0 ? `
        <div class="secao">
          <div class="secao-titulo">9. HISTÓRICO DE ATENDIMENTOS</div>
          ${atendimentosDoProdutor.map((atend: any, idx: number) => `
            <div class="destaque" style="margin-bottom: 10px;">
              <div style="font-weight: bold; margin-bottom: 6px;">ATENDIMENTO ${idx + 1}</div>
              <div class="grid">
                ${Object.entries(atend).filter(([k]) => k !== "id" && k !== "produtorId").map(([campo, valor]) => `
                  <div class="campo">
                    <div class="campo-label">${formatarNomeCampo(campo)}</div>
                    <div class="campo-valor">${formatarValorComplexoPDF(valor)}</div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
        ` : ""}

        <!-- RODAPÉ -->
        <div class="rodape">
          <p>RELATÓRIO GERADO AUTOMATICAMENTE PELO SISTEMA DE GESTÃO DE PRODUTORES RURAIS</p>
          <p>GOVERNO DO ESTADO DO AMAZONAS - SECRETARIA DE ESTADO DA PRODUÇÃO RURAL</p>
          <p style="margin-top: 4px;">Este documento possui validade institucional e contém informações oficiais do produtor cadastrado.</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(conteudoHTML);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Função para formatar valores complexos (arrays e objetos)
  const formatarValorComplexo = (valor: any): string | JSX.Element => {
    // Null ou undefined
    if (valor === null || valor === undefined || valor === "") {
      return "Não informado";
    }

    // Array
    if (Array.isArray(valor)) {
      if (valor.length === 0) return "Não informado";

      // Array de strings simples
      if (valor.every(item => typeof item === "string" || typeof item === "number")) {
        return valor.join(", ");
      }

      // Array de objetos
      return (
        <div className="space-y-2 mt-2">
          {valor.map((item, idx) => (
            <div key={idx} className="bg-background/50 p-3 rounded border border-border/30">
              {typeof item === "object" && item !== null ? (
                <div className="space-y-1">
                  {Object.entries(item).map(([key, val]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-semibold text-xs text-muted-foreground">
                        {formatarNomeCampo(key)}:
                      </span>
                      <span className="text-xs text-foreground">
                        {String(val || "—")}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-xs">{String(item)}</span>
              )}
            </div>
          ))}
        </div>
      );
    }

    // Objeto (não array)
    if (typeof valor === "object" && valor !== null) {
      return (
        <div className="space-y-1 mt-2">
          {Object.entries(valor).map(([key, val]) => (
            <div key={key} className="flex gap-2">
              <span className="font-semibold text-xs text-muted-foreground">
                {formatarNomeCampo(key)}:
              </span>
              <span className="text-xs text-foreground">
                {String(val || "—")}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Primitivos (string, number, boolean)
    return String(valor);
  };

  // Função para formatar valores complexos no PDF (retorna HTML string)
  const formatarValorComplexoPDF = (valor: any): string => {
    // Null ou undefined
    if (valor === null || valor === undefined || valor === "") {
      return "NÃO INFORMADO";
    }

    // Array
    if (Array.isArray(valor)) {
      if (valor.length === 0) return "NÃO INFORMADO";

      // Array de strings simples
      if (valor.every(item => typeof item === "string" || typeof item === "number")) {
        return valor.join(", ").toUpperCase();
      }

      // Array de objetos
      return valor.map((item, idx) => {
        if (typeof item === "object" && item !== null) {
          const props = Object.entries(item)
            .map(([key, val]) => `${formatarNomeCampo(key)}: ${String(val || "—")}`)
            .join(" | ");
          return `${idx + 1}. ${props}`;
        }
        return `${idx + 1}. ${String(item)}`;
      }).join("<br>");
    }

    // Objeto (não array)
    if (typeof valor === "object" && valor !== null) {
      return Object.entries(valor)
        .map(([key, val]) => `${formatarNomeCampo(key)}: ${String(val || "—")}`)
        .join(" | ")
        .toUpperCase();
    }

    // Primitivos
    return String(valor).toUpperCase();
  };

  // Organizar dados por categoria
  const dadosPessoais = ["nome", "cpf", "rg", "orgaoExpedidor", "dataNascimento", "nacionalidade", "municipioNascimento", "telefone", "grauInstrucao", "estadoCivil", "raca", "sexo"];
  const dadosEndereco = ["logradouro", "bairro", "municipio", "uf", "cep", "codigoMunicipio"];
  const dadosLocalizacao = ["tipoLocalizacao", "especificacaoLocalizacao", "km", "margem", "latitude", "longitude", "comunidade"];
  const dadosPropriedade = ["nomeImovel", "situacaoImovel", "areaTotal", "areaEstado", "areaOutroEstado", "areaAgricultura", "areaPastagem", "areaArrendada", "areaParceria"];
  const dadosAtividades = ["atividadePrincipal", "atividadeSecundaria", "outrasProducoes", "perfil", "caracteristicas"];
  const dadosPesca = ["tipoPesca", "rgPesca", "protocoloRgp", "localPesca", "margemPesca", "producaoTotal"];

  const renderCampo = (campo: string, valor: any) => {
    const valorFormatado = formatarValorComplexo(valor);

    return (
      <div className="bg-gradient-to-br from-accent/20 to-accent/5 p-4 rounded-lg border border-border/50 hover:border-emerald-500/30 transition-all">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          {formatarNomeCampo(campo)}
        </p>
        <div className="text-sm font-medium text-foreground">
          {typeof valorFormatado === "string" ? (
            <p>{valorFormatado}</p>
          ) : (
            valorFormatado
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl border border-emerald-600 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Relatório Geral do Produtor
              </h2>
              <p className="text-emerald-100 mt-1">
                Visualização completa e detalhada dos dados cadastrais
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SELECT */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <label className="text-sm font-semibold text-foreground uppercase tracking-wide flex items-center gap-2">
          <User className="w-4 h-4 text-emerald-600" />
          Selecionar Produtor
        </label>

        <select
          className="w-full mt-3 px-4 py-3 rounded-lg border-2 border-border bg-background hover:border-emerald-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          onChange={(e) => {
            const produtor = produtores.find(
              (p) => p.id === e.target.value
            );
            setProdutorSelecionado(produtor || null);
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

      {/* RELATÓRIO */}
      {produtorSelecionado && (
        <div className="space-y-6" ref={relatorioRef}>

          {/* BOTÃO GERAR PDF */}
          <div className="flex justify-end">
            <button
              onClick={gerarPDF}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
            >
              <Download className="w-5 h-5" />
              Gerar Relatório em PDF
            </button>
          </div>

          {/* 1. IDENTIFICAÇÃO DO PRODUTOR */}
          <div className="bg-card rounded-xl border-2 border-emerald-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <User className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  1. Identificação do Produtor
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dadosPessoais.map((campo) => (
                  <div key={campo}>
                    {renderCampo(campo, produtorSelecionado[campo])}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 2. ENDEREÇO */}
          <div className="bg-card rounded-xl border-2 border-emerald-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  2. Endereço
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dadosEndereco.map((campo) => (
                  <div key={campo}>
                    {renderCampo(campo, produtorSelecionado[campo])}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3. LOCALIZAÇÃO DA PROPRIEDADE */}
          <div className="bg-card rounded-xl border-2 border-emerald-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <MapPin className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  3. Localização da Propriedade
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dadosLocalizacao.map((campo) => (
                  <div key={campo}>
                    {renderCampo(campo, produtorSelecionado[campo])}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. DADOS DA PROPRIEDADE */}
          <div className="bg-card rounded-xl border-2 border-emerald-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <Sprout className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  4. Dados da Propriedade
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dadosPropriedade.map((campo) => (
                  <div key={campo}>
                    {renderCampo(campo, produtorSelecionado[campo])}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5. ATIVIDADES DESENVOLVIDAS */}
          <div className="bg-card rounded-xl border-2 border-emerald-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <Sprout className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  5. Atividades Desenvolvidas
                </h3>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dadosAtividades.map((campo) => (
                  <div key={campo}>
                    {renderCampo(campo, produtorSelecionado[campo])}
                  </div>
                ))}
              </div>

              {/* Detalhamento por tipo de atividade */}
              {produtorSelecionado.atividades && (
                <div className="mt-6">
                  {renderCampo("atividades", produtorSelecionado.atividades)}
                </div>
              )}
            </div>
          </div>

          {/* 6. DADOS DE PESCA (se aplicável) */}
          {(produtorSelecionado.tipoPesca || produtorSelecionado.rgPesca || produtorSelecionado.especies) && (
            <div className="bg-card rounded-xl border-2 border-blue-500/20 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <div className="flex items-center gap-3 text-white">
                  <Sprout className="w-6 h-6" />
                  <h3 className="text-lg font-bold uppercase tracking-wide">
                    6. Dados de Pesca
                  </h3>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dadosPesca.map((campo) => (
                    <div key={campo}>
                      {renderCampo(campo, produtorSelecionado[campo])}
                    </div>
                  ))}
                </div>

                {/* Espécies */}
                {produtorSelecionado.especies && (
                  <div className="mt-6">
                    {renderCampo("especies", produtorSelecionado.especies)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. RECOMENDAÇÕES E OBSERVAÇÕES TÉCNICAS */}
          <div className="bg-card rounded-xl border-2 border-amber-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <ClipboardList className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  7. Recomendações e Observações Técnicas
                </h3>
              </div>
            </div>
            <div className="p-6">
              {observacoesDoProdutor.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma recomendação técnica registrada</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {observacoesDoProdutor.map((obs, i) => (
                    <div key={i} className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-l-4 border-amber-500 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-bold text-amber-900 text-lg">
                          {obs.titulo || "Observação Técnica"}
                        </h4>
                        <span className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full font-semibold">
                          #{i + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-amber-700 mb-3">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <strong>Técnico:</strong> {obs.tecnicoResponsavelNome || obs.tecnicoResponsavel || "Não informado"}
                        </span>
                        {obs.data && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <strong>Data:</strong> {obs.data}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-amber-900 leading-relaxed bg-white/50 p-3 rounded">
                        {obs.descricao || obs.observacao || "Sem descrição"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 8. DOCUMENTOS GERADOS */}
          <div className="bg-card rounded-xl border-2 border-purple-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <FileCheck className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  8. Documentos Gerados
                </h3>
              </div>
            </div>
            <div className="p-6">
              {documentosDoProdutor.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum documento gerado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {documentosDoProdutor.map((doc, i) => (
                    <div key={i} className="bg-gradient-to-r from-purple-50 to-purple-100/30 border border-purple-200 p-4 rounded-lg hover:shadow-md transition-shadow flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-purple-900 mb-1">
                          {doc.tipoDocumento || "Documento"}
                        </p>
                        <div className="flex gap-4 text-sm text-purple-700">
                          <span>
                            <strong>Gerado por:</strong> {doc.geradoPorNome || "Não informado"}
                          </span>
                          <span>
                            <strong>Data:</strong> {doc.dataGeracao || "Não informada"}
                          </span>
                        </div>
                      </div>
                      <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 9. HISTÓRICO DE ATENDIMENTOS */}
          <div className="bg-card rounded-xl border-2 border-emerald-500/20 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
              <div className="flex items-center gap-3 text-white">
                <Calendar className="w-6 h-6" />
                <h3 className="text-lg font-bold uppercase tracking-wide">
                  9. Histórico de Atendimentos
                </h3>
              </div>
            </div>
            <div className="p-6">
              {atendimentosDoProdutor.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhum atendimento registrado</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {atendimentosDoProdutor.map((atend, i) => (
                    <div key={i} className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 border-l-4 border-emerald-500 p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-emerald-900 text-lg">
                          Atendimento #{i + 1}
                        </h4>
                        <span className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full font-semibold">
                          {atend.data || "Sem data"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(atend)
                          .filter(([k]) => k !== "id" && k !== "produtorId")
                          .map(([campo, valor]) => {
                            const valorFormatado = formatarValorComplexo(valor);
                            return (
                              <div key={campo} className="bg-white/70 p-3 rounded border border-emerald-200">
                                <p className="text-xs font-semibold text-emerald-700 uppercase mb-1">
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
            </div>
          </div>

        </div>
      )}
    </div>
  );
}