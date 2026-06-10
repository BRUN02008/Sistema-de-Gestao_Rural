import { useState } from "react";
import { ChevronRight, ChevronLeft, Check, Search, Edit, X, Plus, User } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import {
  CulturasAgricolasList,
  type CulturaAgricola,
} from "./CulturasAgricolasList";
import { DadosCarteira } from "./DadosCarteira";
import { SistemaCriacaoAnimal } from "./SistemaCriacaoAnimal";
import {
  MeliponiculturaList,
  type AbelhaItem,
} from "./MeliponiculturaList";

interface CadastroProdutorFormData {
  cadastradoPorId?: string;
  cadastradoPorNome?: string;
  cadastradoPorEmail?: string;
  cadastradoPorTipo?: "adm" | "tecnico";
  dataCadastro?: string;
  dataAtualizacao?: string;
  // ================== DADOS PESSOAIS ==================
  nome: string;
  cpf: string;
  rg: string;
  orgaoExpedidor: string;
  dataNascimento: string;
  nacionalidade: string;
  municipioNascimento: string;
  telefone: string;
  grauInstrucao: string;
  estadoCivil: string;
  raca: string;
  sexo: string;
  publico: string; // Homem, Mulher, Jovem

  // ================== ENDEREÇO ==================
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
  codigoMunicipio: string;
  cep: string;

  // ================== LOCALIZAÇÃO ==================
  tipoLocalizacao: string;
  especificacaoLocalizacao: string; // Nova descrição detalhada
  acessoLocalizacao?: string;
  km: string;
  margem: string;
  tipoCoordenada: string; // "decimal" ou "geografica"
  latitude: string;
  longitude: string;
  latitudeGraus?: string;
  latitudeMinutos?: string;
  latitudeSegundos?: string;
  latitudeDirecao?: string;
  longitudeGraus?: string;
  longitudeMinutos?: string;
  longitudeSegundos?: string;
  longitudeDirecao?: string;
  comunidade: string;

  // ================== PERFIL ==================
  perfil: string[];
  situacaoImovel: string;
  caracteristicas: string[];
  tipoArea: string; // Nova propriedade para tipo de área

  // ================== ATIVIDADES ==================
  atividades: {
    categoria: string;
    tipos: string[];
  }[];

  atividadePrincipal: string;
  atividadeSecundaria: string;
  outrasProducoes: string;
  outrasInformacoesAtividades: string; // Outras informações sobre atividades

  // ================== PASTAGEM ==================
  pastagemTerraFirme: string;
  pastagemVarzea: string;
  pastagemCapineira: string;
  descricaoPastagem: string; // Descrição detalhada da pastagem

  // ================== ÁREA ==================
  nomeImovel: string;
  areaTotal: string;
  areaEstado: string;
  areaOutroEstado: string;
  areaAgricultura: string;
  areaPastagem: string;
  areaArrendada: string;
  areaParceria: string;

  // ================== EXTRATIVISMO ==================
  numeroExtrativistas: string;
  numeroPmfspe: string;
  numeroPmfspeRegularizado: string;
  novoPoe: string;
  posExploratorio: string;
  areaTotalPlanos: string;
  volumeTotal: string;
  volumeRegularizado: string;
  volumePotencial: string;

  // ================== PESCA ==================
  tipoPesca: string;
  rgPesca: string;
  protocoloRgp: string;
  localPesca: string;
  margemPesca: string;
  producaoTotal: string;
  especies: { nome: string; kg: string }[];

  // Piscicultura
  tipoSistema: string;
  areaPiscicultura: string;
  numeroPeixes: string;
  producaoPiscicultura: string;

  // Apicultura
  abelhas: AbelhaItem[];

  // Extrativismo melhorado
  produtoExtrativista: string;
  quantidadeExtrativismo: string;

  // Pecuária
  pecuaria: Array<{
    tipo: string;
    quantidade: string;
    unidade: string; // "cabeças" ou "aves"
  }>;

  sistemaCriacao: string;
  informacoesPecuariaPos: string; // Informações em Pós para pecuária
  // Lavoura
  culturaPrincipal: string;
  areaPlantada: string;
  areaAssistida: string;
  areaColhida: string;
  producaoObtidaAgricultura: string;
  culturasAgricolas?: CulturaAgricola[];
  producaoOrganica?: boolean;
  paa?: {
    participa: boolean;
    perfil: string;
    propriedade: string;
    observacoes: string;
  };

  // Extrativismo (se quiser completar também)
  produtoExtraido: string;
  producaoAnual: string;

  producaoFlorestal: Array<{
    produto: string;
    quantidade: string;
    unidade: string;
  }>;

  possuiSistemaAgroflorestal: boolean;
  numeroPlantasAcai: string;
  numeroPlantasBanana: string;
  numeroPlantasCastanha: string;
  numeroPlantasCacau: string;

  // ================== REGISTRO ==================
  anoEmissao: string;
  codigoUnloc: string;
  codigoRgp: string;
  municipioUf: string;
  dataRegistro: string;
  tipoSolicitacao: string;

  situacaoProdutor: string;

  possuiCaf: boolean;
  numeroCaf: string;
  vencimentoCaf: string;

  possuiCar: boolean;
  numeroCar: string;
  dataInscricaoCar: string;

  possuiCarteiraProdutor: boolean;
  numeroCarteiraProdutor: string;
  vencimentoCarteiraProdutor: string;
  carteiraProdutor?: {
    numero: string;
    emissao: string;
    vencimento: string;
    orgaoEmissor: string;
    observacoes: string;
  };
  avicultura?: {
    especies: string[];
    sistemaCriacao: string;
    quantidade: string;
    organica: boolean;
    observacoes: string;
  };

  // ================== DOCUMENTOS ==================
  documentos: {
    nome: string;
    tipo: string;
    base64: string;
  }[];

  // ================== SUPERVISÃO ==================
  observacoesBeneficiario: string;
  declaracaoBeneficiario: boolean;
  resultadoSupervisao: string;
  encaminhamentos: string;
  tipoEncaminhamento: string;
  observacoesTecnico: string;

  // ================== RESPONSÁVEIS ==================
  tecnicoResponsavel: string;
  numeroConselho: string;
  gerente: string;
  conselhoGerente: string;
  observacoes: string;
}

interface Produtor extends CadastroProdutorFormData {
  id: string;
  dataAtualizacao?: string;
  // ================== DADOS PESSOAIS ==================
  nome: string;
  cpf: string;
  rg: string;
  orgaoExpedidor: string;
  dataNascimento: string;
  nacionalidade: string;
  municipioNascimento: string;
  telefone: string;
  grauInstrucao: string;
  estadoCivil: string;
  raca: string;
  sexo: string;
  publico: string; // Homem, Mulher, Jovem

  // ================== ENDEREÇO ==================
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
  codigoMunicipio: string;
  cep: string;

  // ================== LOCALIZAÇÃO ==================
  tipoLocalizacao: string;
  especificacaoLocalizacao: string; // Nova descrição detalhada
  km: string;
  margem: string;
  tipoCoordenada: string; // "decimal" ou "geografica"
  latitude: string;
  longitude: string;
  latitudeGraus?: string;
  latitudeMinutos?: string;
  latitudeSegundos?: string;
  latitudeDirecao?: string;
  longitudeGraus?: string;
  longitudeMinutos?: string;
  longitudeSegundos?: string;
  longitudeDirecao?: string;
  comunidade: string;

  // ================== PERFIL ==================
  perfil: string[];
  situacaoImovel: string;
  caracteristicas: string[];
  tipoArea: string; // Nova propriedade para tipo de área

  // ================== ATIVIDADES ==================
  atividades: {
    categoria: string;
    tipos: string[];
  }[];

  atividadePrincipal: string;
  atividadeSecundaria: string;
  outrasProducoes: string;
  outrasInformacoesAtividades: string; // Outras informações sobre atividades

  // ================== PASTAGEM ==================
  pastagemTerraFirme: string;
  pastagemVarzea: string;
  pastagemCapineira: string;
  descricaoPastagem: string; // Descrição detalhada da pastagem

  // ================== ÁREA ==================
  nomeImovel: string;
  areaTotal: string;
  areaEstado: string;
  areaOutroEstado: string;
  areaAgricultura: string;
  areaPastagem: string;
  areaArrendada: string;
  areaParceria: string;

  // ================== EXTRATIVISMO ==================
  numeroExtrativistas: string;
  numeroPmfspe: string;
  numeroPmfspeRegularizado: string;
  novoPoe: string;
  posExploratorio: string;
  areaTotalPlanos: string;
  volumeTotal: string;
  volumeRegularizado: string;
  volumePotencial: string;

  // ================== PESCA ==================
  tipoPesca: string;
  rgPesca: string;
  protocoloRgp: string;
  localPesca: string;
  margemPesca: string;
  producaoTotal: string;
  especies: { nome: string; kg: string }[];

  // Piscicultura
  tipoSistema: string;
  areaPiscicultura: string;
  numeroPeixes: string;
  producaoPiscicultura: string;

  // Apicultura
  abelhas: AbelhaItem[];

  // Extrativismo melhorado
  produtoExtrativista: string;
  quantidadeExtrativismo: string;

  // Pecuária
  pecuaria: Array<{
    tipo: string;
    quantidade: string;
    unidade: string; // "cabeças" ou "aves"
  }>;

  sistemaCriacao: string;
  informacoesPecuariaPos: string; // Informações em Pós para pecuária
  // Lavoura
  culturaPrincipal: string;
  areaPlantada: string;
  areaAssistida: string;
  areaColhida: string;
  producaoObtidaAgricultura: string;

  // Extrativismo (se quiser completar também)
  produtoExtraido: string;
  producaoAnual: string;

  producaoFlorestal: Array<{
    produto: string;
    quantidade: string;
    unidade: string;
  }>;

  possuiSistemaAgroflorestal: boolean;
  numeroPlantasAcai: string;
  numeroPlantasBanana: string;
  numeroPlantasCastanha: string;
  numeroPlantasCacau: string;

  // ================== REGISTRO ==================
  anoEmissao: string;
  codigoUnloc: string;
  codigoRgp: string;
  municipioUf: string;
  dataRegistro: string;
  tipoSolicitacao: string;

  situacaoProdutor: string;

  possuiCaf: boolean;
  numeroCaf: string;
  vencimentoCaf: string;

  possuiCar: boolean;
  numeroCar: string;
  dataInscricaoCar: string;

  possuiCarteiraProdutor: boolean;
  numeroCarteiraProdutor: string;
  vencimentoCarteiraProdutor: string;

  // ================== SUPERVISÃO ==================
  observacoesBeneficiario: string;
  declaracaoBeneficiario: boolean;
  resultadoSupervisao: string;
  encaminhamentos: string;
  tipoEncaminhamento: string;
  observacoesTecnico: string;

