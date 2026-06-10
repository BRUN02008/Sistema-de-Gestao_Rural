//import { useEffect } from "react";
import { MapPin} from "lucide-react";

interface CampoLocalizacaoData {
  tipoLocalizacao: string;
  especificacaoLocalizacao: string;
  km: string;
  margem: string;
}

interface CampoLocalizacaoProps {
  dados: CampoLocalizacaoData;
  onChange: (dados: CampoLocalizacaoData) => void;
}

export default function CampoLocalizacao({ dados, onChange }: CampoLocalizacaoProps) {
  const tiposLocalizacao = [
    { value: "rodovia", label: "Rodovia", exigeKm: true, exigeMargem: true },
    { value: "ramal", label: "Ramal", exigeKm: true, exigeMargem: true },
    { value: "rio", label: "Rio", exigeKm: false, exigeMargem: true },
    { value: "lago", label: "Lago", exigeKm: false, exigeMargem: true },
    { value: "igarape", label: "Igarapé", exigeKm: false, exigeMargem: true },
    { value: "estrada_vicinal", label: "Estrada Vicinal", exigeKm: true, exigeMargem: false },
    { value: "outro", label: "Outro", exigeKm: false, exigeMargem: false },
  ];

  const tipoSelecionado = tiposLocalizacao.find(t => t.value === dados.tipoLocalizacao);

  return (
    <div className="space-y-5">
      {/* TIPO DE LOCALIZAÇÃO */}
      <div>
        <label htmlFor="tipo-localizacao" className="block text-sm font-semibold text-foreground mb-2">
          Tipo de Localização <span className="text-red-500">*</span>
        </label>
        <select
          id="tipo-localizacao"
          required
          value={dados.tipoLocalizacao}
          onChange={(e) => {
            onChange({
              ...dados,
              tipoLocalizacao: e.target.value,
              // Limpar campos que não se aplicam ao novo tipo
              km: "",
              margem: "",
            });
          }}
          className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="">Selecione o tipo...</option>
          {tiposLocalizacao.map(tipo => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      {/* ESPECIFICAÇÃO */}
      {dados.tipoLocalizacao && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-sm font-semibold text-foreground mb-2">
            {dados.tipoLocalizacao === "rodovia" && "Nome da Rodovia"}
            {dados.tipoLocalizacao === "ramal" && "Nome do Ramal"}
            {dados.tipoLocalizacao === "rio" && "Nome do Rio"}
            {dados.tipoLocalizacao === "lago" && "Nome do Lago"}
            {dados.tipoLocalizacao === "igarape" && "Nome do Igarapé"}
            {dados.tipoLocalizacao === "estrada_vicinal" && "Nome da Estrada"}
            {dados.tipoLocalizacao === "outro" && "Especificação"}
            {" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={dados.especificacaoLocalizacao}
            onChange={(e) => onChange({ ...dados, especificacaoLocalizacao: e.target.value })}
            placeholder={
              dados.tipoLocalizacao === "rodovia" ? "Ex: AM-010, BR-174..." :
              dados.tipoLocalizacao === "ramal" ? "Ex: Ramal do Brasileirinho..." :
              dados.tipoLocalizacao === "rio" ? "Ex: Rio Negro, Rio Solimões..." :
              dados.tipoLocalizacao === "lago" ? "Ex: Lago do Catalão..." :
              dados.tipoLocalizacao === "igarape" ? "Ex: Igarapé do Mindú..." :
              "Especifique a localização..."
            }
            className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      )}

      {/* CAMPOS ESPECÍFICOS POR TIPO */}
      {dados.tipoLocalizacao && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* KM (para rodovia, ramal, estrada) */}
          {tipoSelecionado?.exigeKm && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-blue-900 mb-2">
                Quilômetro (KM) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={dados.km}
                onChange={(e) => onChange({ ...dados, km: e.target.value })}
                placeholder="Ex: 23, 45.5, KM 12..."
                className="w-full px-3 py-2 rounded border border-blue-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-blue-700 mt-2">
                Informe a distância em quilômetros
              </p>
            </div>
          )}

          {/* MARGEM (para rios, lagos, igarapés, rodovias, ramais) */}
          {tipoSelecionado?.exigeMargem && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <label htmlFor="margem-localizacao" className="block text-sm font-semibold text-green-900 mb-2">
                {dados.tipoLocalizacao === "rodovia" || dados.tipoLocalizacao === "ramal" || dados.tipoLocalizacao === "estrada_vicinal"
                  ? "Lado da Via"
                  : "Margem"}
                {" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id="margem-localizacao"
                required
                value={dados.margem}
                onChange={(e) => onChange({ ...dados, margem: e.target.value })}
                className="w-full px-3 py-2 rounded border border-green-300 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Selecione...</option>
                {dados.tipoLocalizacao === "rodovia" || dados.tipoLocalizacao === "ramal" || dados.tipoLocalizacao === "estrada_vicinal" ? (
                  <>
                    <option value="Esquerda">Lado Esquerdo</option>
                    <option value="Direita">Lado Direito</option>
                  </>
                ) : (
                  <>
                    <option value="Esquerda">Margem Esquerda</option>
                    <option value="Direita">Margem Direita</option>
                  </>
                )}
              </select>
              <p className="text-xs text-green-700 mt-2">
                {dados.tipoLocalizacao === "rodovia" || dados.tipoLocalizacao === "ramal" || dados.tipoLocalizacao === "estrada_vicinal"
                  ? "Sentido da capital para o interior"
                  : "Sentido da nascente para a foz"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* RESUMO DA LOCALIZAÇÃO */}
      {dados.tipoLocalizacao && dados.especificacaoLocalizacao && (
        <div className="bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-900 mb-1">
                📍 Localização da Propriedade:
              </p>
              <p className="text-sm text-emerald-800">
                {dados.especificacaoLocalizacao}
                {dados.km && `, KM ${dados.km}`}
                {dados.margem && `, ${dados.margem}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
