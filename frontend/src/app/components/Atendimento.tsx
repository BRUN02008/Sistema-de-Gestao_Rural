import { useRef, useState, useMemo } from "react";
import {
  Search,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Plus,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import AtendimentoDocumento from "./AtendimentoDocumento";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  dataCadastro?: string;
  atividades?: {
    categoria: string;
    tipos: string[];
  }[];
}

type AtividadesAdicionais = {
  agricultura: string[];
  extrativismo: string[];
  pastagem: string[];
  pesca: string[];
  pecuaria: string[];
};

interface AtendimentoItem {
  id: string;
  produtorId: string;
  produtorNome: string;
  produtorCpf?: string;

  atendidoPorId?: string;
  atendidoPorNome?: string;
  atendidoPorEmail?: string;
  atendidoPorTipo?: "adm" | "tecnico";

  tecnicoResponsavel?: string;

  data: string;
  dados: AtendimentoData;
  atividadesAdicionais?: AtividadesAdicionais;
}

interface ItemAgricultura {
  cultura: string;
  areaAssistir: string;
  areaColher: string;
  areaAssistida: string;
  areaColhida: string;
  numeroBeneficiarios: string;
  produtividadeMunicipio: string;
  producaoEsperada: string;
  producaoObtida: string;
}

interface ItemPecuaria {
  numeroCriadores: string;
  numeroAnimais: string;
  sistemaCriacao: string;
  carne: string;
  leite: string;
  queijo: string;
  ovos: string;
  producaoObtida: string;
}

interface ItemPastagem {
  areaProgramada: string;
  areaRealizada: string;
}

interface ItemPiscicultura {
  numeroCriadores: string;
  numeroInstalacoes: string;
  tipoSistema: string;
  areaAlagada: string;
  numeroPeixesEstocados: string;
  especie: string;
  pesoMedio: string;
  producaoEsperada: string;
  producaoObtida: string;
}

interface ItemPesca {
  tipoSistema: string;
  numeroPeixesEstocado: string;
  especiesPeixes: string;
  numeroInstalacoes: string;
  areaAlagada: string;
  producao: string;
}

interface ItemApicultura {
  numeroCriadores: string;
  numeroColmeias: string;
  especie: string;
  producaoMel: string;
  producaoPolen: string;
  producaoPropolis: string;
  melRegularizado: string;
  polenRegularizado: string;
  propolisRegularizado: string;
}

interface ItemExtrativismo {
  produto: string;
  unidade: string;
  numeroExtrativistas: string;
  quantidadeEsperada: string;
  quantidadeObtida: string;
}

type AgriculturaKey =
  | "graos"
  | "horticultura"
  | "fruticultura"
  | "mandioca"
  | "culturasIndustriais";

type PecuariaKey =
  | "bovinocultura"
  | "avicultura"
  | "suinocultura"
  | "bubalinocultura"
  | "caprinocultura"
  | "ovinocultura"
  | "equinos"
  | "codorna"
  | "patoDomestico";

type ApiculturaKey = "apicultura" | "meliponicultura";

type ExtrativismoKey =
  | "madeira"
  | "naoMadeireira"
  | "vegetal"
  | "mineral";

interface ConfiguracaoAtendimento<TKey extends string> {
  condicao: boolean;
  key: TKey;
  titulo: string;
}

interface AtendimentoData {
  agricultura: Record<AgriculturaKey, ItemAgricultura[]>;
  pecuaria: Record<PecuariaKey, ItemPecuaria[]>;
  pastagem: {
    terraFirme: ItemPastagem;
    varzea: ItemPastagem;
    capineira: ItemPastagem;
  };
  piscicultura: ItemPiscicultura[];
  pesca: {
  barragem: ItemPesca[];
  tanqueEscavado: ItemPesca[];
  canalIgarape: ItemPesca[];
  tanqueRede: ItemPesca[];
  artesanalKg: {
    especie: string;
    kg: string;
  };
  manejadaKg: {
    especie: string;
    kg: string;
  };
};
  apicultura: Record<ApiculturaKey, ItemApicultura[]>;
  extrativismo: Record<ExtrativismoKey, ItemExtrativismo[]>;
}


