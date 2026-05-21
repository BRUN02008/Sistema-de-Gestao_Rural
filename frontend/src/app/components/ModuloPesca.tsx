import { useState, useEffect } from "react";
import { Fish, Plus, Trash2, MapPin, Calendar } from "lucide-react";
import { Badge } from "./ui/badge";

interface DadosPesca {
  tipoPesca: string;
  pescaSubsistencia: boolean;
  rgPesca: string;
  protocoloRgp: string;
  localPesca: string;
  margemPesca: string;
  producaoTotal: string;
  especies: Array<{
    nome: string;
    kg: string;
  }>;
  observacoesTecnicas: string;
  trimestre?: string;
  ano?: string;
}

interface ModuloPescaProps {
  dados: DadosPesca;
  onChange: (dados: DadosPesca) => void;
  trimestre?: string;
  ano?: string;
  disabled?: boolean;
}

export default function ModuloPesca({
  dados,
  onChange,
  trimestre = "1",
  ano,
  disabled = false
}: ModuloPescaProps) {
  const [abaAtiva, setAbaAtiva] = useState<"geral" | "subsistencia" | "observacoes">("geral");

  useEffect(() => {
    onChange({
      ...dados,
      trimestre,
      ano
    });
  }, [trimestre, ano]);

  const adicionarEspecie = () => {
    onChange({
      ...dados,
      especies: [...dados.especies, { nome: "", kg: "" }]
    });
  };

  const removerEspecie = (index: number) => {
    onChange({
      ...dados,
      especies: dados.especies.filter((_, i) => i !== index)
    });
  };

  const atualizarEspecie = (index: number, campo: "nome" | "kg", valor: string) => {
    const novasEspecies = [...dados.especies];
    novasEspecies[index][campo] = valor;
    onChange({
      ...dados,
      especies: novasEspecies
    });
  };

  return (
    <div className="space-y-6">
      {/* HEADER DO MÓDULO */}
      <div
        className="rounded-xl p-6 shadow-lg text-white"
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #14b8a6 100%)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-lg">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Módulo de Pesca
              </h2>
              <p className="text-white/90 mt-1">
                Informações completas sobre atividades pesqueiras
              </p>
            </div>
          </div>
          {trimestre && ano && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-xs text-white/80">Trimestre</p>
              <p className="text-lg font-bold text-white">
                {trimestre}º / {ano}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ABAS */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setAbaAtiva("geral")}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              abaAtiva === "geral"
                ? "bg-cyan-50 text-cyan-700 border-b-2 border-cyan-500"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Dados Gerais
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("subsistencia")}
            className={`flex-1 px-6 py-4 font-semibold transition-all flex items-center justify-center gap-2 ${
              abaAtiva === "subsistencia"
                ? "bg-teal-50 text-teal-700 border-b-2 border-teal-500"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Pesca de Subsistência
            {dados.pescaSubsistencia && (
              <Badge className="bg-teal-600 text-white">Ativo</Badge>
            )}
          </button>
          <button
            type="button"
            onClick={() => setAbaAtiva("observacoes")}
            className={`flex-1 px-6 py-4 font-semibold transition-all ${
              abaAtiva === "observacoes"
                ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500"
                : "text-muted-foreground hover:bg-accent"
            }`}
          >
            Observações Técnicas
          </button>
        </div>

        <div className="p-6">
          {/* ABA: DADOS GERAIS */}
          {abaAtiva === "geral" && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Tipo de Pesca
                  </label>
                  <select
                    value={dados.tipoPesca}
                    onChange={(e) => onChange({ ...dados, tipoPesca: e.target.value })}
                    disabled={disabled}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  >
                    <option value="">Selecione...</option>
                    <option value="Pesca Artesanal">Pesca Artesanal</option>
                    <option value="Pesca Comercial">Pesca Comercial</option>
                    <option value="Piscicultura">Piscicultura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">
                    RG Pesca
                  </label>
                  <input
                    type="text"
                    value={dados.rgPesca}
                    onChange={(e) => onChange({ ...dados, rgPesca: e.target.value })}
                    disabled={disabled}
                    placeholder="Número do RG de Pescador"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Protocolo RGP
                  </label>
                  <input
                    type="text"
                    value={dados.protocoloRgp}
                    onChange={(e) => onChange({ ...dados, protocoloRgp: e.target.value })}
                    disabled={disabled}
                    placeholder="Número do protocolo"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-600" />
                    Local de Pesca
                  </label>
                  <input
                    type="text"
                    value={dados.localPesca}
                    onChange={(e) => onChange({ ...dados, localPesca: e.target.value })}
                    disabled={disabled}
                    placeholder="Rio, lago, etc."
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Margem
                  </label>
                  <select
                    value={dados.margemPesca}
                    onChange={(e) => onChange({ ...dados, margemPesca: e.target.value })}
                    disabled={disabled}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  >
                    <option value="">Selecione...</option>
                    <option value="Esquerda">Margem Esquerda</option>
                    <option value="Direita">Margem Direita</option>
                    <option value="Ambas">Ambas as Margens</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-medium mb-2">
                    Produção Total (KG)
                  </label>
                  <input
                    type="number"
                    value={dados.producaoTotal}
                    onChange={(e) => onChange({ ...dados, producaoTotal: e.target.value })}
                    disabled={disabled}
                    placeholder="0"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* ESPÉCIES */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-foreground font-semibold">
                    Espécies Capturadas
                  </label>
                  {!disabled && (
                    <button
                      type="button"
                      onClick={adicionarEspecie}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Espécie
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  {dados.especies.map((especie, index) => (
                    <div
                      key={index}
                      className="flex gap-3 items-end bg-cyan-50 p-4 rounded-lg border border-cyan-200"
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-cyan-900 mb-1">
                          Nome da Espécie
                        </label>
                        <input
                          type="text"
                          value={especie.nome}
                          onChange={(e) => atualizarEspecie(index, "nome", e.target.value)}
                          disabled={disabled}
                          placeholder="Ex: Tambaqui, Pirarucu..."
                          className="w-full px-3 py-2 rounded border border-cyan-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        />
                      </div>

                      <div className="w-32">
                        <label className="block text-sm font-medium text-cyan-900 mb-1">
                          KG
                        </label>
                        <input
                          type="number"
                          value={especie.kg}
                          onChange={(e) => atualizarEspecie(index, "kg", e.target.value)}
                          disabled={disabled}
                          placeholder="0"
                          className="w-full px-3 py-2 rounded border border-cyan-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                        />
                      </div>

                      {!disabled && (
                        <button
                          type="button"
                          onClick={() => removerEspecie(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                          title="Remover espécie"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  {dados.especies.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Fish className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Nenhuma espécie cadastrada</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ABA: PESCA DE SUBSISTÊNCIA */}
          {abaAtiva === "subsistencia" && (
            <div className="space-y-5">
              {/* Ativação */}
              <div className="bg-teal-50 border-2 border-teal-200 p-5 rounded-lg">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dados.pescaSubsistencia}
                    onChange={(e) => onChange({ ...dados, pescaSubsistencia: e.target.checked })}
                    disabled={disabled}
                    className="w-5 h-5 rounded border-teal-400 text-teal-600 focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-teal-900">
                      Este produtor pratica pesca de subsistência
                    </p>
                    <p className="text-sm text-teal-700 mt-1">
                      Marque esta opção se o produtor pesca para consumo próprio e familiar
                    </p>
                  </div>
                </label>
              </div>

              {dados.pescaSubsistencia ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="bg-card border border-border p-5 rounded-lg">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Fish className="w-5 h-5 text-teal-600" />
                      Informações Específicas
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Tipo de Pesca
                        </label>
                        <input
                          type="text"
                          value={dados.tipoPesca}
                          onChange={(e) => onChange({ ...dados, tipoPesca: e.target.value })}
                          disabled={disabled}
                          placeholder="Ex: Pesca Artesanal"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Local Principal de Pesca
                        </label>
                        <input
                          type="text"
                          value={dados.localPesca}
                          onChange={(e) => onChange({ ...dados, localPesca: e.target.value })}
                          disabled={disabled}
                          placeholder="Ex: Rio Amazonas"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Margem de Atuação
                        </label>
                        <select
                          value={dados.margemPesca}
                          onChange={(e) => onChange({ ...dados, margemPesca: e.target.value })}
                          disabled={disabled}
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                        >
                          <option value="">Selecione...</option>
                          <option value="Esquerda">Margem Esquerda</option>
                          <option value="Direita">Margem Direita</option>
                          <option value="Ambas">Ambas as Margens</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Produção Aproximada (KG/mês)
                        </label>
                        <input
                          type="number"
                          value={dados.producaoTotal}
                          onChange={(e) => onChange({ ...dados, producaoTotal: e.target.value })}
                          disabled={disabled}
                          placeholder="0"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Espécies para Subsistência */}
                  <div className="bg-card border border-border p-5 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">
                        Espécies Capturadas (Subsistência)
                      </h3>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={adicionarEspecie}
                          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all text-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {dados.especies.map((especie, index) => (
                        <div
                          key={index}
                          className="flex gap-3 items-end bg-teal-50 p-4 rounded-lg"
                        >
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-teal-900 mb-1">
                              Espécie
                            </label>
                            <input
                              type="text"
                              value={especie.nome}
                              onChange={(e) => atualizarEspecie(index, "nome", e.target.value)}
                              disabled={disabled}
                              placeholder="Nome da espécie"
                              className="w-full px-3 py-2 rounded border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                            />
                          </div>

                          <div className="w-32">
                            <label className="block text-sm font-medium text-teal-900 mb-1">
                              KG/mês
                            </label>
                            <input
                              type="number"
                              value={especie.kg}
                              onChange={(e) => atualizarEspecie(index, "kg", e.target.value)}
                              disabled={disabled}
                              placeholder="0"
                              className="w-full px-3 py-2 rounded border border-teal-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
                            />
                          </div>

                          {!disabled && (
                            <button
                              type="button"
                              onClick={() => removerEspecie(index)}
                              className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}

                      {dados.especies.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          <p className="text-sm">Nenhuma espécie cadastrada</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Fish className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p>Ative a pesca de subsistência para preencher os dados específicos</p>
                </div>
              )}
            </div>
          )}

          {/* ABA: OBSERVAÇÕES TÉCNICAS */}
          {abaAtiva === "observacoes" && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Observações do {trimestre}º Trimestre de {ano}
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Use este campo para registrar informações técnicas importantes sobre a atividade pesqueira no trimestre atual
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-foreground font-semibold mb-2">
                  Observações Técnicas
                </label>
                <textarea
                  value={dados.observacoesTecnicas}
                  onChange={(e) => onChange({ ...dados, observacoesTecnicas: e.target.value })}
                  disabled={disabled}
                  rows={12}
                  placeholder="Registre aqui as observações técnicas sobre a atividade pesqueira do produtor neste trimestre. Exemplos:&#10;&#10;- Condições dos equipamentos de pesca&#10;- Qualidade e quantidade da produção&#10;- Recomendações técnicas específicas&#10;- Observações sobre práticas sustentáveis&#10;- Necessidades de capacitação ou assistência&#10;- Mudanças observadas em relação ao trimestre anterior"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {dados.observacoesTecnicas.length} caracteres
                </p>
              </div>

              {dados.observacoesTecnicas && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Observações salvas com sucesso para o {trimestre}º trimestre
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
