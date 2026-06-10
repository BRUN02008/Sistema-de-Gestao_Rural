interface ProdutorData {
  dataRegistro?: string;
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

function formatarEspecies(especies: unknown[]) {
  if (!Array.isArray(especies) || especies.length === 0) {
    return "0 kg de __________________";
  }

  const lista = especies
    .filter(
      (item) =>
        item &&
        typeof item === "object" &&
        ("nome" in item || "kg" in item),
    )
    .map((item) => {
      const registro = item as Record<string, unknown>;
      const kg = registro.kg ? String(registro.kg) : "0";
      const nome = registro.nome
        ? String(registro.nome)
        : "__________________";
      return `${kg} kg de ${nome}`;
    });

  return lista.length > 0
    ? lista.join(", ")
    : "0 kg de __________________";
}

function formatarSubsistencia(produtor: ProdutorData) {
  const itens: string[] = [];

  if (produtor.possuiAgriculturaSubtipo) itens.push("agricultura");
  if (produtor.possuiPiscicultura) itens.push("piscicultura");
  if (Array.isArray(produtor.pecuaria) && produtor.pecuaria.length > 0)
    itens.push("pecuária");
  if (produtor.possuiApicultura || produtor.possuiMeliponicultura)
    itens.push("apicultura");

  return itens.length > 0
    ? itens.join(", ")
    : "________________";
}

export default function DeclaracaoPescadorOficial({
  produtor,
}: Props) {
  const dataAtual = new Date().toLocaleDateString("pt-BR");

  const nome = valor(produtor.nome);
  const cpf = valor(produtor.cpf);
  const rg = valor(produtor.rg);
  const endereco = valor(produtor.logradouro);
  const comunidade = valor(produtor.comunidade);
  const municipio = valor(produtor.municipio);
  const numeroControle = valor(produtor.codigoUnloc || produtor.id);
  const rgpCpp = valor(produtor.codigoRgp);
  const tipoPesca = valor(produtor.tipoPesca).toLowerCase();
  const rgp = valor(produtor.rgPesca);
  const protocoloRgp = valor(produtor.protocoloRgp);
  const unloc = valor(produtor.municipioUf || produtor.municipio);
  const anoAssistencia = valor(produtor.anoEmissao);
  const atividade = valor(
    produtor.atividadePrincipal || produtor.tipoPesca,
  );
  const producaoTotal = valor(produtor.producaoTotal || "0");
  const especiesTexto = formatarEspecies(
    Array.isArray(produtor.especies) ? produtor.especies : [],
  );
  const subsistencia = formatarSubsistencia(produtor);
  const latitude = valor(produtor.latitude);
  const longitude = valor(produtor.longitude);
  const localPesca = valor(produtor.localPesca);
  const margemPesca = produtor.margemPesca
    ? `, ${produtor.margemPesca}`
    : "";
  const tecnico = valor(produtor.tecnicoResponsavel);
  const gerente = valor(produtor.gerente);
  const obs =
    valor(produtor.observacoes, "Sem observações complementares.");
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

          .impressao-pescador {
            width: 100% !important;
            max-width: 100% !important;
            padding: 12px 16px !important;
            font-size: 8pt !important;
            line-height: 1.3 !important;
            page-break-inside: avoid !important;
            transform: scale(0.88);
            transform-origin: top left;
          }

          .impressao-pescador h1 {
            font-size: 13pt !important;
            margin-bottom: 6px !important;
          }

          .impressao-pescador p {
            margin-bottom: 4px !important;
            margin-top: 4px !important;
          }

          .impressao-pescador .mb-10 {
            margin-bottom: 8px !important;
          }

          .impressao-pescador .mb-8 {
            margin-bottom: 6px !important;
          }

          .impressao-pescador .mb-6 {
            margin-bottom: 5px !important;
          }

          .impressao-pescador .mb-4 {
            margin-bottom: 4px !important;
          }

          .impressao-pescador .mt-10 {
            margin-top: 8px !important;
          }

          .impressao-pescador .mt-8 {
            margin-top: 6px !important;
          }

          .impressao-pescador .leading-relaxed {
            line-height: 1.3 !important;
          }
        }
      `}</style>
      <div
        className="bg-white text-black mx-auto shadow-sm impressao-pescador w-[794px] min-h-[1123px] px-[64px] py-[56px] font-[Arial,_sans-serif] text-[12pt] leading-[1.7]"
      >
      <div className="text-center mb-10">
        <h1 className="text-xl font-bold tracking-wide">
          DECLARAÇÃO
        </h1>
        <p className="mt-2 font-semibold">Nº PR-{numeroControle}</p>
        <p className="text-sm mt-1">{dataAtual}</p>
      </div>

      <div className="text-justify whitespace-pre-wrap">
        <p>
          Declaramos para os devidos fins de direito, que o(a)
          Senhor(a) <strong>{nome}</strong>, brasileiro(a), é
          produtor(a) rural familiar, portador(a) do CPF nº{" "}
          <strong>{cpf}</strong> e RG nº <strong>{rg}</strong>,
          residente na(o) <strong>{endereco}</strong>, Comunidade{" "}
          <strong>{comunidade}</strong> no Município de{" "}
          <strong>{municipio}</strong>, com o número de controle
          PR-<strong>{numeroControle}</strong> e RGP da CPP{" "}
          <strong>{rgpCpp}</strong> é considerado pescador{" "}
          <strong>{tipoPesca}</strong>, conforme o Registro Geral
          da Pesca - RGP n° <strong>{rgp}</strong> ou PROTOCOLO de
          solicitação do RGP n° <strong>{protocoloRgp}</strong>{" "}
          apresentado a essa Unloc do IDAM de{" "}
          <strong>{unloc}</strong>.
        </p>

        <p className="mt-6">
          O(A) produtor(a) é assistido pela Unidade Local de{" "}
          <strong>{unloc}</strong> / IDAM - Instituto de
          Desenvolvimento Agropecuário e Florestal Sustentável do
          Estado do Amazonas, desde o ano{" "}
          <strong>{anoAssistencia}</strong>, exercendo a atividade
          de <strong>{atividade}</strong>, e produção total de{" "}
          <strong>{producaoTotal}</strong> Toneladas, sendo{" "}
          <strong>{especiesTexto}</strong>.
        </p>

        <p className="mt-6">
          <strong>Obs:</strong> O(a) pescador(a) cultiva/cria{" "}
          <strong>({subsistencia})</strong> para fins de
          subsistência.
        </p>

        <p className="mt-6">
          Latitude: <strong>{latitude}</strong> Longitude:{" "}
          <strong>{longitude}</strong>
        </p>

        <p className="mt-6">
          Principais Rios, Lagos, Igarapés ou Outras área onde é
          realizada a pesca artesanal, cito o(a){" "}
          <strong>
            {localPesca}
            {margemPesca}
          </strong>
          .
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
          <strong>Obs.:</strong> {obs}
        </p>
        <p>
          <strong>TEC. RESPONSAVEL - JC</strong> 0,00{" "}
          <strong className="ml-4">CONTATO DO PRODUTOR</strong>{" "}
          {contato}
        </p>
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
        Emitido em {formatarData(produtor.dataRegistro)}
      </div>
    </div>
    </>
  );
}