export default function Atendimento() {
  const [searchTerm, setSearchTerm] = useState("");
  const [trimestreSelecionado, setTrimestreSelecionado] = useState<string>("todos");
  const [ultimoAtendimentoSalvo, setUltimoAtendimentoSalvo] =
  useState<AtendimentoItem | null>(null);
  const [selectedProdutor, setSelectedProdutor] =
    useState<Produtor | null>(null);

  // Estado para atividades adicionais selecionadas manualmente
  const [atividadesAdicionais, setAtividadesAdicionais] = useState<{
    agricultura: string[];
    extrativismo: string[];
    pastagem: string[];
    pesca: string[];
    pecuaria: string[];
  }>({
    agricultura: [],
    extrativismo: [],
    pastagem: [],
    pesca: [],
    pecuaria: [],
  });
  const [atendimentoData, setAtendimentoData] = useState<AtendimentoData>({
    agricultura: {
      graos: [
        {
          cultura: "",
          areaAssistir: "",
          areaColher: "",
          areaAssistida: "",
          areaColhida: "",
          numeroBeneficiarios: "",
          produtividadeMunicipio: "",
          producaoEsperada: "",
          producaoObtida: "",
        },
      ],
      horticultura: [
        {
          cultura: "",
          areaAssistir: "",
          areaColher: "",
          areaAssistida: "",
          areaColhida: "",
          numeroBeneficiarios: "",
          produtividadeMunicipio: "",
          producaoEsperada: "",
          producaoObtida: "",
        },
      ],
      fruticultura: [
        {
          cultura: "",
          areaAssistir: "",
          areaColher: "",
          areaAssistida: "",
          areaColhida: "",
          numeroBeneficiarios: "",
          produtividadeMunicipio: "",
          producaoEsperada: "",
          producaoObtida: "",
        },
      ],
      mandioca: [
        {
          cultura: "",
          areaAssistir: "",
          areaColher: "",
          areaAssistida: "",
          areaColhida: "",
          numeroBeneficiarios: "",
          produtividadeMunicipio: "",
          producaoEsperada: "",
          producaoObtida: "",
        },
      ],
      culturasIndustriais: [
        {
          cultura: "",
          areaAssistir: "",
          areaColher: "",
          areaAssistida: "",
          areaColhida: "",
          numeroBeneficiarios: "",
          produtividadeMunicipio: "",
          producaoEsperada: "",
          producaoObtida: "",
        },
      ],
    },

    pecuaria: {
      bovinocultura: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      avicultura: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      suinocultura: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      bubalinocultura: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      caprinocultura: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      ovinocultura: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      equinos: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      codorna: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
      patoDomestico: [
        {
          numeroCriadores: "",
          numeroAnimais: "",
          sistemaCriacao: "",
          carne: "",
          leite: "",
          queijo: "",
          ovos: "",
          producaoObtida: "",
        },
      ],
    },

    pastagem: {
      terraFirme: {
        areaProgramada: "",
        areaRealizada: "",
      },
      varzea: {
        areaProgramada: "",
        areaRealizada: "",
      },
      capineira: {
        areaProgramada: "",
        areaRealizada: "",
      },
    },
    piscicultura: [
      {
        numeroCriadores: "",
        numeroInstalacoes: "",
        tipoSistema: "",
        areaAlagada: "",
        numeroPeixesEstocados: "",
        especie: "",
        pesoMedio: "",
        producaoEsperada: "",
        producaoObtida: "",
      },
    ],
   pesca: {
  barragem: [
    {
      tipoSistema: "Barragem",
      numeroPeixesEstocado: "",
      especiesPeixes: "",
      numeroInstalacoes: "",
      areaAlagada: "",
      producao: "",
    },
  ],
  tanqueEscavado: [
    {
      tipoSistema: "Tanque Escavado",
      numeroPeixesEstocado: "",
      especiesPeixes: "",
      numeroInstalacoes: "",
      areaAlagada: "",
      producao: "",
    },
  ],
  canalIgarape: [
    {
      tipoSistema: "Canal de Igarapé",
      numeroPeixesEstocado: "",
      especiesPeixes: "",
      numeroInstalacoes: "",
      areaAlagada: "",
      producao: "",
    },
  ],
  tanqueRede: [
    {
      tipoSistema: "Tanque Rede",
      numeroPeixesEstocado: "",
      especiesPeixes: "",
      numeroInstalacoes: "",
      areaAlagada: "",
      producao: "",
    },
  ],
  artesanalKg: {
    especie: "",
    kg: "",
  },
  manejadaKg: {
    especie: "",
    kg: "",
  },
},
    apicultura: {
      apicultura: [
        {
          numeroCriadores: "",
          numeroColmeias: "",
          especie: "",
          producaoMel: "",
          producaoPolen: "",
          producaoPropolis: "",
          melRegularizado: "",
          polenRegularizado: "",
          propolisRegularizado: "",
        },
      ],
      meliponicultura: [
        {
          numeroCriadores: "",
          numeroColmeias: "",
          especie: "",
          producaoMel: "",
          producaoPolen: "",
          producaoPropolis: "",
          melRegularizado: "",
          polenRegularizado: "",
          propolisRegularizado: "",
        },
      ],
    },
    extrativismo: {
      madeira: [
        {
          produto: "",
          unidade: "",
          numeroExtrativistas: "",
          quantidadeEsperada: "",
          quantidadeObtida: "",
        },
      ],
      naoMadeireira: [
        {
          produto: "",
          unidade: "",
          numeroExtrativistas: "",
          quantidadeEsperada: "",
          quantidadeObtida: "",
        },
      ],
      vegetal: [
        {
          produto: "",
          unidade: "",
          numeroExtrativistas: "",
          quantidadeEsperada: "",
          quantidadeObtida: "",
        },
      ],
      mineral: [
        {
          produto: "",
          unidade: "",
          numeroExtrativistas: "",
          quantidadeEsperada: "",
          quantidadeObtida: "",
        },
      ],
    },
  });

  const atividadesAdicionaisIniciais = {
  agricultura: [],
  extrativismo: [],
  pastagem: [],
  pesca: [],
  pecuaria: [],
};

const produtores: Produtor[] = useMemo(() => {
  try {
    return JSON.parse(
      localStorage.getItem("produtores") || "[]"
    );
  } catch (error) {
    console.error("Erro ao carregar produtores", error);
    return [];
  }
}, []);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: ultimoAtendimentoSalvo
      ? `Atendimento_${ultimoAtendimentoSalvo.produtorNome}`
      : "Atendimento",
  });
  // Função para obter o trimestre de uma data
  const obterTrimestre = (dataISO: string): number => {
    const data = new Date(dataISO);
    const mes = data.getMonth() + 1; // getMonth() retorna 0-11
    if (mes >= 1 && mes <= 3) return 1;
    if (mes >= 4 && mes <= 6) return 2;
    if (mes >= 7 && mes <= 9) return 3;
    return 4;
  };

  // Filtrar por busca e trimestre
  const produtoresFiltrados = produtores.filter((produtor: Produtor) => {
    // Filtro de busca
    const matchBusca =
      produtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produtor.cpf.includes(searchTerm);

    // Filtro de trimestre
    if (trimestreSelecionado === "todos") {
      return matchBusca;
    }

    const dataCadastro = produtor.dataCadastro;
    if (!dataCadastro) return false;

    const trimestre = obterTrimestre(dataCadastro);
    const matchTrimestre = trimestre === parseInt(trimestreSelecionado);

    return matchBusca && matchTrimestre;
  });

  // Agrupar produtores por trimestre
  const produtoresPorTrimestre = {
    1: produtores.filter((p: Produtor) => p.dataCadastro && obterTrimestre(p.dataCadastro) === 1),
    2: produtores.filter((p: Produtor) => p.dataCadastro && obterTrimestre(p.dataCadastro) === 2),
    3: produtores.filter((p: Produtor) => p.dataCadastro && obterTrimestre(p.dataCadastro) === 3),
    4: produtores.filter((p: Produtor) => p.dataCadastro && obterTrimestre(p.dataCadastro) === 4),
  };

  const atividades = selectedProdutor?.atividades || [];
  const tiposSelecionados = atividades.flatMap(
    (atividade) => atividade.tipos || [],
  );

  const possuiPecuaria = atividades.some(
    (a) => a.categoria === "Pecuária",
  ) || atividadesAdicionais.pecuaria.length > 0;

  const possuiAgricultura = atividades.some(
    (a) => a.categoria === "Agricultura",
  ) || atividadesAdicionais.agricultura.length > 0;
  const possuiBovinocultura =
    tiposSelecionados.includes("Bovinocultura") || atividadesAdicionais.pecuaria.includes("Bovinocultura");
  const possuiAvicultura =
    tiposSelecionados.includes("Avicultura") || atividadesAdicionais.pecuaria.includes("Avicultura");
  const possuiSuinocultura =
    tiposSelecionados.includes("Suinocultura") || atividadesAdicionais.pecuaria.includes("Suinocultura");
  const possuiBubalinocultura = tiposSelecionados.includes(
    "Bubalinocultura",
  ) || atividadesAdicionais.pecuaria.includes("Bubalinocultura");
  const possuiCaprinocultura =
    tiposSelecionados.includes("Caprinocultura") || atividadesAdicionais.pecuaria.includes("Caprinocultura");
  const possuiOvinocultura =
    tiposSelecionados.includes("Ovinocultura") || atividadesAdicionais.pecuaria.includes("Ovinocultura");
  const possuiEquinos = tiposSelecionados.includes("Equinos") || atividadesAdicionais.pecuaria.includes("Equinos");
  const possuiCodorna = tiposSelecionados.includes("Codorna") || atividadesAdicionais.pecuaria.includes("Codorna");
  const possuiPatoDomestico =
    tiposSelecionados.includes("Pato Doméstico") || atividadesAdicionais.pecuaria.includes("Pato Doméstico");

  const possuiExtrativismo = atividades.some(
    (a) => a.categoria === "Extrativismo",
  ) || atividadesAdicionais.extrativismo.length > 0;

  const possuiGraos = tiposSelecionados.includes("Grãos") || atividadesAdicionais.agricultura.includes("Grãos");
  const possuiHorticultura =
    tiposSelecionados.includes("Horticultura") || atividadesAdicionais.agricultura.includes("Horticultura");
  const possuiFruticultura =
    tiposSelecionados.includes("Fruticultura") || atividadesAdicionais.agricultura.includes("Fruticultura");
  const possuiMandioca = tiposSelecionados.includes("Mandioca") || atividadesAdicionais.agricultura.includes("Mandioca");
  const possuiCulturasIndustriais = tiposSelecionados.includes(
    "Culturas Industriais",
  ) || atividadesAdicionais.agricultura.includes("Culturas Industriais");
  const configuracoesAgricultura: ConfiguracaoAtendimento<AgriculturaKey>[] = [
    {
      condicao: possuiGraos,
      key: "graos",
      titulo: "Grãos",
    },
    {
      condicao: possuiHorticultura,
      key: "horticultura",
      titulo: "Horticultura",
    },
    {
      condicao: possuiFruticultura,
      key: "fruticultura",
      titulo: "Fruticultura",
    },
    {
      condicao: possuiMandioca,
      key: "mandioca",
      titulo: "Mandioca",
    },
    {
      condicao: possuiCulturasIndustriais,
      key: "culturasIndustriais",
      titulo: "Culturas Industriais",
    },
  ];

