interface Props {
  produtor: {
    nome: string;
    cpf?: string;
  };
  recomendacao: string;
  tecnicoResponsavel: string;
  data: string;
}

function formatarData(data: string) {
  if (!data) return new Date().toLocaleDateString("pt-BR");
  const d = new Date(data);
  if (isNaN(d.getTime())) return data;
  return d.toLocaleDateString("pt-BR");
}

export default function RecomendacoesDocumento({
  produtor,
  recomendacao,
  tecnicoResponsavel,
  data,
}: Props) {
  // Dividir o texto em linhas para exibir no formato do documento
  const linhasRecomendacao = recomendacao.split('\n');

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .impressao-recomendacoes {
            width: 100% !important;
            max-width: 100% !important;
            padding: 12px !important;
            font-size: 9pt !important;
            line-height: 1.4 !important;
            page-break-inside: avoid !important;
            transform: scale(0.95);
            transform-origin: top left;
          }

          .impressao-recomendacoes .linha-recomendacao {
            min-height: 18px !important;
            line-height: 18px !important;
            padding: 2px 4px !important;
          }
        }
      `}</style>
      <div
        className="bg-white text-black mx-auto impressao-recomendacoes w-[794px] min-h-[1123px] px-[60px] py-[40px] font-[Arial,_sans-serif] text-[11pt] leading-[1.5]"
      >
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-xs font-bold bg-[linear-gradient(135deg,_#2e7d32_0%,_#66bb6a_100%)] text-white">
              AM
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2e7d32]">
                AMAZONAS
              </h1>
              <p className="text-sm text-[#2e7d32]">
                GOVERNO DO ESTADO
              </p>
            </div>
          </div>
        </div>

        {/* Título */}
        <div className="text-center mb-6 p-3 border-2 border-[#555] bg-[#e0e0e0]">
          <h2 className="text-xl font-bold uppercase">
            RECOMENDAÇÕES TÉCNICAS
          </h2>
        </div>

        {/* Informações do Produtor */}
        <div className="mb-4 text-sm">
          <p>
            <strong>Beneficiário:</strong> {produtor.nome}
          </p>
          {produtor.cpf && (
            <p>
              <strong>CPF:</strong> {produtor.cpf}
            </p>
          )}
          <p>
            <strong>Data:</strong> {formatarData(data)}
          </p>
        </div>

        {/* Área de Recomendações com linhas */}
        <div className="border-2 border-[#555] mb-6 min-h-[550px] p-3">
          {recomendacao ? (
            <div className="whitespace-pre-wrap text-[11pt] leading-[26px]">
              {linhasRecomendacao.map((linha, index) => (
                <div
                  key={index}
                  className="linha-recomendacao border-b border-slate-300 last:border-none min-h-[26px] px-1 py-0.5"
                >
                  {linha || "\u00A0"}
                </div>
              ))}
              {/* Adicionar linhas vazias para preencher o espaço */}
              {Array.from({ length: Math.max(0, 20 - linhasRecomendacao.length) }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="linha-recomendacao border-b border-slate-300 min-h-[26px] px-1 py-0.5"
                >
                  &nbsp;
                </div>
              ))}
            </div>
          ) : (
            // Se não houver recomendação, mostrar apenas linhas vazias
            Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="linha-recomendacao border-b border-slate-300 min-h-[26px] px-1 py-0.5"
              >
                &nbsp;
              </div>
            ))
          )}
        </div>

        {/* Assinaturas */}
        <div className="grid grid-cols-2 gap-16 mt-12">
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 mt-16">
              <p className="font-semibold">Técnico (a)</p>
              {tecnicoResponsavel && (
                <p className="text-sm mt-1">{tecnicoResponsavel}</p>
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="border-t-2 border-black pt-2 mt-16">
              <p className="font-semibold">Beneficiário (a)</p>
              {produtor.nome && (
                <p className="text-sm mt-1">{produtor.nome}</p>
              )}
            </div>
          </div>
        </div>

        {/* Rodapé com logos e endereço */}
        <div className="mt-16 pt-6 border-t border-gray-300">
          <div className="flex items-end justify-between">
            <div className="text-xs text-[#555]">
              <p>Avenida Carlos Drummond de Andrade</p>
              <p>1460 - Bloco G - 2º Andar</p>
              <p>Conj. Atílio Andreazza - Japiim</p>
              <p>Manaus - AM - CEP: 69077-730</p>
              <p>Fone: (92) 3614 - 8151</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="px-6 py-3 rounded-lg font-bold text-white text-2xl bg-[linear-gradient(135deg,_#1565c0_0%,_#42a5f5_100%)]">
                DAM
              </div>
              <div className="w-24 h-16 rounded-lg bg-[linear-gradient(135deg,_#2e7d32_0%,_#66bb6a_50%,_#1565c0_100%)]"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
