export interface AviculturaData {
  especies: string[];
  sistemaCriacao: string;
  quantidade: string;
  organica: boolean;
  observacoes: string;
}

export interface CriacaoAnimal {
  sistemaCriacao?: string;
  avicultura?: AviculturaData;
  producaoOrganica?: boolean;
}