  // ================== RESPONSÁVEIS ==================
  tecnicoResponsavel: string;
  numeroConselho: string;
  gerente: string;
  conselhoGerente: string;
  observacoes: string;
}

interface Documento {
  nome: string;
  tipo: string;
  base64: string;
}

export default function CadastroProdutor() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [produtorEmEdicaoId, setProdutorEmEdicaoId] =
  useState<string | null>(null);
  const [buscaProdutor, setBuscaProdutor] = useState("");
  const [mostrarListaProdutores, setMostrarListaProdutores] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const totalSteps = 6;
  const [formData, setFormData] =
    useState<CadastroProdutorFormData>({
      nome: "",
      cpf: "",
      rg: "",
      orgaoExpedidor: "",
      dataNascimento: "",
      nacionalidade: "Brasileira",
      municipioNascimento: "",
      telefone: "",
      grauInstrucao: "",
      estadoCivil: "",
      raca: "",
      sexo: "",
      publico: "",
      logradouro: "",
      bairro: "",
      municipio: "",
      uf: "",
      codigoMunicipio: "",
      cep: "",
      tipoLocalizacao: "",
      especificacaoLocalizacao: "",
      acessoLocalizacao: "",
      km: "",
      margem: "",
      tipoCoordenada: "decimal",
      latitude: "",
      longitude: "",
      latitudeGraus: "",
      latitudeMinutos: "",
      latitudeSegundos: "",
      latitudeDirecao: "S",
      longitudeGraus: "",
      longitudeMinutos: "",
      longitudeSegundos: "",
      longitudeDirecao: "W",
      comunidade: "",
      perfil: [],
      atividades: [],
      situacaoImovel: "",
      caracteristicas: [],
      nomeImovel: "",
      areaTotal: "",
      areaEstado: "",
      areaOutroEstado: "",
      areaAgricultura: "",
      areaPastagem: "",
      areaArrendada: "",
      areaParceria: "",
      atividadePrincipal: "",
      atividadeSecundaria: "",
      outrasProducoes: "",
      outrasInformacoesAtividades: "",
      observacoesBeneficiario: "",
      producaoFlorestal: [
        { produto: "", quantidade: "", unidade: "" },
      ],
      tipoArea: "",
      possuiSistemaAgroflorestal: false,
      numeroPlantasAcai: "",
      numeroPlantasBanana: "",
      numeroPlantasCastanha: "",
      numeroPlantasCacau: "",
      declaracaoBeneficiario: false,
      resultadoSupervisao: "",
      encaminhamentos: "",
      tipoEncaminhamento: "",
      observacoesTecnico: "",
      tipoPesca: "",
      rgPesca: "",
      protocoloRgp: "",
      localPesca: "",
      margemPesca: "",
      producaoTotal: "",
      especies: [
        { nome: "", kg: "" },
        { nome: "", kg: "" },
        { nome: "", kg: "" },
        { nome: "", kg: "" },
        { nome: "", kg: "" },
      ],
      anoEmissao: "2026",
      codigoUnloc: "",
      codigoRgp: "",
      municipioUf: "",
      dataRegistro: "",
      tipoSolicitacao: "",
      tecnicoResponsavel: "",
      numeroConselho: "",
      gerente: "",
      conselhoGerente: "",
      observacoes: "",
      documentos: [],
      numeroExtrativistas: "",
      numeroPmfspe: "",
      numeroPmfspeRegularizado: "",
      novoPoe: "",
      posExploratorio: "",
      areaTotalPlanos: "",
      volumeTotal: "",
      volumeRegularizado: "",
      volumePotencial: "",
      // Piscicultura
      tipoSistema: "",
      areaPiscicultura: "",
      numeroPeixes: "",
      producaoPiscicultura: "",

      pecuaria: [],

      // Apicultura / Meliponicultura
      abelhas: [
        {
          nomecientifico: "",
          tipo: "",
          numeroColmeias: "",
          producaoMel: "",
          producaoPolen: "",
          producaoPropolis: "",
        },
      ],

      // Extrativismo melhorado
      produtoExtrativista: "",
      quantidadeExtrativismo: "",

      pastagemTerraFirme: "",
      pastagemVarzea: "",
      pastagemCapineira: "",
      descricaoPastagem: "",

      situacaoProdutor: "",
      possuiCaf: false,
      numeroCaf: "",
      vencimentoCaf: "",
      possuiCar: false,
      numeroCar: "",
      dataInscricaoCar: "",
      possuiCarteiraProdutor: false,
      numeroCarteiraProdutor: "",
      vencimentoCarteiraProdutor: "",

      culturaPrincipal: "",
      areaPlantada: "",
      areaAssistida: "",
      areaColhida: "",
      producaoObtidaAgricultura: "",
      culturasAgricolas: [],
      producaoOrganica: false,
      paa: {
        participa: false,
        perfil: "",
        propriedade: "",
        observacoes: "",
      },
      carteiraProdutor: {
        numero: "",
        emissao: "",
        vencimento: "",
        orgaoEmissor: "",
        observacoes: "",
      },
      avicultura: {
        especies: [],
        sistemaCriacao: "",
        quantidade: "",
        organica: false,
        observacoes: "",
      },
      sistemaCriacao: "",
      informacoesPecuariaPos: "",
      produtoExtraido: "",
      producaoAnual: "",
    });
  const subatividades = {
    Agricultura: [
      "Mandioca",
      "Grãos",
      "Horticultura",
      "Fruticultura",
      "Culturas Industriais",
      "Outras Culturas",
    ],
    Pecuaria: [
      "Bovinocultura",
      "Avicultura",
      "Galinha",
      "Pato",
      "Codorna",
      "Suinocultura",

      "Apicultura",
      "Bubalinocultura",
      "Caprinocultura",
      "Ovinocultura",
      "Equinos",
      "Pato Doméstico",
      "Meliponicultura",
    ],
    Pesca: [
      "Pesca Artesanal",
      "Pesca Comercial",
      "Piscicultura",
      "Pesca de Subsistência",
    ],
    Extrativismo: [
      "Produção Florestal de Madeira",
      "Produção Florestal Não Madeireira",
      "Extrativismo Vegetal",
      "Extrativismo Mineral",
    ],
    Pastagem: ["Terra Firme", "Várzea", "Capineira"],
  };

  const limparCpf = (valor: string) => valor.replace(/\D/g, "");

  const carregarProdutores = (): Produtor[] => {
    try {
      return JSON.parse(localStorage.getItem("produtores") || "[]");
    } catch {
      return [];
    }
  };

  const tiposSelecionados = formData.atividades.flatMap(
    (atividade) => atividade.tipos,
  );
  const handleCategoriaChange = (categoria: string) => {
    setFormData((prev) => {
      const existe = prev.atividades.some(
        (a) => a.categoria === categoria,
      );

      return {
        ...prev,
        atividades: existe
          ? prev.atividades.filter(
              (a) => a.categoria !== categoria,
            )
          : [...prev.atividades, { categoria, tipos: [] }],
      };
    });
  };
  const handleTipoChange = (
    categoria: string,
    tipo: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      atividades: prev.atividades.map((a) => {
        if (a.categoria !== categoria) return a;

        const existe = a.tipos.includes(tipo);

        return {
          ...a,
          tipos: existe
            ? a.tipos.filter((t) => t !== tipo)
            : [...a.tipos, tipo],
        };
      }),
    }));
  };

  const possuiPescaSubsistencia = tiposSelecionados.includes(
    "Pesca de Subsistência",
  );
  const possuiPescaComercial = tiposSelecionados.includes(
    "Pesca Comercial",
  );
  const possuiPescaArtesanal = tiposSelecionados.includes(
    "Pesca Artesanal",
  );
  const possuiPiscicultura =
    tiposSelecionados.includes("Piscicultura");
  const possuiApicultura =
    tiposSelecionados.includes("Apicultura");
  const possuiMeliponicultura = tiposSelecionados.includes(
    "Meliponicultura",
  );

  const possuiPastagem = formData.atividades.some(
    (atividade) => atividade.categoria === "Pastagem",
  );

  const possuiGraos = tiposSelecionados.includes("Grãos");
  const possuiHorticultura =
    tiposSelecionados.includes("Horticultura");
  const possuiFruticultura =
    tiposSelecionados.includes("Fruticultura");
  const possuiMandioca = tiposSelecionados.includes("Mandioca");
  const possuiCulturasIndustriais = tiposSelecionados.includes(
    "Culturas Industriais",
  );
  const possuiOutrasCulturas = tiposSelecionados.includes(
    "Outras Culturas",
  );

  const possuiMadeira = tiposSelecionados.includes(
    "Produção Florestal de Madeira",
  );
  const possuiNaoMadeireira = tiposSelecionados.includes(
    "Produção Florestal Não Madeireira",
  );
  const possuiExtrativismoVegetal = tiposSelecionados.includes(
    "Extrativismo Vegetal",
  );
  const possuiExtrativismoMineral = tiposSelecionados.includes(
    "Extrativismo Mineral",
  );

  const steps = [
    {
      number: 1,
      title: "Dados Pessoais",
      description: "Informações do produtor",
    },
    {
      number: 2,
      title: "Endereço e Localização",
      description: "Dados de endereço e propriedade",
    },
    {
      number: 3,
      title: "Perfil e Propriedade",
      description: "Perfil e situação do imóvel",
    },
    {
      number: 4,
      title: "Área e Atividades",
      description: "Dados da área e atividades",
    },
    {
      number: 5,
      title: "Registro do Produtor",
      description: "Informações de pesca e registro",
    },
    {
      number: 6,
      title: "Responsáveis Técnicos",
      description: "Técnicos e observações",
    },
  ];

  const tiposPecuariaComQuantidade = [
    "Bovinocultura",
    "Avicultura",
    "Galinha",
    "Pato",
    "Suinocultura",
    "Bubalinocultura",
    "Caprinocultura",
    "Ovinocultura",
    "Equinos",
    "Codorna",
    "Pato Doméstico",
  ];
  const possuiPesca =
    possuiPescaArtesanal ||
    possuiPescaComercial ||
    possuiPescaSubsistencia;
  const pecuariaSelecionada = tiposSelecionados.filter((tipo) =>
    tiposPecuariaComQuantidade.includes(tipo),
  );
  const possuiAgriculturaSubtipo =
    possuiGraos ||
    possuiHorticultura ||
    possuiFruticultura ||
    possuiMandioca ||
    possuiCulturasIndustriais ||
    possuiOutrasCulturas;
  const calcularProducaoTotal = (
    especies: { nome: string; kg: string }[],
  ) => {
    const totalKg = especies.reduce((acc, item) => {
      const valor = parseFloat(item.kg) || 0;
      return acc + valor;
    }, 0);

    const totalTon = totalKg / 1000;

    return totalTon.toFixed(2);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files) return;

    const novosArquivos: Documento[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        novosArquivos.push({
          nome: file.name,
          tipo: file.type,
          base64: reader.result as string,
        });

        // Atualiza quando terminar de ler todos
        if (novosArquivos.length === files.length) {
          setFormData((prev) => ({
            ...prev,
            documentos: [...prev.documentos, ...novosArquivos],
          }));
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const carregarProdutorParaEdicao = (produtorId: string) => {
    const produtores = carregarProdutores();
    const produtor = produtores.find(
  (p) => p.id === produtorId
);
    if (produtor) {
      setFormData({
        ...produtor,
        acessoLocalizacao: produtor.acessoLocalizacao || "",
        culturasAgricolas: produtor.culturasAgricolas || [],
        producaoOrganica: produtor.producaoOrganica || false,
        paa: produtor.paa || {
          participa: false,
          perfil: "",
          propriedade: "",
          observacoes: "",
        },
        carteiraProdutor: produtor.carteiraProdutor || {
          numero: produtor.numeroCarteiraProdutor || "",
          emissao: "",
          vencimento: produtor.vencimentoCarteiraProdutor || "",
          orgaoEmissor: "",
          observacoes: "",
        },
        avicultura: produtor.avicultura || {
          especies: [],
          sistemaCriacao: produtor.sistemaCriacao || "",
          quantidade: "",
          organica: false,
          observacoes: "",
        },
      });
      setProdutorEmEdicaoId(produtorId);
      setModoEdicao(true);
      setCurrentStep(1);
    }
  };

  const cancelarEdicao = () => {
    setModoEdicao(false);
    setProdutorEmEdicaoId(null);
    setCurrentStep(1);
    // Resetar formulário para valores iniciais
    setFormData({
      nome: "",
      cpf: "",
      rg: "",
      orgaoExpedidor: "",
      dataNascimento: "",
      nacionalidade: "Brasileira",
      municipioNascimento: "",
      telefone: "",
      grauInstrucao: "",
      estadoCivil: "",
      raca: "",
      sexo: "",
      publico: "",
      logradouro: "",
      bairro: "",
      municipio: "",
      uf: "",
      codigoMunicipio: "",
      cep: "",
      tipoLocalizacao: "",
      especificacaoLocalizacao: "",
      acessoLocalizacao: "",
      tipoCoordenada: "decimal",
      tipoArea: "",
      km: "",
      margem: "",
      latitude: "",
      longitude: "",
      comunidade: "",
      perfil: [],
      situacaoImovel: "",
      caracteristicas: [],
      atividades: [],
      atividadePrincipal: "",
      atividadeSecundaria: "",
      outrasProducoes: "",
      outrasInformacoesAtividades: "",
      pastagemTerraFirme: "",
      pastagemVarzea: "",
      pastagemCapineira: "",
      descricaoPastagem: "",
      nomeImovel: "",
      areaTotal: "",
      areaEstado: "",
      areaOutroEstado: "",
      areaAgricultura: "",
      areaPastagem: "",
      areaArrendada: "",
      areaParceria: "",
      numeroExtrativistas: "",
      numeroPmfspe: "",
      numeroPmfspeRegularizado: "",
      novoPoe: "",
      posExploratorio: "",
      areaTotalPlanos: "",
      volumeTotal: "",
      volumeRegularizado: "",
      volumePotencial: "",
      tipoPesca: "",
      rgPesca: "",
      protocoloRgp: "",
      localPesca: "",
      margemPesca: "",
      producaoTotal: "",
      especies: [],
      tipoSistema: "",
      areaPiscicultura: "",
      numeroPeixes: "",
      producaoPiscicultura: "",
      abelhas: [],
      produtoExtrativista: "",
      quantidadeExtrativismo: "",
      pecuaria: [],
      sistemaCriacao: "",
      informacoesPecuariaPos: "",
      culturaPrincipal: "",
      areaPlantada: "",
      areaAssistida: "",
      areaColhida: "",
      producaoObtidaAgricultura: "",
      culturasAgricolas: [],
      producaoOrganica: false,
      paa: {
        participa: false,
        perfil: "",
        propriedade: "",
        observacoes: "",
      },
      carteiraProdutor: {
        numero: "",
        emissao: "",
        vencimento: "",
        orgaoEmissor: "",
        observacoes: "",
      },
      avicultura: {
        especies: [],
        sistemaCriacao: "",
        quantidade: "",
        organica: false,
        observacoes: "",
      },
      produtoExtraido: "",
      producaoAnual: "",
      producaoFlorestal: [],
      possuiSistemaAgroflorestal: false,
      numeroPlantasAcai: "",
      numeroPlantasBanana: "",
      numeroPlantasCastanha: "",
      numeroPlantasCacau: "",
      anoEmissao: "",
      codigoUnloc: "",
      codigoRgp: "",
      municipioUf: "",
      dataRegistro: "",
      tipoSolicitacao: "",
      situacaoProdutor: "",
      possuiCaf: false,
      numeroCaf: "",
      vencimentoCaf: "",
      possuiCar: false,
      numeroCar: "",
      dataInscricaoCar: "",
      possuiCarteiraProdutor: false,
      numeroCarteiraProdutor: "",
      vencimentoCarteiraProdutor: "",
      documentos: [],
      observacoesBeneficiario: "",
      declaracaoBeneficiario: false,
      resultadoSupervisao: "",
      encaminhamentos: "",
      tipoEncaminhamento: "",
      observacoesTecnico: "",
      tecnicoResponsavel: "",
      numeroConselho: "",
      gerente: "",
      conselhoGerente: "",
      observacoes: "",
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps)
      setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensagemErro("");
    setMensagemSucesso("");

    const usuarioLogado = JSON.parse(
      localStorage.getItem("usuarioLogado") || "null",
    );

    const produtores = carregarProdutores();
    const cpfAtualLimpo = limparCpf(formData.cpf);

    if (!cpfAtualLimpo) {
      setMensagemErro("Por favor informe um CPF válido.");
      setCurrentStep(1);
      return;
    }

    if (!formData.nome.trim()) {
      setMensagemErro("Informe o nome do produtor antes de finalizar.");
      setCurrentStep(1);
      return;
    }

    const cpfDuplicado = produtores.some(
      (p: Produtor) =>
        limparCpf(p.cpf) === cpfAtualLimpo &&
        p.id !== produtorEmEdicaoId,
    );

    if (cpfDuplicado) {
      setMensagemErro("Já existe um produtor cadastrado com este CPF.");
      setCurrentStep(1);
      return;
    }


    if (modoEdicao && produtorEmEdicaoId) {
      const atualizados = produtores.map((p: Produtor) =>
        p.id === produtorEmEdicaoId
          ? {
              ...p,
              ...formData,
              dataAtualizacao: new Date().toISOString(),
            }
          : p,
      );

      localStorage.setItem(
        "produtores",
        JSON.stringify(atualizados),
      );

      setMensagemSucesso("Produtor atualizado com sucesso.");
    } else {
      const novoProdutor = {
        ...formData,
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString(),

        cadastradoPorId: usuarioLogado?.id || "",
        cadastradoPorNome: usuarioLogado?.nome || "",
        cadastradoPorEmail: usuarioLogado?.email || "",
        cadastradoPorTipo: usuarioLogado?.tipo || "tecnico",
      };

      produtores.push(novoProdutor);

      localStorage.setItem(
        "produtores",
        JSON.stringify(produtores),
      );

      setMensagemSucesso("Produtor cadastrado com sucesso.");
    }

    setFormData({
      nome: "",
      cpf: "",
      rg: "",
      orgaoExpedidor: "",
      dataNascimento: "",
      nacionalidade: "Brasileira",
      municipioNascimento: "",
      telefone: "",
      grauInstrucao: "",
      estadoCivil: "",
      raca: "",
      sexo: "",
      publico: "",
      logradouro: "",
      bairro: "",
      municipio: "",
      uf: "",
      codigoMunicipio: "",
      cep: "",
      tipoLocalizacao: "",
      especificacaoLocalizacao: "",
      acessoLocalizacao: "",
      tipoCoordenada: "decimal",
      km: "",
      margem: "",
      latitude: "",
      longitude: "",
      comunidade: "",
      perfil: [],
      atividades: [],
      situacaoImovel: "",
      caracteristicas: [],
      nomeImovel: "",
      areaTotal: "",
      areaEstado: "",
      areaOutroEstado: "",
      areaAgricultura: "",
      areaPastagem: "",
      areaArrendada: "",
      areaParceria: "",
      atividadePrincipal: "",
      atividadeSecundaria: "",
      outrasProducoes: "",
      outrasInformacoesAtividades: "",
      observacoesBeneficiario: "",
      tipoArea: "",
      producaoFlorestal: [
        { produto: "", quantidade: "", unidade: "" },
      ],
      possuiSistemaAgroflorestal: false,
      numeroPlantasAcai: "",
      numeroPlantasBanana: "",
      numeroPlantasCastanha: "",
      numeroPlantasCacau: "",
      declaracaoBeneficiario: false,
      resultadoSupervisao: "",
      encaminhamentos: "",
      tipoEncaminhamento: "",
      observacoesTecnico: "",
      tipoPesca: "",
      rgPesca: "",
      protocoloRgp: "",
      localPesca: "",
      margemPesca: "",
      producaoTotal: "",
      especies: [
        { nome: "", kg: "" },
        { nome: "", kg: "" },
        { nome: "", kg: "" },
        { nome: "", kg: "" },
        { nome: "", kg: "" },
      ],
      anoEmissao: "2026",
      codigoUnloc: "",
      codigoRgp: "",
      municipioUf: "",
      dataRegistro: "",
      tipoSolicitacao: "",
      tecnicoResponsavel: "",
      numeroConselho: "",
      gerente: "",
      conselhoGerente: "",
      observacoes: "",
      documentos: [],
      numeroExtrativistas: "",
      numeroPmfspe: "",
      numeroPmfspeRegularizado: "",
      novoPoe: "",
      posExploratorio: "",
      areaTotalPlanos: "",
      volumeTotal: "",
      volumeRegularizado: "",
      volumePotencial: "",
      tipoSistema: "",
      areaPiscicultura: "",
      numeroPeixes: "",
      producaoPiscicultura: "",
      pecuaria: [],
      abelhas: [
        {
          nomecientifico: "",
          tipo: "",
          numeroColmeias: "",
          producaoMel: "",
          producaoPolen: "",
          producaoPropolis: "",
        },
      ],
      produtoExtrativista: "",
      quantidadeExtrativismo: "",
      situacaoProdutor: "",
      possuiCaf: false,
      numeroCaf: "",
      vencimentoCaf: "",
      possuiCar: false,
      numeroCar: "",
      dataInscricaoCar: "",
      possuiCarteiraProdutor: false,
      numeroCarteiraProdutor: "",
      vencimentoCarteiraProdutor: "",
      culturaPrincipal: "",
      areaPlantada: "",
      areaAssistida: "",
      areaColhida: "",
      producaoObtidaAgricultura: "",
      culturasAgricolas: [],
      producaoOrganica: false,
      paa: {
        participa: false,
        perfil: "",
        propriedade: "",
        observacoes: "",
      },
      carteiraProdutor: {
        numero: "",
        emissao: "",
        vencimento: "",
        orgaoEmissor: "",
        observacoes: "",
      },
      avicultura: {
        especies: [],
        sistemaCriacao: "",
        quantidade: "",
        organica: false,
        observacoes: "",
      },
      sistemaCriacao: "",
      informacoesPecuariaPos: "",
      produtoExtraido: "",
      producaoAnual: "",

      pastagemTerraFirme: "",
      pastagemVarzea: "",
      pastagemCapineira: "",
      descricaoPastagem: "",

      cadastradoPorId: "",
      cadastradoPorNome: "",
      cadastradoPorEmail: "",
      cadastradoPorTipo: "tecnico",
      dataCadastro: "",
      dataAtualizacao: "",
    });

    setModoEdicao(false);
    setProdutorEmEdicaoId(null);
    setCurrentStep(1);
  };

  const handleCheckboxChange = (
    field: "perfil" | "caracteristicas",
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <div className="idam-form space-y-7">
      {/* Seleção de Modo */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
          <h3 className="text-foreground font-semibold">
            {modoEdicao ? "Atualizar Cadastro" : "Novo Cadastro"}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (modoEdicao) {
                  cancelarEdicao();
                }
                setMostrarListaProdutores(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                !modoEdicao
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Plus className="w-4 h-4" />
              Novo Cadastro
            </button>
            <button
              onClick={() => {
                setMostrarListaProdutores(!mostrarListaProdutores);
                if (!mostrarListaProdutores) {
                  setBuscaProdutor("");
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                mostrarListaProdutores
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <Edit className="w-4 h-4" />
              Atualizar Cadastro
            </button>
          </div>
        </div>

        {/* Lista de Produtores para Edição */}
        {mostrarListaProdutores && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar produtor por nome ou CPF..."
                value={buscaProdutor}
                onChange={(e) => setBuscaProdutor(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="max-h-80 overflow-y-auto border border-border rounded-lg">
              {(() => {
                const produtores = carregarProdutores();
                const buscaCpfLimpo = limparCpf(buscaProdutor);
                const produtoresFiltrados = produtores.filter(
                  (p: Produtor) =>
                    p.nome.toLowerCase().includes(buscaProdutor.toLowerCase()) ||
                    limparCpf(p.cpf).includes(buscaCpfLimpo),
                );

                if (produtoresFiltrados.length === 0) {
                  return (
                    <div className="p-8 text-center text-muted-foreground">
                      {buscaProdutor
                        ? "Nenhum produtor encontrado"
                        : "Nenhum produtor cadastrado"}
                    </div>
                  );
                }

                return produtoresFiltrados.map((produtor: Produtor) => (
                  <button
                    key={produtor.id}
                    onClick={() => {
                      carregarProdutorParaEdicao(produtor.id);
                      setMostrarListaProdutores(false);
                    }}
                    className={`w-full p-4 text-left border-b border-border last:border-b-0 hover:bg-accent transition-colors ${
                      produtorEmEdicaoId === produtor.id ? "bg-accent" : ""
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
                        {produtor.municipio && (
                          <p className="text-xs text-muted-foreground">
                            {produtor.municipio} - {produtor.uf}
                          </p>
                        )}
                      </div>
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ));
              })()}
            </div>
          </div>
        )}

        {/* Produtor Selecionado para Edição */}
        {modoEdicao && produtorEmEdicaoId && (
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center justify-between bg-accent/50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Edit className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Editando:</p>
                  <p className="font-medium text-foreground">{formData.nome}</p>
                  <p className="text-xs text-muted-foreground">CPF: {formData.cpf}</p>
                </div>
              </div>
              <button
                onClick={cancelarEdicao}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                title="Cancelar edição"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5] p-5 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9b741d]">
              Roteiro de preenchimento
            </p>
            <h3 className="mt-1 text-lg font-semibold text-[#13251d]">
              {steps[currentStep - 1]?.title || "Revisão"}
            </h3>
            <p className="text-sm text-[#607368]">
              {steps[currentStep - 1]?.description ||
                "Confira os dados antes de finalizar."}
            </p>
          </div>
          <div className="rounded-lg border border-[#ded9c8] bg-white px-3 py-2 text-sm font-semibold text-[#466255]">
            {Math.round((currentStep / totalSteps) * 100)}% completo
          </div>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#e8e2d4]">
          <div
            className="h-full rounded-full bg-[#e6c46a] transition-all"
            style={{
              width: `${Math.round((currentStep / totalSteps) * 100)}%`,
            }}
          />
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-3 xl:grid-cols-6">
          {steps.map((step) => (
            <button
              type="button"
              key={step.number}
              onClick={() => setCurrentStep(step.number)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                step.number === currentStep
                  ? "border-[#e6c46a] bg-[#fbf3da] shadow-sm"
                  : step.number < currentStep
                    ? "border-[#c8d7c1] bg-[#f0f6ea]"
                    : "border-[#ded9c8] bg-white hover:bg-[#f4f0e7]"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                  step.number <= currentStep
                    ? "bg-[#173f31] text-white"
                    : "bg-[#e8e2d4] text-[#607368]"
                }`}
              >
                {step.number < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold leading-tight text-[#13251d]">
                  {step.title}
                </p>
                <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#607368]">
                  {step.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Form */}
      {mensagemErro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {mensagemErro}
        </div>
      )}

      {mensagemSucesso && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {mensagemSucesso}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Step 1: Dados Pessoais */}
        {currentStep === 1 && (
          <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-foreground">
                Dados Pessoais
              </h2>
              <p className="text-muted-foreground mt-1">
                Preencha as informações pessoais do produtor
                rural
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-foreground mb-2" id="nome">
                  Nome do Produtor(a){" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  aria-labelledby="nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nome: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="cpf">
                  CPF{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  aria-labelledby="cpf"
                  type="text"
                  required
                  value={formData.cpf}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cpf: e.target.value,
                    })
                  }
                  placeholder="000.000.000-00"
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="rg">
                  RG <span className="text-destructive">*</span>
                </label>
                <input
                  aria-labelledby="rg"
                  type="text"
                  required
                  value={formData.rg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rg: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="orgaoExpedidor">
                  Órgão Expedidor
                </label>
                <input
                  aria-labelledby="orgaoExpedidor"
                  type="text"
                  value={formData.orgaoExpedidor}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      orgaoExpedidor: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="dataNascimento">
                  Data de Nascimento{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  aria-labelledby="dataNascimento"
                  type="date"
                  required
                  value={formData.dataNascimento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dataNascimento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="nacionalidade">
                  Nacionalidade
                </label>
                <input
                  aria-labelledby="nacionalidade"
                  type="text"
                  value={formData.nacionalidade}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nacionalidade: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="municipioNascimento">
                  Município de Nascimento - UF
                </label>
                <input
                  aria-labelledby="municipioNascimento"
                  type="text"
                  value={formData.municipioNascimento}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      municipioNascimento: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="telefone">
                  Telefone{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      telefone: e.target.value,
                    })
                  }
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                />
              </div>
              <div>
                <label className="block text-foreground mb-2" id="grauInstrucao">
                  Grau de Instrução
                </label>
                <select
                  aria-labelledby="grauInstrucao"
                  value={formData.grauInstrucao}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      grauInstrucao: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                >
                  <option value="">Selecione</option>
                  <option>Analfabeto</option>
                  <option>Fundamental Incompleto</option>
                  <option>Fundamental Completo</option>
                  <option>Médio Incompleto</option>
                  <option>Médio Completo</option>
                  <option>Superior Incompleto</option>
                  <option>Superior Completo</option>
                </select>
              </div>
              <div>
                <label className="block text-foreground mb-2" id="estadoCivil">
                  Estado Civil
                </label>
                <select
                  aria-labelledby="estadoCivil"
                  value={formData.estadoCivil}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estadoCivil: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                >
                  <option value="">Selecione</option>
                  <option>Solteiro(a)</option>
                  <option>Casado(a)</option>
                  <option>Divorciado(a)</option>
                  <option>Viúvo(a)</option>
                  <option>União Estável</option>
                </select>
              </div>
              <div>
                <label className="block text-foreground mb-2" id="raca">
                  Raça ou Cor
                </label>
                <select
                  aria-labelledby="raca"
                  value={formData.raca}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      raca: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                >
                  <option value="">Selecione</option>
                  <option>Branca</option>
                  <option>Preta</option>
                  <option>Parda</option>
                  <option>Amarela</option>
                  <option>Indígena</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground mb-2" id="sexo">
                  Sexo <span className="text-destructive">*</span>
                </label>
                <select
                  aria-labelledby="sexo"
                  value={formData.sexo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sexo: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                </select>
              </div>

              <div>
                <label className="block text-foreground mb-2" id="publico">
                  Público <span className="text-destructive">*</span>
                </label>
                <select
                  aria-labelledby="publico"
                  value={formData.publico}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      publico: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  required
                >
                  <option value="">Selecione</option>
                  <option value="Homem">Homem</option>
                  <option value="Mulher">Mulher</option>
                  <option value="Jovem">Jovem</option>
                </select>
              </div>    
            </div>
          </div>
        )}

        {/* Step 2: Endereço e Localização */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">Endereço</h2>
                <p className="text-muted-foreground mt-1">
                  Informações do endereço residencial
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-foreground mb-2" id="logradouro">
                    Logradouro e Número{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    aria-labelledby="logradouro"
                    type="text"
                    required
                    value={formData.logradouro}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        logradouro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="bairro">
                    Bairro
                  </label>
                  <input
                    aria-labelledby="bairro"
                    type="text"
                    value={formData.bairro}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bairro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="municipio">
                    Município{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <input
                    aria-labelledby="municipio"
                    type="text"
                    required
                    value={formData.municipio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        municipio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="uf">
                    UF{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <select
                    aria-labelledby="uf"
                    required
                    value={formData.uf}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        uf: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  >
                    <option value="">Selecione</option>
                    <option>AC</option>
                    <option>AL</option>
                    <option>AP</option>
                    <option>AM</option>
                    <option>BA</option>
                    <option>CE</option>
                    <option>DF</option>
                    <option>ES</option>
                    <option>GO</option>
                    <option>MA</option>
                    <option>MT</option>
                    <option>MS</option>
                    <option>MG</option>
                    <option>PA</option>
                    <option>PB</option>
                    <option>PR</option>
                    <option>PE</option>
                    <option>PI</option>
                    <option>RJ</option>
                    <option>RN</option>
                    <option>RS</option>
                    <option>RO</option>
                    <option>RR</option>
                    <option>SC</option>
                    <option>SP</option>
                    <option>SE</option>
                    <option>TO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="codigoMunicipio">
                    Código do Município
                  </label>
                  <input
                    aria-labelledby="codigoMunicipio"
                    type="text"
                    value={formData.codigoMunicipio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        codigoMunicipio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="cep">
                    CEP
                  </label>
                  <input
                    aria-labelledby="cep"
                    type="text"
                    value={formData.cep}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cep: e.target.value,
                      })
                    }
                    placeholder="00000-000"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">
                  Localização da Propriedade
                </h2>
                <p className="text-muted-foreground mt-1">
                  Dados de localização da propriedade rural
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-foreground mb-2" id="tipoLocalizacao">
                    Referência da Localização
                  </label>
                  <select
                    aria-labelledby="tipoLocalizacao"
                    value={formData.tipoLocalizacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoLocalizacao: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  >
                    <option value="">Selecione</option>
                    <option>Rodovia</option>
                    <option>Ramal</option>
                    <option>Rio</option>
                    <option>Estrada</option>
                    <option>Vicinal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="acessoLocalizacao">
                    Acesso
                  </label>
                  <select
                    aria-labelledby="acessoLocalizacao"
                    value={formData.acessoLocalizacao || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        acessoLocalizacao: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  >
                    <option value="">Selecione</option>
                    <option>Via fluvial</option>
                    <option>Asfalto</option>
                    <option>Terra boa</option>
                    <option>Terra ruim</option>
                    <option>Misto</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-foreground mb-2" id="especificacaoLocalizacao">
                    Especificação da Localização e KM
                  </label>
                  <input
                    aria-labelledby="especificacaoLocalizacao"
                    type="text"
                    value={formData.especificacaoLocalizacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        especificacaoLocalizacao: e.target.value,
                      })
                    }
                    placeholder="Ex: Rodovia AM-010, KM 45, próximo ao posto de combustível"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="km">
                    KM
                  </label>
                  <input
                    aria-labelledby="km"
                    type="text"
                    value={formData.km}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        km: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="margem">
                    Margem
                  </label>
                  <select
                    aria-labelledby="margem"
                    value={formData.margem}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        margem: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  >
                    <option value="">Selecione</option>
                    <option>Direita</option>
                    <option>Esquerda</option>
                  </select>
                </div>

                <div className="md:col-span-2 bg-accent/20 p-4 rounded-lg border border-border">
                  <label className="block text-foreground mb-3 font-semibold" id="tipoCoordenada">
                    Tipo de Coordenada
                  </label>
                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                       aria-labelledby="tipoCoordenada"
                        type="radio"
                        value="decimal"
                        checked={formData.tipoCoordenada === "decimal"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipoCoordenada: e.target.value,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span>Decimal</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                      aria-labelledby="tipoCoordenada"
                        type="radio"
                        value="geografica"
                        checked={formData.tipoCoordenada === "geografica"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            tipoCoordenada: e.target.value,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span>Geográfica (Graus, Minutos, Segundos)</span>
                    </label>
                  </div>

                  {formData.tipoCoordenada === "decimal" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-foreground mb-2" id="latitudeDecimal">
                          Latitude (Decimal)
                        </label>
                        <input
                            aria-labelledby="latitudeDecimal"
                          type="text"
                          value={formData.latitude}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              latitude: e.target.value,
                            })
                          }
                          placeholder="Ex: -3.123456"
                          className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-foreground mb-2" id="longitudeDecimal">
                          Longitude (Decimal)
                        </label>
                        <input
                          aria-labelledby="longitudeDecimal"
                          type="text"
                          value={formData.longitude}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              longitude: e.target.value,
                            })
                          }
                          placeholder="Ex: -60.123456"
                          className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3">
                          <label className="block text-foreground mb-2 text-sm" id="latitudeGraus">
                            Latitude
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={formData.latitudeGraus}
                              onChange={(e) => {
                                const graus = e.target.value;
                                const minutos = formData.latitudeMinutos || "0";
                                const segundos = formData.latitudeSegundos || "0";
                                const direcao = formData.latitudeDirecao || "S";
                                const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "S" ? -1 : 1);
                                setFormData({
                                  ...formData,
                                  latitudeGraus: graus,
                                  latitude: decimal.toFixed(6),
                                });
                              }}
                              placeholder="Graus"
                              className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                            />
                            <input
                              type="number"
                              value={formData.latitudeMinutos}
                              onChange={(e) => {
                                const graus = formData.latitudeGraus || "0";
                                const minutos = e.target.value;
                                const segundos = formData.latitudeSegundos || "0";
                                const direcao = formData.latitudeDirecao || "S";
                                const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "S" ? -1 : 1);
                                setFormData({
                                  ...formData,
                                  latitudeMinutos: minutos,
                                  latitude: decimal.toFixed(6),
                                });
                              }}
                              placeholder="Min"
                              className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                            />
                            <input
                              type="number"
                              value={formData.latitudeSegundos}
                              onChange={(e) => {
                                const graus = formData.latitudeGraus || "0";
                                const minutos = formData.latitudeMinutos || "0";
                                const segundos = e.target.value;
                                const direcao = formData.latitudeDirecao || "S";
                                const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "S" ? -1 : 1);
                                setFormData({
                                  ...formData,
                                  latitudeSegundos: segundos,
                                  latitude: decimal.toFixed(6),
                                });
                              }}
                              placeholder="Seg"
                              className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-foreground mb-2 text-sm" id="latitudeDirecao">
                            Direção
                          </label>
                          <select
                              aria-labelledby="latitudeDirecao"
                            value={formData.latitudeDirecao}
                            onChange={(e) => {
                              const graus = formData.latitudeGraus || "0";
                              const minutos = formData.latitudeMinutos || "0";
                              const segundos = formData.latitudeSegundos || "0";
                              const direcao = e.target.value;
                              const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "S" ? -1 : 1);
                              setFormData({
                                ...formData,
                                latitudeDirecao: direcao,
                                latitude: decimal.toFixed(6),
                              });
                            }}
                            className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                          >
                            <option value="N">N</option>
                            <option value="S">S</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        <div className="col-span-3">
                          <label className="block text-foreground mb-2 text-sm" id="longitudeGraus">
                            Longitude
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={formData.longitudeGraus}
                              onChange={(e) => {
                                const graus = e.target.value;
                                const minutos = formData.longitudeMinutos || "0";
                                const segundos = formData.longitudeSegundos || "0";
                                const direcao = formData.longitudeDirecao || "W";
                                const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "W" ? -1 : 1);
                                setFormData({
                                  ...formData,
                                  longitudeGraus: graus,
                                  longitude: decimal.toFixed(6),
                                });
                              }}
                              placeholder="Graus"
                              className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                            />
                            <input
                              type="number"
                              value={formData.longitudeMinutos}
                              onChange={(e) => {
                                const graus = formData.longitudeGraus || "0";
                                const minutos = e.target.value;
                                const segundos = formData.longitudeSegundos || "0";
                                const direcao = formData.longitudeDirecao || "W";
                                const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "W" ? -1 : 1);
                                setFormData({
                                  ...formData,
                                  longitudeMinutos: minutos,
                                  longitude: decimal.toFixed(6),
                                });
                              }}
                              placeholder="Min"
                              className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                            />
                            <input
                              type="number"
                              value={formData.longitudeSegundos}
                              onChange={(e) => {
                                const graus = formData.longitudeGraus || "0";
                                const minutos = formData.longitudeMinutos || "0";
                                const segundos = e.target.value;
                                const direcao = formData.longitudeDirecao || "W";
                                const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "W" ? -1 : 1);
                                setFormData({
                                  ...formData,
                                  longitudeSegundos: segundos,
                                  longitude: decimal.toFixed(6),
                                });
                              }}
                              placeholder="Seg"
                              className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-foreground mb-2 text-sm" id="longitudeDirecao">
                            Direção
                          </label>
                          <select
                            aria-labelledby="longitudeDirecao"
                            value={formData.longitudeDirecao}
                            onChange={(e) => {
                              const graus = formData.longitudeGraus || "0";
                              const minutos = formData.longitudeMinutos || "0";
                              const segundos = formData.longitudeSegundos || "0";
                              const direcao = e.target.value;
                              const decimal = (parseFloat(graus) + parseFloat(minutos) / 60 + parseFloat(segundos) / 3600) * (direcao === "W" ? -1 : 1);
                              setFormData({
                                ...formData,
                                longitudeDirecao: direcao,
                                longitude: decimal.toFixed(6),
                              });
                            }}
                            className="w-full px-2 py-2 bg-input-background rounded-lg border border-border text-sm"
                          >
                            <option value="E">E</option>
                            <option value="W">W</option>
                          </select>
                        </div>
                      </div>

                      {formData.latitude && formData.longitude && (
                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                          <p className="text-sm font-semibold text-primary">Coordenadas Decimais Convertidas:</p>
                          <p className="text-sm mt-1">Latitude: {formData.latitude}</p>
                          <p className="text-sm">Longitude: {formData.longitude}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {formData.latitude && formData.longitude && (
                  <div className="mt-6">
                    <label className="block text-foreground mb-2 text-center">
                      Pré-visualização da localização
                    </label>

                    <div className="flex justify-center">
                      <div className="w-full max-w-2xl rounded-xl overflow-hidden border border-border shadow-sm">
                        <iframe
                          title="Mapa da localização"
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${formData.latitude},${formData.longitude}&z=15&output=embed`}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2 text-center">
                      Latitude: {formData.latitude} | Longitude:{" "}
                      {formData.longitude}
                    </p>
                  </div>
                )}
                <div>
                  <label className="block text-foreground mb-2" id="comunidade">
                    Comunidade
                  </label>
                  <input
                    aria-labelledby="comunidade"
                    type="text"
                    value={formData.comunidade}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        comunidade: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Perfil e Propriedade */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* ================= PERFIL ================= */}
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground text-lg font-semibold">
                  Perfil do Produtor
                </h2>
                <p className="text-muted-foreground text-sm">
                  Características sociais do produtor
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Agricultor Familiar",
                  "Quilombola",
                  "Ribeirinho",
                  "Indígena",
                  "Assentado",
                ].map((item) => {
                  const checked =
                    formData.perfil.includes(item);

                  return (
                    <label
                      key={item}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${
                checked
                  ? "bg-primary/10 border-primary"
                  : "bg-input-background hover:bg-accent/50 border-border"
              }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          handleCheckboxChange("perfil", item)
                        }
                        className="w-5 h-5 accent-primary"
                      />
                      <span className="text-foreground">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground text-lg font-semibold">
                  PAA
                </h2>
                <p className="text-muted-foreground text-sm">
                  Informações de perfil e propriedade vinculadas ao produtor
                </p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 rounded-lg border border-border bg-input-background p-3">
                  <input
                    type="checkbox"
                    checked={formData.paa?.participa || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paa: {
                          ...(formData.paa || {
                            perfil: "",
                            propriedade: "",
                            observacoes: "",
                            participa: false,
                          }),
                          participa: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="font-medium text-foreground">
                    Participa ou pretende participar do PAA
                  </span>
                </label>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Perfil no PAA
                    </label>
                    <input
                      type="text"
                      value={formData.paa?.perfil || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paa: {
                            ...(formData.paa || {
                              participa: false,
                              propriedade: "",
                              observacoes: "",
                              perfil: "",
                            }),
                            perfil: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Dados da propriedade para PAA
                    </label>
                    <input
                      type="text"
                      value={formData.paa?.propriedade || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paa: {
                            ...(formData.paa || {
                              participa: false,
                              perfil: "",
                              observacoes: "",
                              propriedade: "",
                            }),
                            propriedade: e.target.value,
                          },
                        })
                      }
                      className="w-full rounded-lg border border-border bg-input-background px-4 py-2.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-foreground">
                      Observações do PAA
                    </label>
                    <textarea
                      rows={3}
                      value={formData.paa?.observacoes || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paa: {
                            ...(formData.paa || {
                              participa: false,
                              perfil: "",
                              propriedade: "",
                              observacoes: "",
                            }),
                            observacoes: e.target.value,
                          },
                        })
                      }
                      className="w-full resize-none rounded-lg border border-border bg-input-background px-4 py-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ================= ATIVIDADES ================= */}
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground text-lg font-semibold">
                  Atividades Desenvolvidas
                </h2>
                <p className="text-muted-foreground text-sm">
                  Selecione as atividades exercidas pelo
                  produtor
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  "Agricultura",
                  "Pesca",
                  "Pecuaria",
                  "Extrativismo",
                  "Pastagem",
                ].map((item) => {
                  const checked = formData.atividades.some(
                    (atividade) => atividade.categoria === item,
                  );

                  return (
                    <label
                      key={item}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        checked
                          ? "bg-green-500/10 border-green-500"
                          : "bg-input-background hover:bg-accent/50 border-border"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          handleCategoriaChange(item)
                        }
                        className="w-5 h-5 accent-green-600"
                      />
                      <span className="text-foreground">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>

              {formData.atividades.length > 0 && (
                <div className="mt-6 space-y-6">
                  {formData.atividades.map((atividade) => (
                    <div
                      key={atividade.categoria}
                      className="rounded-lg border border-border p-4"
                    >
                      <h3 className="text-foreground font-medium mb-3">
                        Subtipos de {atividade.categoria}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {subatividades[
                          atividade.categoria as keyof typeof subatividades
                        ].map((tipo) => {
                          const checked =
                            atividade.tipos.includes(tipo);

                          return (
                            <label
                              key={tipo}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                checked
                                  ? "bg-green-500/10 border-green-500"
                                  : "bg-input-background hover:bg-accent/50 border-border"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  handleTipoChange(
                                    atividade.categoria,
                                    tipo,
                                  )
                                }
                                className="w-4 h-4 accent-green-600"
                              />
                              <span className="text-foreground text-sm">
                                {tipo}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= SITUAÇÃO ================= */}
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground text-lg font-semibold">
                  Situação do Imóvel
                </h2>
                <p className="text-muted-foreground text-sm">
                  Informe a relação com o imóvel rural
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Proprietário",
                  "Arrendatário",
                  "Usufrutuário",
                  "Comodatário",
                  "Posseiro",
                ].map((item) => {
                  const checked =
                    formData.situacaoImovel === item;

                  return (
                    <label
                      key={item}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${
                checked
                  ? "bg-blue-500/10 border-blue-500"
                  : "bg-input-background hover:bg-accent/50 border-border"
              }`}
                    >
                      <input
                        type="radio"
                        name="situacao_imovel"
                        checked={checked}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            situacaoImovel: item,
                          })
                        }
                        className="w-5 h-5 accent-blue-600"
                      />
                      <span className="text-foreground">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ================= CARACTERÍSTICAS ================= */}
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground text-lg font-semibold">
                  Características da Localização
                </h2>
                <p className="text-muted-foreground text-sm">
                  Informe se a localização está em zona rural ou urbana
                </p>
              </div>
              <label>
                <input
                  type="radio"
                  name="tipoArea"
                  value="Zona Rural"
                  checked={formData.tipoArea === "Zona Rural"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipoArea: e.target.value,
                    }))
                  }
                />
                Zona Rural
              </label>

              <label>
                <input
                  type="radio"
                  name="tipoArea"
                  value="Zona Urbana"
                  checked={formData.tipoArea === "Zona Urbana"}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipoArea: e.target.value,
                    }))
                  }
                />
                Zona Urbana
              </label>
              
              <div className="mt-6 border-t border-border pt-5">
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Condições de acesso
                </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  "Via Fluvial",
                  "Asfalto",
                  "Terra Boa",
                  "Terra Ruim",
                ].map((item) => {
                  const checked =
                    formData.caracteristicas.includes(item);

                  return (
                    <label
                      key={item}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${
                checked
                  ? "bg-purple-500/10 border-purple-500"
                  : "bg-input-background hover:bg-accent/50 border-border"
              }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          handleCheckboxChange(
                            "caracteristicas",
                            item,
                          )
                        }
                        className="w-5 h-5 accent-purple-600"
                      />
                      <span className="text-foreground">
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Área e Atividades */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">
                  Dados da Área
                </h2>
                <p className="text-muted-foreground mt-1">
                  Informações sobre a área da propriedade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-3">
                  <label className="block text-foreground mb-2" id="nomeImovel">
                    Nome do Imóvel
                  </label>
                  <input
                    aria-labelledby="nomeImovel"
                    type="text"
                    value={formData.nomeImovel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nomeImovel: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaTotal">
                    Área Total (ha)
                  </label>
                  <input
                    aria-labelledby="areaTotal"
                    type="number"
                    step="0.01"
                    value={formData.areaTotal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaTotal: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaEstado">
                    Área no Estado (ha)
                  </label>
                  <input
                    aria-labelledby="areaEstado"
                    type="number"
                    step="0.01"
                    value={formData.areaEstado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaEstado: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaOutroEstado">
                    Área em Outro Estado (ha)
                  </label>
                  <input
                    aria-labelledby="areaOutroEstado"
                    type="number"
                    step="0.01"
                    value={formData.areaOutroEstado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaOutroEstado: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaAgricultura">
                    Área com Agricultura (ha)
                  </label>
                  <input
                    aria-labelledby="areaAgricultura"
                    type="number"
                    step="0.01"
                    value={formData.areaAgricultura}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaAgricultura: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaPastagem">
                    Área de Pastagem (ha)
                  </label>
                  <input
                    aria-labelledby="areaPastagem"
                    type="number"
                    step="0.01"
                    value={formData.areaPastagem}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaPastagem: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaArrendada">
                    Área Arrendada (ha)
                  </label>
                  <input
                    aria-labelledby="areaArrendada"
                    type="number"
                    step="0.01"
                    value={formData.areaArrendada}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaArrendada: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="areaParceria">
                    Área em Parceria (ha)
                  </label>
                  <input
                    aria-labelledby="areaParceria"
                    type="number"
                    step="0.01"
                    value={formData.areaParceria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        areaParceria: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">Atividades</h2>
                <p className="text-muted-foreground mt-1">
                  Atividades desenvolvidas na propriedade
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-foreground mb-2" id="atividadePrincipal">
                    Atividade Principal
                  </label>
                  <input
                    aria-labelledby="atividadePrincipal"
                    type="text"
                    value={formData.atividadePrincipal}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        atividadePrincipal: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="atividadeSecundaria">
                    Atividade Secundária
                  </label>
                  <input
                    aria-labelledby="atividadeSecundaria"
                    type="text"
                    value={formData.atividadeSecundaria}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        atividadeSecundaria: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-foreground mb-2">
                    Outras Produções
                  </label>
                  <textarea
                    rows={4}
                    value={formData.outrasProducoes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outrasProducoes: e.target.value,
                      })
                    }
                    placeholder="Descreva outras atividades produtivas..."
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <div className="md:col-span-2 bg-accent/30 p-4 rounded-lg border border-border">
                  <label className="block text-foreground mb-2 font-semibold">
                    Outras Informações Sobre Atividades
                  </label>
                  <textarea
                    rows={4}
                    value={formData.outrasInformacoesAtividades}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        outrasInformacoesAtividades: e.target.value,
                      })
                    }
                    placeholder="Informações adicionais que devem aparecer na declaração e documentos SEFAZ..."
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all resize-none"
                  ></textarea>
                  <p className="text-xs text-muted-foreground mt-2">
                    ℹ️ Estas informações serão incluídas na Declaração e nos documentos da SEFAZ
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Pesca e Registro */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {possuiPesca && (
              <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-foreground">
                    Dados de Pesca
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Informações sobre atividade pesqueira
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-foreground mb-2" id="rgPesca">
                        Registro Geral da Pesca
                      </label>
                      <input
                        aria-labelledby="rgPesca"
                        type="text"
                        value={formData.rgPesca}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            rgPesca: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground mb-2" id="protocoloRgp">
                        Protocolo RGP
                      </label>
                      <input
                        aria-labelledby="protocoloRgp"
                        type="text"
                        value={formData.protocoloRgp}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            protocoloRgp: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-foreground mb-2" id="localPesca">
                        Local
                      </label>
                      <select
                        aria-labelledby="localPesca"
                        value={formData.localPesca}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            localPesca: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                      >
                        <option value="">Selecione</option>
                        <option>Rio</option>
                        <option>Lago</option>
                        <option>Igarapé</option>
                        <option>Furo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-foreground mb-2" id="margemPesca">
                        Margem
                      </label>
                      <select
                        aria-labelledby="margemPesca"
                        value={formData.margemPesca}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            margemPesca: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                      >
                        <option value="">Selecione</option>
                        <option>Direita</option>
                        <option>Esquerda</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-foreground mb-2" id="producaoTotal">
                        Produção Total (KG)
                      </label>
                      <input
                        aria-labelledby="producaoTotal"
                        type="number"
                        step="0.01"
                        value={formData.producaoTotal}
                        readOnly
                        className="w-full px-4 py-2.5 bg-muted rounded-lg border border-border"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-foreground mb-4">
                      Espécies e Quantidade
                    </h3>

                    <div className="space-y-4">
                      {formData.especies.map(
                        (especie, index) => (
                          <div
                            key={index}
                            className="flex flex-col md:flex-row gap-3 items-start md:items-center"
                          >
                            <input
                              type="text"
                              value={especie.nome}
                              onChange={(e) => {
                                const novas = [
                                  ...formData.especies,
                                ];
                                novas[index].nome =
                                  e.target.value;

                                setFormData({
                                  ...formData,
                                  especies: novas,
                                });
                              }}
                              placeholder={`Espécie ${index + 1}`}
                              className="flex-1 px-4 py-2.5 bg-input-background rounded-lg border border-border"
                            />

                            <input
                              type="number"
                              step="0.01"
                              value={especie.kg}
                              onChange={(e) => {
                                const novas = [
                                  ...formData.especies,
                                ];
                                novas[index].kg =
                                  e.target.value;

                                const total =
                                  calcularProducaoTotal(novas);

                                setFormData({
                                  ...formData,
                                  especies: novas,
                                  producaoTotal: total,
                                });
                              }}
                              placeholder="Quantidade (KG)"
                              className="w-full md:w-48 px-4 py-2.5 bg-input-background rounded-lg border border-border"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const novas =
                                  formData.especies.filter(
                                    (_, i) => i !== index,
                                  );
                                const total =
                                  calcularProducaoTotal(novas);

                                setFormData({
                                  ...formData,
                                  especies: novas,
                                  producaoTotal: total,
                                });
                              }}
                              className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                              Remover
                            </button>
                          </div>
                        ),
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            especies: [
                              ...formData.especies,
                              { nome: "", kg: "" },
                            ],
                          });
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all"
                      >
                        + Adicionar Espécie
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {pecuariaSelecionada.length > 0 && (
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Dados da Pecuária
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Informe os dados dos subtipos selecionados
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-foreground">
                    Quantidade por tipo
                  </h3>

                  <div className="space-y-3">
                    {pecuariaSelecionada.map((tipo) => {
                      const itemExistente =
                        formData.pecuaria.find(
                          (p) => p.tipo === tipo,
                        ) || {
                          tipo,
                          quantidade: "",
                        };

                      return (
                        <div
                          key={tipo}
                          className="flex flex-col md:flex-row md:items-center gap-3 rounded-xl border border-border bg-muted/30 p-4"
                        >
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">
                              {tipo}
                            </span>
                            <p className="text-xs text-muted-foreground mt-1">
                              Informe a quantidade
                              correspondente
                            </p>
                          </div>

                          <div className="w-full md:w-48">
                            <label className="block text-xs font-medium text-muted-foreground mb-1">
                              Quantidade
                            </label>
                            <input
                              type="number"
                              placeholder="0"
                              value={itemExistente.quantidade}
                              onChange={(e) => {
                                const existe =
                                  formData.pecuaria.some(
                                    (p) => p.tipo === tipo,
                                  );

                                let novaLista = [
                                  ...formData.pecuaria,
                                ];

                                if (existe) {
                                  novaLista = novaLista.map(
                                    (p) =>
                                      p.tipo === tipo
                                        ? {
                                            ...p,
                                            quantidade:
                                              e.target.value,
                                          }
                                        : p,
                                  );
                                } else {
                                  novaLista.push({
                                    tipo,
                                    quantidade: e.target.value,
                                    unidade: "",
                                  });
                                }

                                setFormData({
                                  ...formData,
                                  pecuaria: novaLista,
                                });
                              }}
                              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <SistemaCriacaoAnimal
                  avicultura={formData.avicultura}
                  sistemaCriacao={formData.sistemaCriacao}
                  producaoOrganica={formData.producaoOrganica}
                  onChange={(dadosCriacao) =>
                    setFormData({
                      ...formData,
                      avicultura: dadosCriacao.avicultura,
                      sistemaCriacao: dadosCriacao.sistemaCriacao,
                      producaoOrganica: dadosCriacao.producaoOrganica,
                    })
                  }
                />

                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4">
                  <label className="block mb-2 text-sm font-semibold text-foreground">
                    Informações em Pousio (Pecuária)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.informacoesPecuariaPos}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        informacoesPecuariaPos: e.target.value,
                      })
                    }
                    placeholder="Informações adicionais sobre a pecuária após os dados principais..."
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  ></textarea>
                  <p className="text-xs text-muted-foreground mt-2">
                    ℹ️ Informações complementares sobre pecuária que serão incluídas nos documentos
                  </p>
                </div>
              </div>
            )}

            {possuiPiscicultura && (
              <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-foreground text-lg font-semibold flex items-center gap-2">
                    Dados da Piscicultura
                    <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">há</Badge>
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Informações sobre criação de peixes
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-foreground mb-2">
                      Tipo de Sistema
                    </label>
                    <input
                      type="text"
                      placeholder="Viveiro, tanque, tanque-rede..."
                      value={formData.tipoSistema}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipoSistema: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-2 flex items-center gap-2" id="areaPiscicultura">
                      Área da Piscicultura
                      <Badge className="bg-emerald-600 text-white hover:bg-emerald-700">há</Badge>
                    </label>
                    <input
                      aria-labelledby="areaPiscicultura"
                      type="number"
                      value={formData.areaPiscicultura}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          areaPiscicultura: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-2" id="numeroPeixes">
                      Número de Peixes
                    </label>
                    <input
                      aria-labelledby="numeroPeixes"
                      type="number"
                      value={formData.numeroPeixes}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numeroPeixes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-border"
                    />
                  </div>

                  <div>
                    <label className="block text-foreground mb-2" id="producaoPiscicultura">
                      Produção (KG)
                    </label>
                    <input
                      aria-labelledby="producaoPiscicultura"
                      type="number"
                      value={formData.producaoPiscicultura}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          producaoPiscicultura: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-border"
                    />
                  </div>
                </div>
              </div>
            )}
            {(possuiApicultura || possuiMeliponicultura) && (
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Apicultura / Meliponicultura
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Informe os tipos de abelha e os dados de
                    produção
                  </p>
                </div>

                <MeliponiculturaList
                  abelhas={formData.abelhas}
                  onChange={(abelhas) =>
                    setFormData({
                      ...formData,
                      abelhas,
                    })
                  }
                />
              </div>
            )}
            {(possuiNaoMadeireira ||
              possuiExtrativismoVegetal ||
              possuiMadeira) && (
              <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-foreground text-lg font-semibold">
                    Produção Florestal / Sistema Agroflorestal
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Informe os produtos produzidos e os dados do
                    sistema agroflorestal
                  </p>
                </div>

                <div>
                  <h3 className="text-foreground font-medium mb-4">
                    Produtos e Quantidades
                  </h3>

                  <div className="space-y-4">
                    {formData.producaoFlorestal.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                          <input
                            type="text"
                            placeholder="Produto"
                            value={item.produto}
                            onChange={(e) => {
                              const novaLista = [
                                ...formData.producaoFlorestal,
                              ];
                              novaLista[index].produto =
                                e.target.value;

                              setFormData({
                                ...formData,
                                producaoFlorestal: novaLista,
                              });
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background"
                          />

                          <input
                            type="number"
                            placeholder="Quantidade"
                            value={item.quantidade}
                            onChange={(e) => {
                              const novaLista = [
                                ...formData.producaoFlorestal,
                              ];
                              novaLista[index].quantidade =
                                e.target.value;

                              setFormData({
                                ...formData,
                                producaoFlorestal: novaLista,
                              });
                            }}
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background"
                          />

                          <div className="flex gap-2">
                            <select
                              aria-label="Unidade de medida"
                              value={item.unidade}
                              onChange={(e) => {
                                const novaLista = [
                                  ...formData.producaoFlorestal,
                                ];
                                novaLista[index].unidade =
                                  e.target.value;

                                setFormData({
                                  ...formData,
                                  producaoFlorestal: novaLista,
                                });
                              }}
                              className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-input-background"
                            >
                              <option value="">Unidade</option>
                              <option value="kg">KG</option>
                              <option value="tonelada">TONELADA</option>
                              <option value="maco">MAÇO</option>
                              <option value="un">Unidade</option>
                              <option value="m3">m³</option>
                              <option value="litro">Litro</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => {
                                const novaLista =
                                  formData.producaoFlorestal.filter(
                                    (_, i) => i !== index,
                                  );

                                setFormData({
                                  ...formData,
                                  producaoFlorestal:
                                    novaLista.length > 0
                                      ? novaLista
                                      : [
                                          {
                                            produto: "",
                                            quantidade: "",
                                            unidade: "",
                                          },
                                        ],
                                });
                              }}
                              className="px-3 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                            >
                              Remover
                            </button>
                          </div>
                        </div>
                      ),
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          producaoFlorestal: [
                            ...formData.producaoFlorestal,
                            {
                              produto: "",
                              quantidade: "",
                              unidade: "",
                            },
                          ],
                        })
                      }
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground"
                    >
                      + Adicionar Produto
                    </button>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-foreground font-medium mb-4">
                    Sistema Agroflorestal
                  </h3>

                  <div className="mb-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={
                          formData.possuiSistemaAgroflorestal
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            possuiSistemaAgroflorestal:
                              e.target.checked,
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-foreground">
                        Possui sistema agroflorestal
                      </span>
                    </label>
                  </div>

                  {formData.possuiSistemaAgroflorestal && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-foreground mb-2" id="numeroPlantasAcai">
                          Nº de plantas de açaí
                        </label>
                        <input
                          aria-labelledby="numeroPlantasAcai"
                          type="number"
                          value={formData.numeroPlantasAcai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              numeroPlantasAcai: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-lg border border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground mb-2" id="numeroPlantasBanana">
                          Nº de plantas de banana
                        </label>
                        <input
                          aria-labelledby="numeroPlantasBanana"
                          type="number"
                          value={formData.numeroPlantasBanana}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              numeroPlantasBanana:
                                e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-lg border border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground mb-2" id="numeroPlantasCastanha">
                          Nº de plantas de castanha-do-brasil
                        </label>
                        <input
                          aria-labelledby="numeroPlantasCastanha"
                          type="number"
                          value={formData.numeroPlantasCastanha}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              numeroPlantasCastanha:
                                e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-lg border border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-foreground mb-2" id="numeroPlantasCacau">
                          Nº de plantas de cacau
                        </label>
                        <input
                          aria-labelledby="numeroPlantasCacau"
                          type="number"
                          value={formData.numeroPlantasCacau}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              numeroPlantasCacau:
                                e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 rounded-lg border border-border"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {formData.atividades.some(
              (a) => a.categoria === "Pastagem",
            ) && (
              <div className="mt-6 bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
                {/* Header */}
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                    Dados da Pastagem
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Informe as áreas de pastagem conforme os
                    tipos selecionados
                  </p>
                </div>

                {formData.atividades
                  .find((a) => a.categoria === "Pastagem")
                  ?.tipos.includes("Terra Firme") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Pastagem em Terra Firme (ha)
                    </label>
                    <input
                      type="number"
                      value={formData.pastagemTerraFirme}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastagemTerraFirme: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground"
                    />
                  </div>
                )}

                {formData.atividades
                  .find((a) => a.categoria === "Pastagem")
                  ?.tipos.includes("Várzea") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Pastagem em Várzea (ha)
                    </label>
                    <input
                      type="number"
                      value={formData.pastagemVarzea}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastagemVarzea: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground"
                    />
                  </div>
                )}

                {formData.atividades
                  .find((a) => a.categoria === "Pastagem")
                  ?.tipos.includes("Capineira") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Capineira (ha)
                    </label>
                    <input
                      type="number"
                      value={formData.pastagemCapineira}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pastagemCapineira: e.target.value,
                        })
                      }
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground"
                    />
                  </div>
                )}

                {possuiPastagem && (
                  <div className="col-span-full">
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Descrição Detalhada da Pastagem
                    </label>
                    <textarea
                      value={formData.descricaoPastagem}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          descricaoPastagem: e.target.value,
                        })
                      }
                      placeholder="Descreva as condições da pastagem, tipo de capim, estado de conservação, etc..."
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                )}
              </div>
            )}
            {possuiAgriculturaSubtipo && (
              <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Dados da Agricultura
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cadastre uma ou mais culturas com cálculo automático de produção por área colhida
                  </p>
                </div>

                <label className="flex items-center gap-3 rounded-lg border border-border bg-background p-3">
                  <input
                    type="checkbox"
                    checked={formData.producaoOrganica || false}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        producaoOrganica: e.target.checked,
                      })
                    }
                  />
                  <span className="font-medium text-foreground">
                    Produção agrícola orgânica
                  </span>
                </label>

                <CulturasAgricolasList
                  culturas={formData.culturasAgricolas || []}
                  onChange={(culturasAgricolas) => {
                    const primeira = culturasAgricolas[0];
                    const producaoTotal = culturasAgricolas.reduce(
                      (total, cultura) =>
                        total + (Number(cultura.quantidadeProduzida) || 0),
                      0,
                    );

                    setFormData({
                      ...formData,
                      culturasAgricolas,
                      culturaPrincipal: primeira?.tipoCultura || "",
                      areaPlantada: primeira?.areaPlantada || "",
                      areaColhida: primeira?.areaColhida || "",
                      producaoObtidaAgricultura: producaoTotal
                        ? String(producaoTotal)
                        : "",
                    });
                  }}
                />
              </div>
            )}

            {!possuiPesca &&
              pecuariaSelecionada.length === 0 &&
              !possuiPiscicultura &&
              !possuiApicultura &&
              !possuiMeliponicultura &&
              !possuiAgriculturaSubtipo &&
              !possuiMadeira &&
              !possuiNaoMadeireira &&
              !possuiExtrativismoVegetal &&
              !possuiExtrativismoMineral && (
                <div className="bg-card rounded-xl border border-border p-6 text-center text-muted-foreground">
                  Nenhuma atividade específica foi selecionada
                  anteriormente.
                </div>
              )}

            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">
                  Dados de Registro
                </h2>
                <p className="text-muted-foreground mt-1">
                  Informações do registro oficial
                </p>
              </div>
              <DadosCarteira
                possuiCarteira={formData.possuiCarteiraProdutor}
                numeroCarteira={formData.numeroCarteiraProdutor}
                vencimentoCarteira={formData.vencimentoCarteiraProdutor}
                carteira={formData.carteiraProdutor}
                onChange={(dadosCarteira) =>
                  setFormData({
                    ...formData,
                    ...dadosCarteira,
                  })
                }
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div>
                  <label className="block text-foreground mb-2">
                    Ano de Emissão/Renovação
                  </label>
                  <input
                    type="text"
                    value={formData.anoEmissao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anoEmissao: e.target.value,
                      })
                    }
                    placeholder="2026"
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="CodigoPR">
                    Código PR 
                  </label>
                  <input
                    aria-labelledby="CodigoPR"
                    type="text"
                    value={formData.codigoUnloc}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        codigoUnloc: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="CodigoRGP">
                    Código RGP
                  </label>
                  <input
                    aria-labelledby="CodigoRGP"
                    type="text"
                    value={formData.codigoRgp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        codigoRgp: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="municipioUf">
                    Município-UF
                  </label>
                  <input
                    aria-labelledby="municipioUf"
                    type="text"
                    value={formData.municipioUf}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        municipioUf: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="dataRegistro">
                    Data
                  </label>
                  <input
                    aria-labelledby="dataRegistro"
                    type="date"
                    value={formData.dataRegistro}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataRegistro: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2" id="tipoSolicitacao">
                    Tipo de Solicitação
                  </label>
                  <select
                    aria-labelledby="tipoSolicitacao"
                    value={formData.tipoSolicitacao}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipoSolicitacao: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                  >
                    <option value="">Selecione</option>
                    <option>Inscrição</option>
                    <option>Baixa</option>
                    <option>2ª Via</option>
                    <option>Alteração</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-foreground text-base font-semibold mb-4">
                  Situação do Produtor
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="situacaoProdutor"
                      value="Atendido"
                      checked={
                        formData.situacaoProdutor === "Atendido"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          situacaoProdutor: e.target.value,
                        })
                      }
                    />
                    <span className="text-foreground">
                      Atendido
                    </span>
                  </label>

                  <label className="flex items-center gap-3 rounded-lg border border-border p-4 cursor-pointer">
                    <input
                      type="radio"
                      name="situacaoProdutor"
                      value="Assistido"
                      checked={
                        formData.situacaoProdutor ===
                        "Assistido"
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          situacaoProdutor: e.target.value,
                        })
                      }
                    />
                    <span className="text-foreground">
                      Assistido
                    </span>
                  </label>
                </div>
              </div>
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="text-foreground text-base font-semibold mb-4">
                  Dados do Produto
                </h3>

                <div className="space-y-6">
                  {/* CAF */}
                  <div className="rounded-xl border border-border p-4 space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.possuiCaf || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            possuiCaf: e.target.checked,
                            numeroCaf: e.target.checked
                              ? formData.numeroCaf
                              : "",
                            vencimentoCaf: e.target.checked
                              ? formData.vencimentoCaf
                              : "",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-foreground font-medium">
                        Possui CAF
                      </span>
                    </label>

                    {formData.possuiCaf && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-foreground mb-2" id="numeroCaf">
                            Número do CAF
                          </label>
                          <input
                            aria-labelledby="numeroCaf"
                            type="text"
                            value={formData.numeroCaf}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                numeroCaf: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                          />
                        </div>

                        <div>
                          <label className="block text-foreground mb-2" id="vencimentoCaf">
                            Data de Vencimento do CAF
                          </label>
                          <input
                            aria-labelledby="vencimentoCaf"
                            type="date"
                            value={formData.vencimentoCaf}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                vencimentoCaf: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CAR */}
                  <div className="rounded-xl border border-border p-4 space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={formData.possuiCar || false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            possuiCar: e.target.checked,
                            numeroCar: e.target.checked
                              ? formData.numeroCar
                              : "",
                            dataInscricaoCar: e.target.checked
                              ? formData.dataInscricaoCar
                              : "",
                          })
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-foreground font-medium">
                        Possui CAR
                      </span>
                    </label>

                    {formData.possuiCar && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-foreground mb-2" id="numeroCar">
                            Número do CAR
                          </label>
                          <input
                            aria-labelledby="numeroCar"
                            type="text"
                            value={formData.numeroCar}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                numeroCar: e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                          />
                        </div>

                        <div>
                          <label className="block text-foreground mb-2" id="dataInscricaoCar">
                            Data de Inscrição do CAR
                          </label>
                          <input
                            aria-labelledby="dataInscricaoCar"
                            type="date"
                            value={formData.dataInscricaoCar}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                dataInscricaoCar:
                                  e.target.value,
                              })
                            }
                            className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Responsáveis */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">
                  Responsáveis Técnicos
                </h2>
                <p className="text-muted-foreground mt-1">
                  Técnicos responsáveis pelo cadastro
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-foreground mb-2" id="tecnicoResponsavel">
                    Técnico Responsável
                  </label>
                  <input
                    aria-labelledby="tecnicoResponsavel"
                    type="text"
                    value={formData.tecnicoResponsavel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tecnicoResponsavel: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="numeroConselho">
                    Número do Conselho
                  </label>
                  <input
                    aria-labelledby="numeroConselho"
                    type="text"
                    value={formData.numeroConselho}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        numeroConselho: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="gerente">
                    Gerente
                  </label>
                  <input
                    aria-labelledby="gerente"
                    type="text"
                    value={formData.gerente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gerente: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block text-foreground mb-2" id="conselhoGerente">
                    Conselho do Gerente
                  </label>
                  <input
                    aria-labelledby="conselhoGerente"
                    type="text"
                    value={formData.conselhoGerente}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        conselhoGerente: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-foreground">Observações</h2>
                <p className="text-muted-foreground mt-1">
                  Informações adicionais sobre o cadastro
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 sm:p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-foreground">
                    Anexar Documentos
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Envie documentos do produtor
                  </p>
                </div>

                <input
                  aria-label="Anexar Documentos do Produtor"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg"
                />

                <div className="space-y-2">
                  {formData.documentos.map((doc, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg bg-accent/30 flex justify-between items-center"
                    >
                      <div>
                        <p className="text-foreground">
                          {doc.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {doc.tipo}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            documentos:
                              formData.documentos.filter(
                                (_, i) => i !== index,
                              ),
                          });
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <label className="block text-foreground mb-2" id="observacoesGerais">
                    Observações Gerais
                  </label>
                  <textarea
                    aria-labelledby="observacoesGerais"
                    rows={5}
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observacoes: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border resize-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground mb-2" id="informacoesAdicionais">
                  Informações Adicionais
                </label>
                <textarea
                  aria-labelledby="informacoesAdicionais"
                  rows={8}
                  value={formData.observacoes}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      observacoes: e.target.value,
                    })
                  }
                  placeholder="Digite aqui qualquer observação relevante sobre o cadastro do produtor rural..."
                  className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="sticky bottom-4 z-10 flex flex-col gap-4 rounded-2xl border border-[#d8d6c9] bg-[#fbfaf5]/95 p-3 shadow-xl shadow-[#13251d]/10 backdrop-blur sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center justify-center gap-2 border border-[#d8d6c9] bg-white px-6 py-3 font-semibold text-[#263a31] transition hover:bg-[#f4f0e7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </button>

          <div className="flex gap-4">
            {modoEdicao && (
              <button
                type="button"
                onClick={cancelarEdicao}
                className="flex flex-1 items-center justify-center gap-2 border border-[#d8d6c9] bg-white px-6 py-3 font-semibold text-[#263a31] transition hover:bg-[#f4f0e7] sm:flex-none"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex flex-1 items-center justify-center gap-2 bg-[#173f31] px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-[#245942] sm:flex-none"
              >
                Próximo
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 bg-[#e6c46a] px-6 py-3 font-semibold text-[#173f31] shadow-sm transition hover:bg-[#d9b654] sm:flex-none"
              >
                <Check className="w-5 h-5" />
                {modoEdicao ? "Atualizar Cadastro" : "Finalizar Cadastro"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
