import type { ProdutorBase } from "../types/produtor";

const PRODUTORES_STORAGE_KEY = "produtores";

export function getProdutoresStorage(): ProdutorBase[] {
  try {
    return JSON.parse(localStorage.getItem(PRODUTORES_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setProdutoresStorage(produtores: ProdutorBase[]) {
  localStorage.setItem(PRODUTORES_STORAGE_KEY, JSON.stringify(produtores));
}

export function upsertProdutorStorage(produtor: ProdutorBase) {
  const produtores = getProdutoresStorage();
  const id = produtor.id || Date.now().toString();
  const existe = produtores.some((item) => item.id === id);

  const atualizados = existe
    ? produtores.map((item) => (item.id === id ? { ...item, ...produtor, id } : item))
    : [...produtores, { ...produtor, id }];

  setProdutoresStorage(atualizados);
  return { ...produtor, id };
}
