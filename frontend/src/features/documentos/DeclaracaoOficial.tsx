interface ProdutorData {
  [key: string]: unknown;
}

interface Props {
  produtor: ProdutorData;
}

function valor(v: unknown, fallback = "________________") {
  if (v === null || v === undefined || v === "") return fallback;
  return String(v);
}

function formatarData(data?: string) {
  if (!data) return "____/____/______";
  const d = new Date(data);
  if (isNaN(d.getTime())) return data;
  return d.toLocaleDateString("pt-BR");
}

function formatarArea(produtor: ProdutorData) {
  return valor(produtor.areaTotal, "________________");
}

function formatarProducaoPropriedade(produtor: ProdutorData) {
  const itens: string[] = [];

  if (produtor.culturaPrincipal) {
    itens.push(String(produtor.culturaPrincipal));
  }

  if (Array.isArray(produtor.producaoFlorestal)) {
    produtor.producaoFlorestal.forEach((item) => {
      if (
        item &&
        typeof item === "object" &&
        "produto" in item &&
        (item as Record<string, unknown>).produto
      ) {
        itens.push(String((item as Record<string, unknown>).produto));
      }
    });
  }

  if (Array.isArray(produtor.pecuaria)) {
    produtor.pecuaria.forEach((item) => {
      if (
        item &&
        typeof item === "object" &&
        "tipo" in item &&
        (item as Record<string, unknown>).tipo
      ) {
        itens.push(String((item as Record<string, unknown>).tipo));
      }
    });
  }

  if (Array.isArray(produtor.abelhas)) {
    produtor.abelhas.forEach((item) => {
      if (
        item &&
        typeof item === "object" &&
        "tipo" in item &&
        (item as Record<string, unknown>).tipo
      ) {
        itens.push(String((item as Record<string, unknown>).tipo));
      }
    });
  }

  if (itens.length === 0 && produtor.outrasProducoes) {
    itens.push(String(produtor.outrasProducoes));
  }

  return itens.length > 0 ? itens.join(", ") : "________________";
}

