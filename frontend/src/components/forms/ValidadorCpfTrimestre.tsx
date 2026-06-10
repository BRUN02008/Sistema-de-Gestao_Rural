import { useState, useEffect, useCallback } from "react";
import { AlertCircle, CheckCircle, Calendar, TrendingUp, User } from "lucide-react";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  trimestre?: string;
  anoTrimestre?: string;
  [key: string]: unknown;
}

interface ValidadorCpfTrimestreProps {
  cpf: string;
  onProdutorEncontrado: (produtor: Produtor) => void;
  onNovoCadastro: () => void;
  onTrimestreChange: (trimestre: string, ano: string) => void;
  trimestreAtual?: string;
  anoAtual?: string;
  disabled?: boolean;
}

export default function ValidadorCpfTrimestre({
  cpf,
  onProdutorEncontrado,
  onNovoCadastro,
  onTrimestreChange,
  trimestreAtual = "1",
  anoAtual,
  disabled = false
}: ValidadorCpfTrimestreProps) {
  const [produtorExistente, setProdutorExistente] = useState<Produtor | null>(null);
  const [verificando, setVerificando] = useState(false);
  const [trimestre, setTrimestre] = useState(trimestreAtual);
  const [ano, setAno] = useState(anoAtual || new Date().getFullYear().toString());

  const limparCpf = (valor: string) => valor.replace(/\D/g, "");

  const carregarProdutores = (): Produtor[] => {
    try {
      return JSON.parse(localStorage.getItem("produtores") || "[]");
    } catch {
      return [];
    }
  };

  const verificarCpf = useCallback(
    (cpfValue: string) => {
      setVerificando(true);
      const cpfLimpo = limparCpf(cpfValue);

      const produtores = carregarProdutores();
      const produtorEncontrado = produtores.find(
        (p: Produtor) => limparCpf(String(p.cpf)) === cpfLimpo
      );

      if (produtorEncontrado) {
        const trimestreEncontrado = produtorEncontrado.trimestre || trimestreAtual;
        const anoEncontrado =
          produtorEncontrado.anoTrimestre || anoAtual || new Date().getFullYear().toString();

        setProdutorExistente(produtorEncontrado);
        setTrimestre(trimestreEncontrado);
        setAno(anoEncontrado);
        onProdutorEncontrado(produtorEncontrado);
        onTrimestreChange(trimestreEncontrado, anoEncontrado);
      } else {
        const anoPadrao = anoAtual || new Date().getFullYear().toString();

        setProdutorExistente(null);
        setTrimestre(trimestreAtual);
        setAno(anoPadrao);
        onNovoCadastro();
        onTrimestreChange(trimestreAtual, anoPadrao);
      }

      setVerificando(false);
    },
    [anoAtual, onNovoCadastro, onProdutorEncontrado, onTrimestreChange, trimestreAtual]
  );

  useEffect(() => {
    const cpfLimpo = limparCpf(cpf);

    if (cpfLimpo.length === 11) {
      queueMicrotask(() => verificarCpf(cpfLimpo));
    } else {
      queueMicrotask(() => {
        setProdutorExistente(null);
        setTrimestre(trimestreAtual);
        setAno(anoAtual || new Date().getFullYear().toString());
      });
    }
  }, [cpf, trimestreAtual, anoAtual, verificarCpf]);

  const proximoTrimestre = () => {
    if (produtorExistente) {
      const trimestreNumero = parseInt(produtorExistente.trimestre || "1");
      let novoTrimestre = trimestreNumero + 1;
      let novoAno = parseInt(produtorExistente.anoTrimestre || ano);

      if (novoTrimestre > 4) {
        novoTrimestre = 1;
        novoAno += 1;
      }

      setTrimestre(novoTrimestre.toString());
      setAno(novoAno.toString());
      onTrimestreChange(novoTrimestre.toString(), novoAno.toString());
    }
  };

  const selecionarTrimestre = (trimestreValue: string) => {
    setTrimestre(trimestreValue);
    onTrimestreChange(trimestreValue, ano);
  };

  const cpfValido = limparCpf(cpf).length === 11;

  return (
    <div className="space-y-4">
      {/* STATUS DA VERIFICAÇÃO */}
      {cpfValido && (
        <div className="animate-in fade-in duration-300">
          {verificando ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-800">Verificando CPF...</p>
              </div>
            </div>
          ) : produtorExistente ? (
            <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-amber-900 mb-2">
                    CPF já cadastrado no sistema
                  </p>
                  <div className="space-y-2 text-sm text-amber-800">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span><strong>Nome:</strong> {produtorExistente.nome}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        <strong>Trimestre Atual:</strong> {produtorExistente.trimestre || "1"}º
                        Trimestre de {produtorExistente.anoTrimestre || new Date().getFullYear()}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-white/60 rounded border border-amber-300">
                    <p className="text-xs font-semibold text-amber-900 mb-1">
                      ⚠️ Atenção
                    </p>
                    <p className="text-xs text-amber-800">
                      Os dados foram carregados automaticamente. Você pode atualizar as informações
                      para um novo trimestre ou editar os dados existentes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800">
                  <strong>CPF disponível.</strong> Este será um novo cadastro (1º Trimestre).
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SELETOR DE TRIMESTRE */}
      {produtorExistente && !disabled && (
        <div className="bg-card rounded-xl border-2 border-purple-500/20 p-6 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-foreground">
              Controle de Trimestre
            </h3>
          </div>

          <div className="space-y-4">
            {/* Trimestre Atual */}
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <p className="text-sm text-purple-700 mb-2">
                <strong>Trimestre Atual do Produtor:</strong>
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {produtorExistente.trimestre || "1"}º Trimestre de{" "}
                {produtorExistente.anoTrimestre || new Date().getFullYear()}
              </p>
            </div>

            {/* Botão para Avançar Trimestre */}
            <button
              onClick={proximoTrimestre}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-semibold flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Atualizar para Próximo Trimestre ({parseInt(produtorExistente.trimestre || "1") < 4
                ? `${parseInt(produtorExistente.trimestre || "1") + 1}º Trimestre`
                : `1º Trimestre de ${parseInt(produtorExistente.anoTrimestre || ano) + 1}`})
            </button>

            {/* Seleção Manual de Trimestre */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Ou selecione um trimestre específico:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["1", "2", "3", "4"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => selecionarTrimestre(t)}
                    className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                      trimestre === t
                        ? "border-purple-500 bg-purple-100 text-purple-700"
                        : "border-border hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                  >
                    {t}º Trim.
                  </button>
                ))}
              </div>
            </div>

            {/* Ano */}
            <div>
              <label htmlFor="ano-trimestre" className="text-sm font-medium text-foreground block mb-2">
                Ano:
              </label>
              <select
                id="ano-trimestre"
                value={ano}
                onChange={(e) => {
                  setAno(e.target.value);
                  onTrimestreChange(trimestre, e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {Array.from({ length: 5 }, (_, i) => {
                  const anoOpcao = new Date().getFullYear() - 2 + i;
                  return (
                    <option key={anoOpcao} value={anoOpcao}>
                      {anoOpcao}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Informação sobre o salvamento */}
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>ℹ️ Informação:</strong> Ao salvar, os dados serão atualizados para o{" "}
                <strong>{trimestre}º Trimestre de {ano}</strong> e um registro histórico será criado.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* INFORMAÇÃO SOBRE NOVO CADASTRO */}
      {!produtorExistente && cpfValido && !verificando && (
        <div className="bg-card rounded-xl border-2 border-green-500/20 p-6 shadow-md animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-foreground">
              Primeiro Cadastro
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Este cadastro será registrado como <strong>1º Trimestre de{" "}
            {new Date().getFullYear()}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}
