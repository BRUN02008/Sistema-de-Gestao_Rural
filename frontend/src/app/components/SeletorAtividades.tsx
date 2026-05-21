import { useState } from "react";
import { Sprout, ChevronDown, ChevronUp } from "lucide-react";

interface SeletorAtividadesProps {
  atividadePrincipal: string;
  atividadeSecundaria: string;
  onChangePrincipal: (atividade: string) => void;
  onChangeSecundaria: (atividade: string) => void;
  onAtividadesSelecionadas: (atividades: string[]) => void;
}

const ATIVIDADES_DISPONIVEIS = {
  agricultura: {
    label: "Agricultura",
    subtipos: {
      culturas_industriais: ["Café", "Cana-de-açúcar", "Algodão", "Fumo"],
      graos: ["Arroz", "Feijão", "Milho", "Soja"],
      hortalicas: ["Alface", "Tomate", "Cenoura", "Pimentão", "Couve", "Chicória"],
      frutas: ["Banana", "Laranja", "Mamão", "Melancia", "Abacaxi"],
      tubérculos: ["Mandioca", "Batata", "Inhame", "Macaxeira"],
      outros: ["Outros"]
    }
  },
  pecuaria: {
    label: "Pecuária",
    subtipos: {
      bovinos: ["Gado de Corte", "Gado Leiteiro", "Gado Misto"],
      aves: ["Galinha Caipira", "Frango de Corte", "Pato", "Codorna"],
      suinos: ["Suinocultura"],
      outros_animais: ["Ovinos", "Caprinos", "Equinos", "Bubalinos"]
    }
  },
  pesca: {
    label: "Pesca",
    subtipos: {
      tipos: ["Pesca Artesanal", "Pesca Comercial", "Piscicultura", "Pesca de Subsistência"]
    }
  },
  extrativismo: {
    label: "Extrativismo",
    subtipos: {
      madeireiro: ["Produção Florestal de Madeira"],
      nao_madeireiro: ["Açaí", "Castanha", "Palmito", "Buriti", "Andiroba"],
      outros: ["Extrativismo Vegetal", "Extrativismo Mineral"]
    }
  },
  apicultura: {
    label: "Apicultura/Meliponicultura",
    subtipos: {
      tipos: ["Apicultura", "Meliponicultura"]
    }
  },
  agroecologia: {
    label: "Agroecologia",
    subtipos: {
      tipos: ["Sistema Agroflorestal", "Agricultura Orgânica", "Permacultura"]
    }
  }
};

export default function SeletorAtividades({
  atividadePrincipal,
  atividadeSecundaria,
  onChangePrincipal,
  onChangeSecundaria,
  onAtividadesSelecionadas
}: SeletorAtividadesProps) {
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<string[]>(["agricultura"]);

  const toggleCategoria = (categoria: string) => {
    if (categoriasExpandidas.includes(categoria)) {
      setCategoriasExpandidas(categoriasExpandidas.filter(c => c !== categoria));
    } else {
      setCategoriasExpandidas([...categoriasExpandidas, categoria]);
    }
  };

  const todasAtividadesLista = () => {
    const lista: string[] = [];
    Object.entries(ATIVIDADES_DISPONIVEIS).forEach(([_, categoria]) => {
      Object.values(categoria.subtipos).forEach(subtipos => {
        lista.push(...subtipos);
      });
    });
    return lista;
  };

  return (
    <div className="space-y-6">
      {/* SELEÇÃO PRINCIPAL E SECUNDÁRIA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Atividade Principal <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={atividadePrincipal}
            onChange={(e) => {
              onChangePrincipal(e.target.value);
              onAtividadesSelecionadas([e.target.value, atividadeSecundaria].filter(Boolean));
            }}
            className="w-full px-4 py-3 rounded-lg border-2 border-emerald-600 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
          >
            <option value="">Selecione a atividade principal...</option>
            {todasAtividadesLista().map(atividade => (
              <option key={atividade} value={atividade}>
                {atividade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Atividade Secundária <span className="text-muted-foreground text-xs">(Opcional)</span>
          </label>
          <select
            value={atividadeSecundaria}
            onChange={(e) => {
              onChangeSecundaria(e.target.value);
              onAtividadesSelecionadas([atividadePrincipal, e.target.value].filter(Boolean));
            }}
            className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Nenhuma atividade secundária</option>
            {todasAtividadesLista()
              .filter(a => a !== atividadePrincipal)
              .map(atividade => (
                <option key={atividade} value={atividade}>
                  {atividade}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* RESUMO DAS ATIVIDADES SELECIONADAS */}
      {(atividadePrincipal || atividadeSecundaria) && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-500 p-5 rounded-lg animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="flex items-start gap-3">
            <Sprout className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-900 mb-2">
                Atividades Selecionadas:
              </p>
              <div className="space-y-1">
                {atividadePrincipal && (
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">
                      PRINCIPAL
                    </span>
                    <span className="text-sm font-semibold text-emerald-800">
                      {atividadePrincipal}
                    </span>
                  </div>
                )}
                {atividadeSecundaria && (
                  <div className="flex items-center gap-2">
                    <span className="bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded">
                      SECUNDÁRIA
                    </span>
                    <span className="text-sm font-semibold text-teal-800">
                      {atividadeSecundaria}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VISUALIZAÇÃO ORGANIZADA POR CATEGORIA */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h4 className="text-sm font-bold text-foreground mb-4">
          💡 Explore as atividades disponíveis por categoria:
        </h4>

        <div className="space-y-2">
          {Object.entries(ATIVIDADES_DISPONIVEIS).map(([categoria, dados]) => {
            const expandido = categoriasExpandidas.includes(categoria);

            return (
              <div key={categoria} className="border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleCategoria(categoria)}
                  className="w-full flex items-center justify-between p-4 bg-accent/40 hover:bg-accent transition-all"
                >
                  <span className="font-semibold text-foreground">
                    {dados.label}
                  </span>
                  {expandido ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {expandido && (
                  <div className="p-4 bg-background animate-in fade-in slide-in-from-top-1 duration-200">
                    {Object.entries(dados.subtipos).map(([subtipo, atividades]) => (
                      <div key={subtipo} className="mb-3 last:mb-0">
                        <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                          {subtipo.replace(/_/g, " ")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atividades.map(atividade => (
                            <button
                              key={atividade}
                              type="button"
                              onClick={() => {
                                if (!atividadePrincipal) {
                                  onChangePrincipal(atividade);
                                } else if (!atividadeSecundaria && atividade !== atividadePrincipal) {
                                  onChangeSecundaria(atividade);
                                }
                                onAtividadesSelecionadas([atividadePrincipal || atividade, atividadeSecundaria].filter(Boolean));
                              }}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                atividade === atividadePrincipal
                                  ? "bg-emerald-600 text-white shadow-md"
                                  : atividade === atividadeSecundaria
                                  ? "bg-teal-600 text-white shadow-md"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              {atividade}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* DICA */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>💡 Dica:</strong> Selecione a atividade principal (obrigatória) e, se houver, uma atividade secundária.
          Os campos específicos de cada atividade aparecerão automaticamente nas próximas etapas do cadastro.
        </p>
      </div>
    </div>
  );
}