export default function DeclaracaoOficial({ produtor }: Props) {
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  const nome = valor(produtor.nome);
  const cpf = valor(produtor.cpf);
  const rg = valor(produtor.rg);
  const situacaoImovel =
    valor(produtor.situacaoImovel, "proprietário(a)");
  const areaTotal = formatarArea(produtor);
  const nomeImovel = valor(produtor.nomeImovel);
  const enderecoImovel =
    valor(produtor.logradouro, "________________");
  const comunidade = valor(produtor.comunidade);
  const municipio = valor(produtor.municipio);
  const numeroControle = valor(produtor.codigoUnloc || produtor.id);
  const rgpCpp = valor(produtor.codigoRgp);
  const unloc = valor(produtor.municipioUf || produtor.municipio);
  const anoAssistencia = valor(produtor.anoEmissao);
  const atividadePrincipal = valor(produtor.atividadePrincipal);
  const atividadeSecundaria = valor(produtor.atividadeSecundaria);
  const producaoPropriedade = formatarProducaoPropriedade(produtor);
  const latitude = valor(produtor.latitude);
  const longitude = valor(produtor.longitude);
  const tecnico = valor(produtor.tecnicoResponsavel);
  const gerente = valor(produtor.gerente);
  const observacoes =
    valor(produtor.observacoes, "Sem observações.");
  const contato = valor(produtor.telefone);

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

          .impressao-declaracao {
            width: 100% !important;
            max-width: 100% !important;
            padding: 12px 16px !important;
            font-size: 8pt !important;
            line-height: 1.3 !important;
            page-break-inside: avoid !important;
            transform: scale(0.88);
            transform-origin: top left;
          }

          .impressao-declaracao h1 {
            font-size: 13pt !important;
            margin-bottom: 6px !important;
          }

          .impressao-declaracao p {
            margin-bottom: 4px !important;
            margin-top: 4px !important;
          }

          .impressao-declaracao .mb-10 {
            margin-bottom: 8px !important;
          }

          .impressao-declaracao .mb-8 {
            margin-bottom: 6px !important;
          }

          .impressao-declaracao .mb-6 {
            margin-bottom: 5px !important;
          }

          .impressao-declaracao .mb-4 {
            margin-bottom: 4px !important;
          }

          .impressao-declaracao .mt-10 {
            margin-top: 8px !important;
          }

          .impressao-declaracao .mt-8 {
            margin-top: 6px !important;
          }

          .impressao-declaracao .leading-relaxed {
            line-height: 1.3 !important;
          }
        }
      `}</style>
      <div
        className="bg-white text-black mx-auto shadow-sm impressao-declaracao w-[794px] min-h-[1123px] px-[64px] py-[56px] font-[Arial,_sans-serif] text-[12pt] leading-[1.7]"
      >
        <div className="text-center mb-10">
          <h1 className="text-xl font-bold tracking-wide">
            DECLARAÇÃO
          </h1>
          <p className="mt-1 ml-[30px] font-semibold">Iranduba/AM {dataAtual}</p>
          <p className="mt-4 mr-[90px] font-semibold">Nº PR-{numeroControle}/2026</p>
        
      </div>  

      <div className="text-justify whitespace-pre-wrap">
        <p>
          Declaramos para os devidos fins de direito, que o(a)
          Senhor(a) <strong>{nome}</strong>, brasileiro(a), é
          produtor(a) rural familiar, portador(a) do CPF nº{" "}
          <strong>{cpf}</strong> e RG nº <strong>{rg}</strong> é{" "}
          <strong>{situacaoImovel}</strong> de um imóvel rural com
          uma área total de <strong>{areaTotal}</strong>,
          denominado <strong>{nomeImovel}</strong>, localizado
          no(a) <strong>{enderecoImovel}</strong>, Comunidade{" "}
          <strong>{comunidade}</strong> no Município de{" "}
          <strong>{municipio}</strong>, com o número de controle
          PR-<strong>{numeroControle}</strong> e RGP da CPP{" "}
          <strong>{rgpCpp}</strong>.
        </p>

        <p className="mt-6">
          O(A) produtor(a) é assistido pela Unidade Local de{" "}
          <strong>{unloc}</strong> / IDAM - Instituto de
          Desenvolvimento Agropecuário e Florestal Sustentável do
          Estado do Amazonas, desde o ano{" "}
          <strong>{anoAssistencia}</strong>, tendo como atividade
          principal - <strong>{atividadePrincipal}</strong> e como
          atividade secundária <strong>{atividadeSecundaria}</strong>.
        </p>

        <p className="mt-6">
          O(A) produtor(a) ainda possui em sua propriedade uma
          produção de <strong>{producaoPropriedade}</strong>.
        </p>

        <p className="mt-6">
          <strong>Coordenadas da sede da propriedade:</strong>
          <br />
          Latitude: <strong>{latitude}</strong> Longitude:{" "}
          <strong>{longitude}</strong>
        </p>
      </div>

      <div className="mt-10 space-y-3 text-[11pt]">
        <p>
          <strong>Técnico:</strong> {tecnico}
        </p>
        <p>
          <strong>Gerente:</strong> {gerente}
        </p>
        <p>
          <strong>CONTATO DO PRODUTOR:</strong>{" "}
          {contato}
        </p>
      </div>

      <div className="mt-8 border-2 border-black p-4 rounded bg-gray-50">
        <p className="text-[11pt] font-bold mb-2 uppercase">Observações:</p>
        <div className="min-h-[80px] text-[10pt] leading-relaxed whitespace-pre-wrap">
          {observacoes}
        </div>
      </div>

      <div className="mt-16 text-sm">
        <p>Unloc de Iranduba</p>
        <p>Rua Rio Juruá 653</p>
        <p>Centro - Iranduba-AM</p>
      </div>

      <div className="grid grid-cols-2 gap-12 mt-24 text-center text-sm">
        <div>
          <div className="border-t border-black pt-2">
            {tecnico}
          </div>
        </div>
        <div>
          <div className="border-t border-black pt-2">
            {gerente}
          </div>
        </div>
      </div>

      <div className="mt-10 text-xs text-gray-500 text-right">
        Emitido em {formatarData(
          typeof produtor.dataRegistro === "string"
            ? produtor.dataRegistro
            : undefined,
        )}
      </div>
    </div>
    </>
  );
}