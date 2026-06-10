export const SEXO_OPTIONS = ["Masculino", "Feminino"] as const;

export const PUBLICO_OPTIONS = ["Homem", "Mulher", "Jovem"] as const;

export const LOCALIZACAO_OPTIONS = [
  "Zona Rural",
  "Zona Urbana",
] as const;

export const ACESSO_LOCALIZACAO_OPTIONS = [
  "Via fluvial",
  "Asfalto",
  "Terra boa",
  "Terra ruim",
  "Misto",
] as const;

export const SUBTIPOS_AGRICULTURA = [
  "Mandioca",
  "Culturas industriais",
  "Grãos",
  "Horticultura",
  "Fruticultura",
  "Outras culturas",
] as const;

export const UNIDADES_PRODUCAO = [
  "kg",
  "t",
  "un",
  "saca",
  "litro",
  "maco",
] as const;

export const TIPOS_CRIACAO = [
  "Extensivo",
  "Semi-intensivo",
  "Intensivo",
  "Confinado",
] as const;

export const AVICULTURA_ESPECIES = ["Galinha", "Pato", "Codorna"] as const;

export const ESPECIES_ABELHA = [
  { tipo: "Apis mellifera", nomecientifico: "Apis mellifera" },
  { tipo: "Jataí", nomecientifico: "Tetragonisca angustula" },
  { tipo: "Uruçu", nomecientifico: "Melipona scutellaris" },
  { tipo: "Mandaçaia", nomecientifico: "Melipona quadrifasciata" },
  { tipo: "Mandaguari", nomecientifico: "Scaptotrigona postica" },
  { tipo: "Canudo", nomecientifico: "Scaptotrigona depilis" },
  { tipo: "Tucandeira", nomecientifico: "Melipona compressipes" },
  { tipo: "Jandaíra", nomecientifico: "Melipona subnitida" },
  { tipo: "Jupará", nomecientifico: "Melipona interrupta" },
  { tipo: "Outra espécie cadastrada", nomecientifico: "" },
] as const;

export const CARTEIRA_ORGAOS_SUGERIDOS = ["IDAM", "SEPROR"] as const;

export const PAA_PERFIL_OPTIONS = [
  "Fornecedor individual",
  "Organização produtiva",
  "Grupo informal",
] as const;
