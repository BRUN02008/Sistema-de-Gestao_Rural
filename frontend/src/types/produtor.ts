import type { CulturaAgricola } from "./agricultura";
import type { CarteiraProdutor } from "./carteira";
import type { CriacaoAnimal } from "./criacaoAnimal";
import type { MeliponiculturaItem } from "./meliponicultura";
import type { PaaProdutor } from "./paa";
import type { LocalizacaoProdutor } from "./localizacao";

export interface ProdutorBase extends LocalizacaoProdutor {
  id?: string;
  nome: string;
  cpf: string;
  rg?: string;
  telefone?: string;
  sexo?: string;
  publico?: string;
  perfil?: string[];
  atividades?: Array<{
    categoria: string;
    tipos: string[];
  }>;
  culturasAgricolas?: CulturaAgricola[];
  carteiraProdutor?: CarteiraProdutor;
  paa?: PaaProdutor;
  criacaoAnimal?: CriacaoAnimal;
  abelhas?: MeliponiculturaItem[];
  producaoOrganica?: boolean;
  [key: string]: unknown;
}
