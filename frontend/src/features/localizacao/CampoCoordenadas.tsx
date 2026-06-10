import { useState, useEffect } from "react";
import { Navigation, RefreshCw } from "lucide-react";

interface Coordenadas {
  tipoCoordenada: "decimal" | "geografica";
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
}

interface CampoCoordenadasProps {
  dados: Coordenadas;
  onChange: (dados: Coordenadas) => void;
}

export default function CampoCoordenadas({ dados, onChange }: CampoCoordenadasProps) {
  const [conversaoAutomatica, setConversaoAutomatica] = useState(true);

  // Conversão de Decimal para Geográfico
  const decimalParaGeografico = (decimal: number, tipo: "lat" | "lng") => {
    const absoluto = Math.abs(decimal);
    const graus = Math.floor(absoluto);
    const minutosDecimal = (absoluto - graus) * 60;
    const minutos = Math.floor(minutosDecimal);
    const segundos = ((minutosDecimal - minutos) * 60).toFixed(2);

    const direcao = tipo === "lat"
      ? (decimal >= 0 ? "N" : "S")
      : (decimal >= 0 ? "E" : "W");

    return {
      graus: graus.toString(),
      minutos: minutos.toString(),
      segundos,
      direcao,
    };
  };

  // Conversão de Geográfico para Decimal
  const geograficoParaDecimal = (graus: string, minutos: string, segundos: string, direcao: string) => {
    const g = parseFloat(graus) || 0;
    const m = parseFloat(minutos) || 0;
    const s = parseFloat(segundos) || 0;

    let decimal = g + (m / 60) + (s / 3600);

    if (direcao === "S" || direcao === "W") {
      decimal = -decimal;
    }

    return decimal.toFixed(6);
  };

  // Quando mudar latitude decimal, atualizar geográfico
  useEffect(() => {
    if (conversaoAutomatica && dados.tipoCoordenada === "decimal" && dados.latitude) {
      const lat = parseFloat(dados.latitude);
      if (!isNaN(lat)) {
        const geo = decimalParaGeografico(lat, "lat");
        onChange({
          ...dados,
          latitudeGraus: geo.graus,
          latitudeMinutos: geo.minutos,
          latitudeSegundos: geo.segundos,
          latitudeDirecao: geo.direcao,
        });
      }
    }
  }, [dados, dados.latitude, dados.tipoCoordenada, conversaoAutomatica, onChange]);

  // Quando mudar longitude decimal, atualizar geográfico
  useEffect(() => {
    if (conversaoAutomatica && dados.tipoCoordenada === "decimal" && dados.longitude) {
      const lng = parseFloat(dados.longitude);
      if (!isNaN(lng)) {
        const geo = decimalParaGeografico(lng, "lng");
        onChange({
          ...dados,
          longitudeGraus: geo.graus,
          longitudeMinutos: geo.minutos,
          longitudeSegundos: geo.segundos,
          longitudeDirecao: geo.direcao,
        });
      }
    }
  }, [dados, dados.longitude, dados.tipoCoordenada, conversaoAutomatica, onChange]);

  useEffect(() => {
    if (
      conversaoAutomatica &&
      dados.tipoCoordenada === "geografica"
    ) {
      if (
        dados.latitudeGraus &&
        dados.latitudeMinutos &&
        dados.latitudeSegundos &&
        dados.latitudeDirecao
      ) {
        const latDecimal = geograficoParaDecimal(
          dados.latitudeGraus,
          dados.latitudeMinutos,
          dados.latitudeSegundos,
          dados.latitudeDirecao,
        );
        onChange({ ...dados, latitude: latDecimal });
      }

      if (
        dados.longitudeGraus &&
        dados.longitudeMinutos &&
        dados.longitudeSegundos &&
        dados.longitudeDirecao
      ) {
        const lngDecimal = geograficoParaDecimal(
          dados.longitudeGraus,
          dados.longitudeMinutos,
          dados.longitudeSegundos,
          dados.longitudeDirecao,
        );
        onChange({ ...dados, longitude: lngDecimal });
      }
    }
  }, [
    dados,
    dados.latitudeGraus,
    dados.latitudeMinutos,
    dados.latitudeSegundos,
    dados.latitudeDirecao,
    dados.longitudeGraus,
    dados.longitudeMinutos,
    dados.longitudeSegundos,
    dados.longitudeDirecao,
    dados.tipoCoordenada,
    conversaoAutomatica,
    onChange,
  ]);

  const obterLinkMapa = () => {
    if (dados.latitude && dados.longitude) {
      return `https://www.google.com/maps?q=${dados.latitude},${dados.longitude}`;
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* TIPO DE COORDENADA */}
      <div className="flex items-center justify-between">
        <label htmlFor="conversao-automatica" className="block text-sm font-semibold text-foreground">
          Formato das Coordenadas
        </label>
        <div className="flex items-center gap-2">
          <input
            id="conversao-automatica"
            type="checkbox"
            checked={conversaoAutomatica}
            onChange={(e) => setConversaoAutomatica(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <label htmlFor="conversao-automatica" className="text-xs text-muted-foreground cursor-pointer">
            Conversão automática
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange({ ...dados, tipoCoordenada: "decimal" })}
          className={`p-4 rounded-lg border-2 transition-all font-semibold ${
            dados.tipoCoordenada === "decimal"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
              : "border-border hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <div className="text-lg mb-1">🌐</div>
          Decimal
          <div className="text-xs text-muted-foreground mt-1">
            -3.123456, -60.123456
          </div>
        </button>

        <button
          type="button"
          onClick={() => onChange({ ...dados, tipoCoordenada: "geografica" })}
          className={`p-4 rounded-lg border-2 transition-all font-semibold ${
            dados.tipoCoordenada === "geografica"
              ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-md"
              : "border-border hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <div className="text-lg mb-1">📐</div>
          Geográfico
          <div className="text-xs text-muted-foreground mt-1">
            3° 7' 24.44" S
          </div>
        </button>
      </div>

      {/* CAMPOS DECIMAL */}
      {dados.tipoCoordenada === "decimal" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude-decimal" className="block text-sm font-semibold text-foreground mb-2">
                Latitude (Decimal)
              </label>
              <input
                id="latitude-decimal"
                type="text"
                value={dados.latitude}
                onChange={(e) => onChange({ ...dados, latitude: e.target.value })}
                placeholder="-3.123456"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Negativo = Sul | Positivo = Norte
              </p>
            </div>

            <div>
              <label htmlFor="longitude-decimal" className="block text-sm font-semibold text-foreground mb-2">
                Longitude (Decimal)
              </label>
              <input
                id="longitude-decimal"
                type="text"
                value={dados.longitude}
                onChange={(e) => onChange({ ...dados, longitude: e.target.value })}
                placeholder="-60.123456"
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Negativo = Oeste | Positivo = Leste
              </p>
            </div>
          </div>

          {/* CONVERSÃO AUTOMÁTICA - MOSTRA GEOGRÁFICO */}
          {conversaoAutomatica && dados.latitude && dados.longitude && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-xs font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Formato Geográfico (convertido automaticamente):
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <strong>Latitude:</strong> {dados.latitudeGraus}° {dados.latitudeMinutos}' {dados.latitudeSegundos}" {dados.latitudeDirecao}
                </div>
                <div>
                  <strong>Longitude:</strong> {dados.longitudeGraus}° {dados.longitudeMinutos}' {dados.longitudeSegundos}" {dados.longitudeDirecao}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CAMPOS GEOGRÁFICO */}
      {dados.tipoCoordenada === "geografica" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* LATITUDE */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-red-900 mb-3">
              Latitude (Geográfico)
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs text-red-800 mb-1">Graus</label>
                <input
                  type="number"
                  value={dados.latitudeGraus || ""}
                  onChange={(e) => onChange({ ...dados, latitudeGraus: e.target.value })}
                  placeholder="3"
                  className="w-full px-3 py-2 rounded border border-red-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-red-800 mb-1">Minutos</label>
                <input
                  type="number"
                  value={dados.latitudeMinutos || ""}
                  onChange={(e) => onChange({ ...dados, latitudeMinutos: e.target.value })}
                  placeholder="7"
                  className="w-full px-3 py-2 rounded border border-red-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-red-800 mb-1">Segundos</label>
                <input
                  type="number"
                  step="0.01"
                  value={dados.latitudeSegundos || ""}
                  onChange={(e) => onChange({ ...dados, latitudeSegundos: e.target.value })}
                  placeholder="24.44"
                  className="w-full px-3 py-2 rounded border border-red-300 bg-white"
                />
              </div>
              <div>
                <label htmlFor="latitude-direcao" className="block text-xs text-red-800 mb-1">Direção</label>
                <select
                  id="latitude-direcao"
                  value={dados.latitudeDirecao || "S"}
                  onChange={(e) => onChange({ ...dados, latitudeDirecao: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-red-300 bg-white"
                >
                  <option value="N">N</option>
                  <option value="S">S</option>
                </select>
              </div>
            </div>
          </div>

          {/* LONGITUDE */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-blue-900 mb-3">
              Longitude (Geográfico)
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-xs text-blue-800 mb-1">Graus</label>
                <input
                  type="number"
                  value={dados.longitudeGraus || ""}
                  onChange={(e) => onChange({ ...dados, longitudeGraus: e.target.value })}
                  placeholder="60"
                  className="w-full px-3 py-2 rounded border border-blue-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-800 mb-1">Minutos</label>
                <input
                  type="number"
                  value={dados.longitudeMinutos || ""}
                  onChange={(e) => onChange({ ...dados, longitudeMinutos: e.target.value })}
                  placeholder="1"
                  className="w-full px-3 py-2 rounded border border-blue-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-blue-800 mb-1">Segundos</label>
                <input
                  type="number"
                  step="0.01"
                  value={dados.longitudeSegundos || ""}
                  onChange={(e) => onChange({ ...dados, longitudeSegundos: e.target.value })}
                  placeholder="15.12"
                  className="w-full px-3 py-2 rounded border border-blue-300 bg-white"
                />
              </div>
              <div>
                <label htmlFor="longitude-direcao" className="block text-xs text-blue-800 mb-1">Direção</label>
                <select
                  id="longitude-direcao"
                  value={dados.longitudeDirecao || "W"}
                  onChange={(e) => onChange({ ...dados, longitudeDirecao: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-blue-300 bg-white"
                >
                  <option value="E">E</option>
                  <option value="W">W</option>
                </select>
              </div>
            </div>
          </div>

          {/* CONVERSÃO AUTOMÁTICA - MOSTRA DECIMAL */}
          {conversaoAutomatica && dados.latitude && dados.longitude && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <p className="text-xs font-semibold text-green-900 mb-2 flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Formato Decimal (convertido automaticamente):
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                <div>
                  <strong>Latitude:</strong> {dados.latitude}
                </div>
                <div>
                  <strong>Longitude:</strong> {dados.longitude}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* BOTÃO VER NO MAPA */}
      {dados.latitude && dados.longitude && obterLinkMapa() && (
        <a
          href={obterLinkMapa()!}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg font-semibold"
        >
          <Navigation className="w-5 h-5" />
          Ver Localização no Google Maps
        </a>
      )}
    </div>
  );
}