const possuiBarragem =
  tiposSelecionados.includes("Barragem") ||
  atividadesAdicionais.pesca.includes("Barragem");

const possuiTanqueEscavado =
  tiposSelecionados.includes("Tanque Escavado") ||
  atividadesAdicionais.pesca.includes("Tanque Escavado");

const possuiCanalIgarape =
  tiposSelecionados.includes("Canal de Igarapé") ||
  atividadesAdicionais.pesca.includes("Canal de Igarapé");

const possuiTanqueRede =
  tiposSelecionados.includes("Tanque Rede") ||
  atividadesAdicionais.pesca.includes("Tanque Rede");

const possuiPescaArtesanal =
  tiposSelecionados.includes("Pesca Artesanal") ||
  atividadesAdicionais.pesca.includes("Pesca Artesanal");

const possuiPescaManejada =
  tiposSelecionados.includes("Pesca Manejada") ||
  atividadesAdicionais.pesca.includes("Pesca Manejada");

const possuiPesca =
  possuiBarragem ||
  possuiTanqueEscavado ||
  possuiCanalIgarape ||
  possuiTanqueRede ||
  possuiPescaArtesanal ||
  possuiPescaManejada;

  const possuiPiscicultura =
    tiposSelecionados.includes("Piscicultura") || atividadesAdicionais.pesca.includes("Piscicultura");
  const possuiApicultura =
    tiposSelecionados.includes("Apicultura") || atividadesAdicionais.pecuaria.includes("Apicultura");
  const possuiMeliponicultura = tiposSelecionados.includes(
    "Meliponicultura",
  ) || atividadesAdicionais.pecuaria.includes("Meliponicultura");

  const possuiMadeira = tiposSelecionados.includes(
    "Produção Florestal de Madeira",
  ) || atividadesAdicionais.extrativismo.includes("Produção Florestal de Madeira");

  const possuiNaoMadeireira = tiposSelecionados.includes(
    "Produção Florestal Não Madeireira",
  ) || atividadesAdicionais.extrativismo.includes("Produção Florestal Não Madeireira");

  const possuiExtrativismoVegetal = tiposSelecionados.includes(
    "Extrativismo Vegetal",
  ) || atividadesAdicionais.extrativismo.includes("Extrativismo Vegetal");

  const possuiExtrativismoMineral = tiposSelecionados.includes(
    "Extrativismo Mineral",
  ) || atividadesAdicionais.extrativismo.includes("Extrativismo Mineral");

  const atividadePastagem = selectedProdutor?.atividades?.find(
    (a) => a.categoria === "Pastagem",
  );

  const tiposPastagem = atividadePastagem?.tipos || [];

  const possuiPastagem = tiposPastagem.length > 0 || atividadesAdicionais.pastagem.length > 0;

  const possuiPastagemTerraFirme =
    tiposPastagem.includes("Terra Firme") || atividadesAdicionais.pastagem.includes("Terra Firme");
  const possuiPastagemVarzea = tiposPastagem.includes("Várzea") || atividadesAdicionais.pastagem.includes("Várzea");
  const possuiCapineira = tiposPastagem.includes("Capineira") || atividadesAdicionais.pastagem.includes("Capineira");

  const configuracoesPecuaria: ConfiguracaoAtendimento<PecuariaKey>[] = [
    {
      condicao: possuiBovinocultura,
      key: "bovinocultura",
      titulo: "Bovinocultura",
    },
    {
      condicao: possuiAvicultura,
      key: "avicultura",
      titulo: "Avicultura",
    },
    {
      condicao: possuiSuinocultura,
      key: "suinocultura",
      titulo: "Suinocultura",
    },
    {
      condicao: possuiBubalinocultura,
      key: "bubalinocultura",
      titulo: "Bubalinocultura",
    },
    {
      condicao: possuiCaprinocultura,
      key: "caprinocultura",
      titulo: "Caprinocultura",
    },
    {
      condicao: possuiOvinocultura,
      key: "ovinocultura",
      titulo: "Ovinocultura",
    },
    {
      condicao: possuiEquinos,
      key: "equinos",
      titulo: "Equinos",
    },
    {
      condicao: possuiCodorna,
      key: "codorna",
      titulo: "Codorna",
    },
    {
      condicao: possuiPatoDomestico,
      key: "patoDomestico",
      titulo: "Pato Doméstico",
    },
  ];
  const configuracoesApicultura: ConfiguracaoAtendimento<ApiculturaKey>[] = [
    {
      condicao: possuiApicultura,
      key: "apicultura",
      titulo: "Apicultura",
    },
    {
      condicao: possuiMeliponicultura,
      key: "meliponicultura",
      titulo: "Meliponicultura",
    },
  ];
  const configuracoesExtrativismo: ConfiguracaoAtendimento<ExtrativismoKey>[] = [
    {
      condicao: possuiMadeira,
      key: "madeira",
      titulo: "Produção Florestal de Madeira",
    },
    {
      condicao: possuiNaoMadeireira,
      key: "naoMadeireira",
      titulo: "Produção Florestal Não Madeireira",
    },
    {
      condicao: possuiExtrativismoVegetal,
      key: "vegetal",
      titulo: "Extrativismo Vegetal",
    },
    {
      condicao: possuiExtrativismoMineral,
      key: "mineral",
      titulo: "Extrativismo Mineral",
    },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground mb-2">
          Atendimento ao Produtor
        </h2>
        <p className="text-muted-foreground">
          Consulte e visualize informações dos produtores
          cadastrados
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Filtro por Trimestre */}
        <div>
          <label htmlFor="trimestre" className="block text-sm font-medium text-foreground mb-2">
            Filtrar por Trimestre de Cadastro
          </label>
          <select
            id="trimestre"
            value={trimestreSelecionado}
            onChange={(e) => setTrimestreSelecionado(e.target.value)}
            className="w-full px-4 py-3 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="todos">Todos os Trimestres</option>
            <option value="1">1º Trimestre - Janeiro, Fevereiro e Março ({produtoresPorTrimestre[1].length})</option>
            <option value="2">2º Trimestre - Abril, Maio e Junho ({produtoresPorTrimestre[2].length})</option>
            <option value="3">3º Trimestre - Julho, Agosto e Setembro ({produtoresPorTrimestre[3].length})</option>
            <option value="4">4º Trimestre - Outubro, Novembro e Dezembro ({produtoresPorTrimestre[4].length})</option>
          </select>
        </div>

        {/* Resumo por Trimestre */}
        {trimestreSelecionado === "todos" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-accent/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{produtoresPorTrimestre[1].length}</p>
              <p className="text-xs text-muted-foreground">1º Trimestre</p>
            </div>
            <div className="bg-accent/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{produtoresPorTrimestre[2].length}</p>
              <p className="text-xs text-muted-foreground">2º Trimestre</p>
            </div>
            <div className="bg-accent/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{produtoresPorTrimestre[3].length}</p>
              <p className="text-xs text-muted-foreground">3º Trimestre</p>
            </div>
            <div className="bg-accent/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-primary">{produtoresPorTrimestre[4].length}</p>
              <p className="text-xs text-muted-foreground">4º Trimestre</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6">
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Produtores Cadastrados (
              {produtoresFiltrados.length})
            </h3>
          </div>

          <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
            {produtoresFiltrados.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchTerm
                  ? "Nenhum produtor encontrado"
                  : "Nenhum produtor cadastrado"}
              </div>
            ) : (
              produtoresFiltrados.map((produtor: Produtor) => {
                const trimestre = produtor.dataCadastro ? obterTrimestre(produtor.dataCadastro) : null;
                const dataCadastroFormatada = produtor.dataCadastro
                  ? new Date(produtor.dataCadastro).toLocaleDateString('pt-BR')
                  : 'Não informado';

                return (
                  <button
                    key={produtor.id}
                    onClick={() => {
  setSelectedProdutor(produtor);
  setAtividadesAdicionais(atividadesAdicionaisIniciais);
}}
                    className={`w-full p-4 text-left hover:bg-accent transition-colors ${
                      selectedProdutor?.id === produtor.id
                        ? "bg-accent"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-full mt-1">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {produtor.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          CPF: {produtor.cpf}
                        </p>
                        {trimestre && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {trimestre}º Trimestre
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {dataCadastroFormatada}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground">
              Detalhes do Produtor
            </h3>
          </div>

          <div className="p-6">
            {selectedProdutor ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Nome Completo
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedProdutor.nome}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      CPF
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedProdutor.cpf}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Telefone
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedProdutor.telefone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      E-mail
                    </p>
                    <p className="font-medium text-foreground break-all">
                      {selectedProdutor.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Endereço
                    </p>
                    <p className="font-medium text-foreground">
                      {selectedProdutor.endereco}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedProdutor.cidade} -{" "}
                      {selectedProdutor.estado}
                    </p>
                  </div>
                </div>

                {/* Seção de Atividades Adicionais */}
                <div className="bg-accent/30 border border-border rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Adicionar Atividades ao Atendimento
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Selecione atividades adicionais que deseja incluir neste atendimento
                  </p>

                  <details className="group">
                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors">
                      Agricultura
                    </summary>
                    <div className="mt-3 space-y-2 pl-4">
                      {["Grãos", "Horticultura", "Fruticultura", "Mandioca", "Culturas Industriais"].map((tipo) => (
                        <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={atividadesAdicionais.agricultura.includes(tipo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  agricultura: [...atividadesAdicionais.agricultura, tipo],
                                });
                              } else {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  agricultura: atividadesAdicionais.agricultura.filter((t) => t !== tipo),
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors">
                      Extrativismo
                    </summary>
                    <div className="mt-3 space-y-2 pl-4">
                      {["Produção Florestal de Madeira", "Produção Florestal Não Madeireira", "Extrativismo Vegetal", "Extrativismo Mineral"].map((tipo) => (
                        <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={atividadesAdicionais.extrativismo.includes(tipo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  extrativismo: [...atividadesAdicionais.extrativismo, tipo],
                                });
                              } else {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  extrativismo: atividadesAdicionais.extrativismo.filter((t) => t !== tipo),
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors">
                      Pastagem
                    </summary>
                    <div className="mt-3 space-y-2 pl-4">
                      {["Terra Firme", "Várzea", "Capineira"].map((tipo) => (
                        <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={atividadesAdicionais.pastagem.includes(tipo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  pastagem: [...atividadesAdicionais.pastagem, tipo],
                                });
                              } else {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  pastagem: atividadesAdicionais.pastagem.filter((t) => t !== tipo),
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors">
                      Pesca
                    </summary>
                    <div className="mt-3 space-y-2 pl-4">
                      {["Pesca Artesanal", "Pesca Comercial", "Piscicultura", "Pesca de Subsistência"].map((tipo) => (
                        <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={atividadesAdicionais.pesca.includes(tipo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  pesca: [...atividadesAdicionais.pesca, tipo],
                                });
                              } else {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  pesca: atividadesAdicionais.pesca.filter((t) => t !== tipo),
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </details>

                  <details className="group">
                    <summary className="cursor-pointer font-medium text-foreground hover:text-primary transition-colors">
                      Pecuária
                    </summary>
                    <div className="mt-3 space-y-2 pl-4">
                      {["Bovinocultura", "Avicultura", "Suinocultura", "Apicultura", "Bubalinocultura", "Caprinocultura", "Ovinocultura", "Equinos", "Codorna", "Pato Doméstico", "Meliponicultura"].map((tipo) => (
                        <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={atividadesAdicionais.pecuaria.includes(tipo)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  pecuaria: [...atividadesAdicionais.pecuaria, tipo],
                                });
                              } else {
                                setAtividadesAdicionais({
                                  ...atividadesAdicionais,
                                  pecuaria: atividadesAdicionais.pecuaria.filter((t) => t !== tipo),
                                });
                              }
                            }}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">{tipo}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                </div>

                {possuiAgricultura && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        Atendimento Técnico - Agricultura
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Informe os dados conforme os subtipos
                        agrícolas selecionados
                      </p>
                    </div>

                    {configuracoesAgricultura
                      .filter((item) => item.condicao)
                      .map((tipoAgricultura) => {
                        const lista = Array.isArray(
                          atendimentoData.agricultura?.[
                            tipoAgricultura.key
                          ],
                        )
                          ? atendimentoData.agricultura[
                              tipoAgricultura.key
                            ]
                          : [
                              {
                                cultura: "",
                                areaAssistir: "",
                                areaColher: "",
                                areaAssistida: "",
                                areaColhida: "",
                                numeroBeneficiarios: "",
                                produtividadeMunicipio: "",
                                producaoEsperada: "",
                                producaoObtida: "",
                              },
                            ];

                        return (
                          <div
                            key={tipoAgricultura.key}
                            className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-6"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                                  {tipoAgricultura.titulo}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  Adicione uma ou mais
                                  culturas/linhas de registro
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAtendimentoData({
                                    ...atendimentoData,
                                    agricultura: {
                                      ...atendimentoData.agricultura,
                                      [tipoAgricultura.key]: [
                                        ...lista,
                                        {
                                          cultura: "",
                                          areaAssistir: "",
                                          areaColher: "",
                                          areaAssistida: "",
                                          areaColhida: "",
                                          numeroBeneficiarios:
                                            "",
                                          produtividadeMunicipio:
                                            "",
                                          producaoEsperada: "",
                                          producaoObtida: "",
                                        },
                                      ],
                                    },
                                  });
                                }}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium"
                              >
                                + Adicionar
                              </button>
                            </div>

                            <div className="space-y-4">
                              {lista.map(
                                (item, index: number) => (
                                  <div
                                    key={index}
                                    className="rounded-xl border border-border bg-background/70 p-4 sm:p-5 space-y-5"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <h5 className="text-sm font-semibold text-foreground">
                                        Registro {index + 1}
                                      </h5>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const novaLista =
                                            lista.filter(
                                              (
                                                _,
                                                i: number,
                                              ) => i !== index,
                                            );

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            agricultura: {
                                              ...atendimentoData.agricultura,
                                              [tipoAgricultura.key]:
                                                novaLista.length >
                                                0
                                                  ? novaLista
                                                  : [
                                                      {
                                                        cultura:
                                                          "",
                                                        areaAssistir:
                                                          "",
                                                        areaColher:
                                                          "",
                                                        areaAssistida:
                                                          "",
                                                        areaColhida:
                                                          "",
                                                        numeroBeneficiarios:
                                                          "",
                                                        produtividadeMunicipio:
                                                          "",
                                                        producaoEsperada:
                                                          "",
                                                        producaoObtida:
                                                          "",
                                                      },
                                                    ],
                                            },
                                          });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm"
                                      >
                                        Remover
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Cultura
                                        </label>
                                        <input
                                          type="text"
                                          value={item.cultura}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].cultura =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="Ex: Milho, Banana, Alface..."
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Nº de Beneficiários
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            item.numeroBeneficiarios
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].numeroBeneficiarios =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produtividade do
                                          Município
                                        </label>
                                        <input
                                          type="text"
                                          value={
                                            item.produtividadeMunicipio
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].produtividadeMunicipio =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="Ex: 20 t/ha"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Área a Assistir (ha)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.areaAssistir
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].areaAssistir =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Área a Colher (ha)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.areaColher
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].areaColher =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produção Esperada
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.producaoEsperada
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].producaoEsperada =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Área Assistida (ha)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.areaAssistida
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].areaAssistida =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Área Colhida (ha)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.areaColhida
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].areaColhida =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produção Obtida
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.producaoObtida
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].producaoObtida =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              agricultura: {
                                                ...atendimentoData.agricultura,
                                                [tipoAgricultura.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {possuiPecuaria && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        Atendimento Técnico - Pecuária
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Informe os dados conforme os subtipos
                        pecuários selecionados
                      </p>
                    </div>

                    {configuracoesPecuaria
                      .filter((item) => item.condicao)
                      .map((tipoPecuaria) => {
                        const lista = Array.isArray(
                          atendimentoData.pecuaria?.[
                            tipoPecuaria.key
                          ],
                        )
                          ? atendimentoData.pecuaria[
                              tipoPecuaria.key
                            ]
                          : [
                              {
                                numeroCriadores: "",
                                numeroAnimais: "",
                                sistemaCriacao: "",
                                carne: "",
                                leite: "",
                                queijo: "",
                                ovos: "",
                                producaoObtida: "",
                              },
                            ];

                        return (
                          <div
                            key={tipoPecuaria.key}
                            className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-6"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                                  {tipoPecuaria.titulo}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  Adicione uma ou mais linhas de
                                  registro
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAtendimentoData({
                                    ...atendimentoData,
                                    pecuaria: {
                                      ...atendimentoData.pecuaria,
                                      [tipoPecuaria.key]: [
                                        ...lista,
                                        {
                                          numeroCriadores: "",
                                          numeroAnimais: "",
                                          sistemaCriacao: "",
                                          carne: "",
                                          leite: "",
                                          queijo: "",
                                          ovos: "",
                                          producaoObtida: "",
                                        },
                                      ],
                                    },
                                  });
                                }}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium"
                              >
                                + Adicionar
                              </button>
                            </div>

                            <div className="space-y-4">
                              {lista.map(
                                (item, index: number) => (
                                  <div
                                    key={index}
                                    className="rounded-xl border border-border bg-background/70 p-4 sm:p-5 space-y-5"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <h5 className="text-sm font-semibold text-foreground">
                                        Registro {index + 1}
                                      </h5>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const novaLista =
                                            lista.filter(
                                              (
                                                _,
                                                i: number,
                                              ) => i !== index,
                                            );

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            pecuaria: {
                                              ...atendimentoData.pecuaria,
                                              [tipoPecuaria.key]:
                                                novaLista.length >
                                                0
                                                  ? novaLista
                                                  : [
                                                      {
                                                        numeroCriadores:
                                                          "",
                                                        numeroAnimais:
                                                          "",
                                                        sistemaCriacao:
                                                          "",
                                                        carne:
                                                          "",
                                                        leite:
                                                          "",
                                                        queijo:
                                                          "",
                                                        ovos: "",
                                                        producaoObtida:
                                                          "",
                                                      },
                                                    ],
                                            },
                                          });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm"
                                      >
                                        Remover
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Nº de Criadores
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            item.numeroCriadores
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].numeroCriadores =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Nº de Animais
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            item.numeroAnimais
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].numeroAnimais =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Sistema de Criação
                                        </label>
                                        <input
                                          type="text"
                                          value={
                                            item.sistemaCriacao
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].sistemaCriacao =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="Ex: extensivo, semi-intensivo..."
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Carne
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={item.carne}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].carne =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Leite
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={item.leite}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].leite =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Queijo
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={item.queijo}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].queijo =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Ovos
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={item.ovos}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].ovos =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produção Obtida
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.producaoObtida
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].producaoObtida =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              pecuaria: {
                                                ...atendimentoData.pecuaria,
                                                [tipoPecuaria.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {possuiPiscicultura && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        Atendimento Técnico - Piscicultura
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Informe os dados das atividades de
                        piscicultura
                      </p>
                    </div>

                    {(() => {
                      const lista = Array.isArray(
                        atendimentoData.piscicultura,
                      )
                        ? atendimentoData.piscicultura
                        : [
                            {
                              numeroCriadores: "",
                              numeroInstalacoes: "",
                              tipoSistema: "",
                              areaAlagada: "",
                              numeroPeixesEstocados: "",
                              especie: "",
                              pesoMedio: "",
                              producaoEsperada: "",
                              producaoObtida: "",
                            },
                          ];

                      return (
                        <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-6">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <h4 className="text-base sm:text-lg font-semibold text-foreground">
                                Piscicultura
                              </h4>
                              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                Adicione uma ou mais linhas de
                                registro
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setAtendimentoData({
                                  ...atendimentoData,
                                  piscicultura: [
                                    ...lista,
                                    {
                                      numeroCriadores: "",
                                      numeroInstalacoes: "",
                                      tipoSistema: "",
                                      areaAlagada: "",
                                      numeroPeixesEstocados: "",
                                      especie: "",
                                      pesoMedio: "",
                                      producaoEsperada: "",
                                      producaoObtida: "",
                                    },
                                  ],
                                });
                              }}
                              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium"
                            >
                              + Adicionar
                            </button>
                          </div>

                          <div className="space-y-4">
                            {lista.map(
                              (item, index: number) => (
                                <div
                                  key={index}
                                  className="rounded-xl border border-border bg-background/70 p-4 sm:p-5 space-y-5"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <h5 className="text-sm font-semibold text-foreground">
                                      Registro {index + 1}
                                    </h5>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        const novaLista =
                                          lista.filter(
                                            (
                                              _,
                                              i: number,
                                            ) => i !== index,
                                          );

                                        setAtendimentoData({
                                          ...atendimentoData,
                                          piscicultura:
                                            novaLista.length > 0
                                              ? novaLista
                                              : [
                                                  {
                                                    numeroCriadores:
                                                      "",
                                                    numeroInstalacoes:
                                                      "",
                                                    tipoSistema:
                                                      "",
                                                    areaAlagada:
                                                      "",
                                                    numeroPeixesEstocados:
                                                      "",
                                                    especie: "",
                                                    pesoMedio:
                                                      "",
                                                    producaoEsperada:
                                                      "",
                                                    producaoObtida:
                                                      "",
                                                  },
                                                ],
                                        });
                                      }}
                                      className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm"
                                    >
                                      Remover
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Nº de Criadores
                                      </label>
                                      <input
                                        type="number"
                                        value={
                                          item.numeroCriadores
                                        }
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].numeroCriadores =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Nº de Instalações
                                      </label>
                                      <input
                                        type="number"
                                        value={
                                          item.numeroInstalacoes
                                        }
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].numeroInstalacoes =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Tipo de Sistema
                                      </label>
                                      <input
                                        type="text"
                                        value={item.tipoSistema}
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].tipoSistema =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="Ex: viveiro escavado, barragem..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Área Alagada
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={item.areaAlagada}
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].areaAlagada =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Nº de Peixes Estocados
                                      </label>
                                      <input
                                        type="number"
                                        value={
                                          item.numeroPeixesEstocados
                                        }
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].numeroPeixesEstocados =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Espécie
                                      </label>
                                      <input
                                        type="text"
                                        value={item.especie}
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].especie =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="Ex: Tambaqui"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Peso Médio (kg)
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={item.pesoMedio}
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].pesoMedio =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Produção Esperada
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={
                                          item.producaoEsperada
                                        }
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].producaoEsperada =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>

                                    <div className="space-y-2">
                                      <label className="text-sm font-medium text-foreground">
                                        Produção Obtida
                                      </label>
                                      <input
                                        type="number"
                                        step="0.01"
                                        value={
                                          item.producaoObtida
                                        }
                                        onChange={(e) => {
                                          const novaLista = [
                                            ...lista,
                                          ];
                                          novaLista[
                                            index
                                          ].producaoObtida =
                                            e.target.value;

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            piscicultura:
                                              novaLista,
                                          });
                                        }}
                                        placeholder="0.00"
                                        className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
                {(possuiApicultura ||
                  possuiMeliponicultura) && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        Atendimento Técnico - Apicultura /
                        Meliponicultura
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Informe os dados conforme os subtipos
                        selecionados
                      </p>
                    </div>

                    {configuracoesApicultura
                      .filter((item) => item.condicao)
                      .map((tipoApi) => {
                        const lista = Array.isArray(
                          atendimentoData.apicultura?.[
                            tipoApi.key
                          ],
                        )
                          ? atendimentoData.apicultura[
                              tipoApi.key
                            ]
                          : [
                              {
                                numeroCriadores: "",
                                numeroColmeias: "",
                                especie: "",
                                producaoMel: "",
                                producaoPolen: "",
                                producaoPropolis: "",
                                melRegularizado: "",
                                polenRegularizado: "",
                                propolisRegularizado: "",
                              },
                            ];

                        return (
                          <div
                            key={tipoApi.key}
                            className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-6"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                                  {tipoApi.titulo}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  Adicione uma ou mais linhas de
                                  registro
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAtendimentoData({
                                    ...atendimentoData,
                                    apicultura: {
                                      ...atendimentoData.apicultura,
                                      [tipoApi.key]: [
                                        ...lista,
                                        {
                                          numeroCriadores: "",
                                          numeroColmeias: "",
                                          especie: "",
                                          producaoMel: "",
                                          producaoPolen: "",
                                          producaoPropolis: "",
                                          melRegularizado: "",
                                          polenRegularizado: "",
                                          propolisRegularizado:
                                            "",
                                        },
                                      ],
                                    },
                                  });
                                }}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium"
                              >
                                + Adicionar
                              </button>
                            </div>

                            <div className="space-y-4">
                              {lista.map(
                                (item, index: number) => (
                                  <div
                                    key={index}
                                    className="rounded-xl border border-border bg-background/70 p-4 sm:p-5 space-y-5"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <h5 className="text-sm font-semibold text-foreground">
                                        Registro {index + 1}
                                      </h5>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const novaLista =
                                            lista.filter(
                                              (
                                                _,
                                                i: number,
                                              ) => i !== index,
                                            );

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            apicultura: {
                                              ...atendimentoData.apicultura,
                                              [tipoApi.key]:
                                                novaLista.length >
                                                0
                                                  ? novaLista
                                                  : [
                                                      {
                                                        numeroCriadores:
                                                          "",
                                                        numeroColmeias:
                                                          "",
                                                        especie:
                                                          "",
                                                        producaoMel:
                                                          "",
                                                        producaoPolen:
                                                          "",
                                                        producaoPropolis:
                                                          "",
                                                        melRegularizado:
                                                          "",
                                                        polenRegularizado:
                                                          "",
                                                        propolisRegularizado:
                                                          "",
                                                      },
                                                    ],
                                            },
                                          });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm"
                                      >
                                        Remover
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Nº de Criadores /
                                          Apicultores
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            item.numeroCriadores
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].numeroCriadores =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Nº de Colmeias
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            item.numeroColmeias
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].numeroColmeias =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Espécie / Tipo de
                                          Abelha
                                        </label>
                                        <input
                                          type="text"
                                          value={item.especie}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].especie =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="Ex: Apis mellifera, Jandaíra..."
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produção de Mel (kg)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.producaoMel
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].producaoMel =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produção de Pólen (kg)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.producaoPolen
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].producaoPolen =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produção de Própolis
                                          (kg)
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.producaoPropolis
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].producaoPropolis =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Mel Regularizado
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.melRegularizado
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].melRegularizado =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Pólen Regularizado
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.polenRegularizado
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].polenRegularizado =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Própolis Regularizado
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.propolisRegularizado
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].propolisRegularizado =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              apicultura: {
                                                ...atendimentoData.apicultura,
                                                [tipoApi.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {(possuiMadeira ||
                  possuiNaoMadeireira ||
                  possuiExtrativismoVegetal ||
                  possuiExtrativismoMineral ||
                   possuiExtrativismo ) && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        Atendimento Técnico - Extrativismo
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Informe os dados conforme os subtipos de
                        extrativismo selecionados
                      </p>
                    </div>

                    {configuracoesExtrativismo
                      .filter((item) => item.condicao)
                      .map((tipoExtrativismo) => {
                        const lista = Array.isArray(
                          atendimentoData.extrativismo?.[
                            tipoExtrativismo.key
                          ],
                        )
                          ? atendimentoData.extrativismo[
                              tipoExtrativismo.key
                            ]
                          : [
                              {
                                produto: "",
                                unidade: "",
                                numeroExtrativistas: "",
                                quantidadeEsperada: "",
                                quantidadeObtida: "",
                              },
                            ];

                        return (
                          <div
                            key={tipoExtrativismo.key}
                            className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-6"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <h4 className="text-base sm:text-lg font-semibold text-foreground">
                                  {tipoExtrativismo.titulo}
                                </h4>
                                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  Adicione uma ou mais linhas de
                                  registro
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setAtendimentoData({
                                    ...atendimentoData,
                                    extrativismo: {
                                      ...atendimentoData.extrativismo,
                                      [tipoExtrativismo.key]: [
                                        ...lista,
                                        {
                                          produto: "",
                                          unidade: "",
                                          numeroExtrativistas:
                                            "",
                                          quantidadeEsperada:
                                            "",
                                          quantidadeObtida: "",
                                        },
                                      ],
                                    },
                                  });
                                }}
                                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all text-sm font-medium"
                              >
                                + Adicionar
                              </button>
                            </div>

                            <div className="space-y-4">
                              {lista.map(
                                (item, index: number) => (
                                  <div
                                    key={index}
                                    className="rounded-xl border border-border bg-background/70 p-4 sm:p-5 space-y-5"
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <h5 className="text-sm font-semibold text-foreground">
                                        Registro {index + 1}
                                      </h5>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          const novaLista =
                                            lista.filter(
                                              (
                                                _,
                                                i: number,
                                              ) => i !== index,
                                            );

                                          setAtendimentoData({
                                            ...atendimentoData,
                                            extrativismo: {
                                              ...atendimentoData.extrativismo,
                                              [tipoExtrativismo.key]:
                                                novaLista.length >
                                                0
                                                  ? novaLista
                                                  : [
                                                      {
                                                        produto:
                                                          "",
                                                        unidade:
                                                          "",
                                                        numeroExtrativistas:
                                                          "",
                                                        quantidadeEsperada:
                                                          "",
                                                        quantidadeObtida:
                                                          "",
                                                      },
                                                    ],
                                            },
                                          });
                                        }}
                                        className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all text-sm"
                                      >
                                        Remover
                                      </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Produto
                                        </label>
                                        <input
                                          type="text"
                                          value={item.produto}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].produto =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              extrativismo: {
                                                ...atendimentoData.extrativismo,
                                                [tipoExtrativismo.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="Ex: Açaí, Andiroba, Castanha..."
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Unidade
                                        </label>
                                        <input
                                          type="text"
                                          value={item.unidade}
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].unidade =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              extrativismo: {
                                                ...atendimentoData.extrativismo,
                                                [tipoExtrativismo.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="Ex: kg, t, saca, hl..."
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Nº de Extrativistas
                                        </label>
                                        <input
                                          type="number"
                                          value={
                                            item.numeroExtrativistas
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].numeroExtrativistas =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              extrativismo: {
                                                ...atendimentoData.extrativismo,
                                                [tipoExtrativismo.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Quantidade Esperada
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.quantidadeEsperada
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].quantidadeEsperada =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              extrativismo: {
                                                ...atendimentoData.extrativismo,
                                                [tipoExtrativismo.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>

                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-foreground">
                                          Quantidade Obtida
                                        </label>
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={
                                            item.quantidadeObtida
                                          }
                                          onChange={(e) => {
                                            const novaLista = [
                                              ...lista,
                                            ];
                                            novaLista[
                                              index
                                            ].quantidadeObtida =
                                              e.target.value;

                                            setAtendimentoData({
                                              ...atendimentoData,
                                              extrativismo: {
                                                ...atendimentoData.extrativismo,
                                                [tipoExtrativismo.key]:
                                                  novaLista,
                                              },
                                            });
                                          }}
                                          placeholder="0.00"
                                          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
               {possuiPesca && (
  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
        Atendimento Técnico - Pesca
      </h3>

      <p className="text-sm text-muted-foreground mt-1">
        Informe os dados das atividades de pesca
      </p>
    </div>

    {possuiBarragem && (
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <h4 className="font-semibold">
          Barragem
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nº Peixe Estocado (mil)"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Espécies de Peixes"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Nº Instalações"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Área Alagada/ha"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Produção/Ton"
            className="w-full px-4 py-2 rounded-xl border"
          />
        </div>
      </div>
    )}

    {possuiTanqueEscavado && (
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <h4 className="font-semibold">
          Tanque Escavado
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nº Peixe Estocado (mil)"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Espécies de Peixes"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Nº Instalações"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Área Alagada/ha"
            className="w-full px-4 py-2 rounded-xl border"
          />

          <input
            type="text"
            placeholder="Produção/Ton"
            className="w-full px-4 py-2 rounded-xl border"
          />
        </div>
      </div>
    )}

    {possuiCanalIgarape && (
      <div className="rounded-2xl border border-border bg-muted/20 p-5">
        <h4 className="font-semibold">
          Canal de Igarapé
        </h4>
      </div>
    )}

    {possuiTanqueRede && (
      <div className="rounded-2xl border border-border bg-muted/20 p-5">
        <h4 className="font-semibold">
          Tanque Rede
        </h4>
      </div>
    )}

    {possuiPescaArtesanal && (
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <h4 className="font-semibold">
          Pesca Artesanal / KG
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num}>
              <input
                type="text"
                placeholder={`Espécie ${num}`}
                className="w-full px-4 py-2 rounded-xl border"
              />

              <input
                type="text"
                placeholder="KG"
                className="w-full px-4 py-2 rounded-xl border"
              />
            </div>
          ))}
        </div>
      </div>
    )}

    {possuiPescaManejada && (
      <div className="rounded-2xl border border-border bg-muted/20 p-5 space-y-4">
        <h4 className="font-semibold">
          Pesca Manejada / KG
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <input
                type="text"
                placeholder={`Espécie ${num}`}
                className="w-full px-4 py-2 rounded-xl border"
              />

              <input
                type="text"
                placeholder="KG"
                className="w-full px-4 py-2 rounded-xl border"
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
)}
                {possuiPastagem && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
                    {/* Header */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                        Atendimento Técnico - Pastagem
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Informe os dados das áreas de pastagem
                        conforme os subtipos selecionados
                      </p>
                    </div>

                    {/* Terra Firme */}
                    {possuiPastagemTerraFirme && (
                      <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-5">
                        <h4 className="text-base sm:text-lg font-semibold text-foreground">
                          Terra Firme
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                              Área Programada (ha)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={
                                atendimentoData.pastagem
                                  ?.terraFirme
                                  ?.areaProgramada || ""
                              }
                              onChange={(e) =>
                                setAtendimentoData({
                                  ...atendimentoData,
                                  pastagem: {
                                    ...atendimentoData.pastagem,
                                    terraFirme: {
                                      ...atendimentoData
                                        .pastagem?.terraFirme,
                                      areaProgramada:
                                        e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="0.00"
                              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                              Área Realizada (ha)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={
                                atendimentoData.pastagem
                                  ?.terraFirme?.areaRealizada ||
                                ""
                              }
                              onChange={(e) =>
                                setAtendimentoData({
                                  ...atendimentoData,
                                  pastagem: {
                                    ...atendimentoData.pastagem,
                                    terraFirme: {
                                      ...atendimentoData
                                        .pastagem?.terraFirme,
                                      areaRealizada:
                                        e.target.value,
                                    },
                                  },
                                })
                              }
                              placeholder="0.00"
                              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Várzea */}
                    {possuiPastagemVarzea && (
                      <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-5">
                        <h4 className="text-base sm:text-lg font-semibold text-foreground">
                          Várzea
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="number"
                            step="0.01"
                            value={
                              atendimentoData.pastagem?.varzea
                                ?.areaProgramada || ""
                            }
                            onChange={(e) =>
                              setAtendimentoData({
                                ...atendimentoData,
                                pastagem: {
                                  ...atendimentoData.pastagem,
                                  varzea: {
                                    ...atendimentoData.pastagem
                                      ?.varzea,
                                    areaProgramada:
                                      e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="Área Programada"
                            className="input"
                          />

                          <input
                            type="number"
                            step="0.01"
                            value={
                              atendimentoData.pastagem?.varzea
                                ?.areaRealizada || ""
                            }
                            onChange={(e) =>
                              setAtendimentoData({
                                ...atendimentoData,
                                pastagem: {
                                  ...atendimentoData.pastagem,
                                  varzea: {
                                    ...atendimentoData.pastagem
                                      ?.varzea,
                                    areaRealizada:
                                      e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="Área Realizada"
                            className="input"
                          />
                        </div>
                      </div>
                    )}

                    {/* Capineira */}
                    {possuiCapineira && (
                      <div className="rounded-2xl border border-border bg-muted/20 p-5 sm:p-6 space-y-5">
                        <h4 className="text-base sm:text-lg font-semibold text-foreground">
                          Capineira
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="number"
                            step="0.01"
                            value={
                              atendimentoData.pastagem
                                ?.capineira?.areaProgramada ||
                              ""
                            }
                            onChange={(e) =>
                              setAtendimentoData({
                                ...atendimentoData,
                                pastagem: {
                                  ...atendimentoData.pastagem,
                                  capineira: {
                                    ...atendimentoData.pastagem
                                      ?.capineira,
                                    areaProgramada:
                                      e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="Área Programada"
                            className="input"
                          />

                          <input
                            type="number"
                            step="0.01"
                            value={
                              atendimentoData.pastagem
                                ?.capineira?.areaRealizada || ""
                            }
                            onChange={(e) =>
                              setAtendimentoData({
                                ...atendimentoData,
                                pastagem: {
                                  ...atendimentoData.pastagem,
                                  capineira: {
                                    ...atendimentoData.pastagem
                                      ?.capineira,
                                    areaRealizada:
                                      e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="Área Realizada"
                            className="input"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!selectedProdutor) return;

                    const atendimentos = JSON.parse(
                      localStorage.getItem("atendimentos") ||
                        "[]",
                    );

                    const usuarioLogado = JSON.parse(
                      localStorage.getItem("usuarioLogado") ||
                        "null",
                    );

                    const novoAtendimento = {
                      id: Date.now().toString(),
                      produtorId: selectedProdutor.id,
                      produtorNome: selectedProdutor.nome,
                      produtorCpf: selectedProdutor.cpf || "",
                      atendidoPorId: usuarioLogado?.id || "",
                      atendidoPorNome:
                        usuarioLogado?.nome || "",
                      atendidoPorEmail:
                        usuarioLogado?.email || "",
                      atendidoPorTipo:
                        usuarioLogado?.tipo || "tecnico",
                      tecnicoResponsavel:
                        usuarioLogado?.nome || "",
                      data: new Date().toISOString(),
                      dados: atendimentoData,
                      atividadesAdicionais: atividadesAdicionais,
                    };

                    const novaLista = [
                      novoAtendimento,
                      ...atendimentos,
                    ];

                    localStorage.setItem(
                      "atendimentos",
                      JSON.stringify(novaLista),
                    );

                    setUltimoAtendimentoSalvo(novoAtendimento);

                    alert("Atendimento salvo com sucesso!");
                  }}
                  className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90"
                >
                  Salvar Atendimento
                </button>
                {ultimoAtendimentoSalvo && (
                  <button
                    onClick={handlePrint}
                    className="mt-4 ml-4 px-6 py-3 border border-border rounded-lg hover:bg-accent"
                  >
                    Gerar Documento / Imprimir
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>
                  Selecione um produtor para ver os detalhes
                </p>
              </div>
            )}
            {ultimoAtendimentoSalvo && selectedProdutor && (
              <div className="mt-8 bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  Preview do Documento de Atendimento
                </h3>

                <div className="overflow-auto border rounded-lg bg-gray-100 p-4">
                  <div ref={componentRef}>
                    <AtendimentoDocumento
                      produtor={selectedProdutor}
                      atendimento={ultimoAtendimentoSalvo.dados}
                      atividadesAdicionais={ultimoAtendimentoSalvo.atividadesAdicionais}
                      tecnicoResponsavel={
                        ultimoAtendimentoSalvo.tecnicoResponsavel
                      }
                      data={ultimoAtendimentoSalvo.data}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}