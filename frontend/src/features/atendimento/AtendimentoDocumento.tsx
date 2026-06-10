type AnyRecord = Record<string, any>;

interface Props {
  produtor: AnyRecord;
  atendimento: AnyRecord;
  atividadesAdicionais?: {
    agricultura: string[];
    extrativismo: string[];
    pastagem: string[];
    pesca: string[];
    pecuaria: string[];
  };
  tecnicoResponsavel?: string;
  gerenteResponsavel?: string;
  data?: string;
}

function valor(v: unknown, fallback = "-") {
  if (v === null || v === undefined || v === "") return fallback;
  return String(v);
}

function formatarData(data?: string) {
  if (!data) return new Date().toLocaleDateString("pt-BR");
  const d = new Date(data);
  if (isNaN(d.getTime())) return data;
  return d.toLocaleDateString("pt-BR");
}

function temDados(item: unknown) {
  if (item === null || item === undefined || item === "") return false;
  if (typeof item === "object") {
    return Object.values(item as AnyRecord).some(temDados);
  }
  return true;
}

function listaTemDados(lista: unknown[] = []) {
  return Array.isArray(lista) && lista.some(temDados);
}

function objetoTemDados(obj: unknown): boolean {
  if (!obj || typeof obj !== "object") return false;
  return Object.values(obj as AnyRecord).some((v) => {
    if (typeof v === "object" && v !== null) {
      return objetoTemDados(v);
    }
    return v !== "" && v !== null && v !== undefined;
  });
}

function produtorTemCategoria(produtor: AnyRecord, categoria: string) {
  return (produtor.atividades || []).some(
    (a: AnyRecord) => a.categoria === categoria,
  );
}

function produtorTemSubtipo(produtor: AnyRecord, subtipo: string) {
  const atividades = Array.isArray(produtor.atividades)
    ? produtor.atividades as AnyRecord[]
    : [];

  return atividades.some((a: AnyRecord) =>
    Array.isArray(a.tipos) ? a.tipos.includes(subtipo) : false,
  );
}

function renderTabelaAgricultura(
  titulo: string,
  lista: AnyRecord[] = [],
) {
  const itensValidos = lista.filter(temDados);
  if (!itensValidos.length) return null;

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{titulo}</h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">Cultura</th>
            <th className="border p-2">Beneficiários</th>
            <th className="border p-2">Prod. Município</th>
            <th className="border p-2">Área a Assistir</th>
            <th className="border p-2">Área a Colher</th>
            <th className="border p-2">Produção Esperada</th>
            <th className="border p-2">Área Assistida</th>
            <th className="border p-2">Área Colhida</th>
            <th className="border p-2">Produção Obtida</th>
          </tr>
        </thead>
        <tbody>
          {itensValidos.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{valor(item.cultura)}</td>
              <td className="border p-2">
                {valor(item.numeroBeneficiarios)}
              </td>
              <td className="border p-2">
                {valor(item.produtividadeMunicipio)}
              </td>
              <td className="border p-2">{valor(item.areaAssistir)}</td>
              <td className="border p-2">{valor(item.areaColher)}</td>
              <td className="border p-2">
                {valor(item.producaoEsperada)}
              </td>
              <td className="border p-2">{valor(item.areaAssistida)}</td>
              <td className="border p-2">{valor(item.areaColhida)}</td>
              <td className="border p-2">
                {valor(item.producaoObtida)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTabelaPecuaria(
  titulo: string,
  lista: AnyRecord[] = [],
) {
  const itensValidos = lista.filter(temDados);
  if (!itensValidos.length) return null;

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{titulo}</h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">Criadores</th>
            <th className="border p-2">Animais</th>
            <th className="border p-2">Sistema</th>
            <th className="border p-2">Carne</th>
            <th className="border p-2">Leite</th>
            <th className="border p-2">Queijo</th>
            <th className="border p-2">Ovos</th>
            <th className="border p-2">Produção Obtida</th>
          </tr>
        </thead>
        <tbody>
          {itensValidos.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                {valor(item.numeroCriadores)}
              </td>
              <td className="border p-2">{valor(item.numeroAnimais)}</td>
              <td className="border p-2">{valor(item.sistemaCriacao)}</td>
              <td className="border p-2">{valor(item.carne)}</td>
              <td className="border p-2">{valor(item.leite)}</td>
              <td className="border p-2">{valor(item.queijo)}</td>
              <td className="border p-2">{valor(item.ovos)}</td>
              <td className="border p-2">
                {valor(item.producaoObtida)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTabelaPiscicultura(lista: AnyRecord[] = []) {
  const itensValidos = lista.filter(temDados);
  if (!itensValidos.length) return null;

  return (
    <table className="w-full border-collapse text-sm mb-6">
      <thead>
        <tr>
          <th className="border p-2">Criadores</th>
          <th className="border p-2">Instalações</th>
          <th className="border p-2">Sistema</th>
          <th className="border p-2">Área Alagada</th>
          <th className="border p-2">Peixes</th>
          <th className="border p-2">Espécie</th>
          <th className="border p-2">Peso Médio</th>
          <th className="border p-2">Prod. Esperada</th>
          <th className="border p-2">Prod. Obtida</th>
        </tr>
      </thead>
      <tbody>
        {itensValidos.map((item, index) => (
          <tr key={index}>
            <td className="border p-2">
              {valor(item.numeroCriadores)}
            </td>
            <td className="border p-2">
              {valor(item.numeroInstalacoes)}
            </td>
            <td className="border p-2">{valor(item.tipoSistema)}</td>
            <td className="border p-2">{valor(item.areaAlagada)}</td>
            <td className="border p-2">
              {valor(item.numeroPeixesEstocados)}
            </td>
            <td className="border p-2">{valor(item.especie)}</td>
            <td className="border p-2">{valor(item.pesoMedio)}</td>
            <td className="border p-2">
              {valor(item.producaoEsperada)}
            </td>
            <td className="border p-2">
              {valor(item.producaoObtida)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function renderTabelaPesca(
  titulo: string,
  lista: AnyRecord[] = [],
) {
  const itensValidos = lista.filter(temDados);
  if (!itensValidos.length) return null;

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{titulo}</h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">Pescadores Assistidos</th>
            <th className="border p-2">Espécies</th>
            <th className="border p-2">Prod. Esperada</th>
            <th className="border p-2">Pescadores Realizado</th>
            <th className="border p-2">Prod. Obtida</th>
          </tr>
        </thead>
        <tbody>
          {itensValidos.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                {valor(item.numeroPescadoresAssistidos)}
              </td>
              <td className="border p-2">
                {valor(item.principaisEspecies)}
              </td>
              <td className="border p-2">
                {valor(item.producaoEsperada)}
              </td>
              <td className="border p-2">
                {valor(item.numeroPescadoresRealizado)}
              </td>
              <td className="border p-2">
                {valor(item.producaoObtida)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTabelaApicultura(
  titulo: string,
  lista: AnyRecord[] = [],
) {
  const itensValidos = lista.filter(temDados);
  if (!itensValidos.length) return null;

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{titulo}</h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">Criadores</th>
            <th className="border p-2">Colmeias</th>
            <th className="border p-2">Espécie</th>
            <th className="border p-2">Mel</th>
            <th className="border p-2">Pólen</th>
            <th className="border p-2">Própolis</th>
            <th className="border p-2">Mel Reg.</th>
            <th className="border p-2">Pólen Reg.</th>
            <th className="border p-2">Própolis Reg.</th>
          </tr>
        </thead>
        <tbody>
          {itensValidos.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">
                {valor(item.numeroCriadores)}
              </td>
              <td className="border p-2">
                {valor(item.numeroColmeias)}
              </td>
              <td className="border p-2">{valor(item.especie)}</td>
              <td className="border p-2">{valor(item.producaoMel)}</td>
              <td className="border p-2">{valor(item.producaoPolen)}</td>
              <td className="border p-2">
                {valor(item.producaoPropolis)}
              </td>
              <td className="border p-2">{valor(item.melRegularizado)}</td>
              <td className="border p-2">
                {valor(item.polenRegularizado)}
              </td>
              <td className="border p-2">
                {valor(item.propolisRegularizado)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderTabelaExtrativismo(
  titulo: string,
  lista: AnyRecord[] = [],
) {
  const itensValidos = lista.filter(temDados);
  if (!itensValidos.length) return null;

  return (
    <div className="mb-6">
      <h4 className="font-semibold mb-2">{titulo}</h4>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2">Produto</th>
            <th className="border p-2">Unidade</th>
            <th className="border p-2">Extrativistas</th>
            <th className="border p-2">Qtd. Esperada</th>
            <th className="border p-2">Qtd. Obtida</th>
          </tr>
        </thead>
        <tbody>
          {itensValidos.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{valor(item.produto)}</td>
              <td className="border p-2">{valor(item.unidade)}</td>
              <td className="border p-2">
                {valor(item.numeroExtrativistas)}
              </td>
              <td className="border p-2">
                {valor(item.quantidadeEsperada)}
              </td>
              <td className="border p-2">
                {valor(item.quantidadeObtida)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AtendimentoDocumento({
  produtor,
  atendimento,
  atividadesAdicionais,
  tecnicoResponsavel,
  data,
}: Props) {
  // Função auxiliar para verificar se tem o subtipo no produtor OU nas atividades adicionais
  const temSubtipo = (subtipo: string, categoria?: string) => {
    const temNoProdutorOriginal = produtorTemSubtipo(produtor, subtipo);

    if (!atividadesAdicionais) return temNoProdutorOriginal;

    // Verificar nas atividades adicionais conforme a categoria
    let temNasAdicionais = false;
    if (categoria === "agricultura") {
      temNasAdicionais = atividadesAdicionais.agricultura?.includes(subtipo) || false;
    } else if (categoria === "extrativismo") {
      temNasAdicionais = atividadesAdicionais.extrativismo?.includes(subtipo) || false;
    } else if (categoria === "pastagem") {
      temNasAdicionais = atividadesAdicionais.pastagem?.includes(subtipo) || false;
    } else if (categoria === "pesca") {
      temNasAdicionais = atividadesAdicionais.pesca?.includes(subtipo) || false;
    } else if (categoria === "pecuaria") {
      temNasAdicionais = atividadesAdicionais.pecuaria?.includes(subtipo) || false;
    }

    return temNoProdutorOriginal || temNasAdicionais;
  };

  const mostrarGraos =
    temSubtipo("Grãos", "agricultura") &&
    listaTemDados(atendimento?.agricultura?.graos);

  const mostrarHorticultura =
    temSubtipo("Horticultura", "agricultura") &&
    listaTemDados(atendimento?.agricultura?.horticultura);

  const mostrarFruticultura =
    temSubtipo("Fruticultura", "agricultura") &&
    listaTemDados(atendimento?.agricultura?.fruticultura);

  const mostrarMandioca =
    temSubtipo("Mandioca", "agricultura") &&
    listaTemDados(atendimento?.agricultura?.mandioca);

  const mostrarCulturasIndustriais =
    temSubtipo("Culturas Industriais", "agricultura") &&
    listaTemDados(atendimento?.agricultura?.culturasIndustriais);

  const temAlgumaAtividadeAgricultura =
    produtorTemCategoria(produtor, "Agricultura") ||
    (atividadesAdicionais?.agricultura && atividadesAdicionais.agricultura.length > 0);

  const mostrarSecaoAgricultura =
    temAlgumaAtividadeAgricultura &&
    (
      mostrarGraos ||
      mostrarHorticultura ||
      mostrarFruticultura ||
      mostrarMandioca ||
      mostrarCulturasIndustriais
    );

  const mostrarTerraFirme =
    temSubtipo("Terra Firme", "pastagem") &&
    objetoTemDados(atendimento?.pastagem?.terraFirme);

  const mostrarVarzea =
    temSubtipo("Várzea", "pastagem") &&
    objetoTemDados(atendimento?.pastagem?.varzea);

  const mostrarCapineira =
    temSubtipo("Capineira", "pastagem") &&
    objetoTemDados(atendimento?.pastagem?.capineira);

  const temAlgumaAtividadePastagem =
    produtorTemCategoria(produtor, "Pastagem") ||
    (atividadesAdicionais?.pastagem && atividadesAdicionais.pastagem.length > 0);

  const mostrarSecaoPastagem =
    temAlgumaAtividadePastagem &&
    (mostrarTerraFirme || mostrarVarzea || mostrarCapineira);

  const mostrarBovinocultura =
    temSubtipo("Bovinocultura", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.bovinocultura);

  const mostrarAvicultura =
    temSubtipo("Avicultura", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.avicultura);

  const mostrarSuinocultura =
    temSubtipo("Suinocultura", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.suinocultura);

  const mostrarBubalinocultura =
    temSubtipo("Bubalinocultura", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.bubalinocultura);

  const mostrarCaprinocultura =
    temSubtipo("Caprinocultura", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.caprinocultura);

  const mostrarOvinocultura =
    temSubtipo("Ovinocultura", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.ovinocultura);

  const mostrarEquinos =
    temSubtipo("Equinos", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.equinos);

  const mostrarCodorna =
    temSubtipo("Codorna", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.codorna);

  const mostrarPatoDomestico =
    temSubtipo("Pato Doméstico", "pecuaria") &&
    listaTemDados(atendimento?.pecuaria?.patoDomestico);

  const temAlgumaAtividadePecuaria =
    produtorTemCategoria(produtor, "Pecuaria") ||
    (atividadesAdicionais?.pecuaria && atividadesAdicionais.pecuaria.length > 0);

  const mostrarSecaoPecuaria =
    temAlgumaAtividadePecuaria &&
    (
      mostrarBovinocultura ||
      mostrarAvicultura ||
      mostrarSuinocultura ||
      mostrarBubalinocultura ||
      mostrarCaprinocultura ||
      mostrarOvinocultura ||
      mostrarEquinos ||
      mostrarCodorna ||
      mostrarPatoDomestico
    );

  const mostrarPiscicultura =
    temSubtipo("Piscicultura", "pesca") &&
    listaTemDados(atendimento?.piscicultura);

  const mostrarPescaArtesanal =
    temSubtipo("Pesca Artesanal", "pesca") &&
    listaTemDados(atendimento?.pesca?.artesanal);

  const mostrarPescaManejada =
    listaTemDados(atendimento?.pesca?.manejada);

  const mostrarPescaComercial =
    temSubtipo("Pesca Comercial", "pesca") &&
    listaTemDados(atendimento?.pesca?.comercial);

  const mostrarPescaSubsistencia =
    temSubtipo("Pesca de Subsistência", "pesca") &&
    listaTemDados(atendimento?.pesca?.subsistencia);

  const temAlgumaAtividadePesca =
    produtorTemCategoria(produtor, "Pesca") ||
    temSubtipo("Pesca Artesanal", "pesca") ||
    temSubtipo("Pesca Comercial", "pesca") ||
    temSubtipo("Pesca de Subsistência", "pesca") ||
    temSubtipo("Piscicultura", "pesca") ||
    (atividadesAdicionais?.pesca && atividadesAdicionais.pesca.length > 0);

  const mostrarSecaoPesca =
    temAlgumaAtividadePesca &&
    (
      mostrarPescaArtesanal ||
      mostrarPescaManejada ||
      mostrarPescaComercial ||
      mostrarPescaSubsistencia
    );

  const mostrarApicultura =
    temSubtipo("Apicultura", "pecuaria") &&
    listaTemDados(atendimento?.apicultura?.apicultura);

  const mostrarMeliponicultura =
    temSubtipo("Meliponicultura", "pecuaria") &&
    listaTemDados(atendimento?.apicultura?.meliponicultura);

  const mostrarSecaoApicultura =
    mostrarApicultura || mostrarMeliponicultura;

  const mostrarMadeira =
    temSubtipo("Produção Florestal de Madeira", "extrativismo") &&
    listaTemDados(atendimento?.extrativismo?.madeira);

  const mostrarNaoMadeireira =
    temSubtipo("Produção Florestal Não Madeireira", "extrativismo") &&
    listaTemDados(atendimento?.extrativismo?.naoMadeireira);

  const mostrarExtrativismoVegetal =
    temSubtipo("Extrativismo Vegetal", "extrativismo") &&
    listaTemDados(atendimento?.extrativismo?.vegetal);

  const mostrarExtrativismoMineral =
    temSubtipo("Extrativismo Mineral", "extrativismo") &&
    listaTemDados(atendimento?.extrativismo?.mineral);

  const temAlgumaAtividadeExtrativismo =
    produtorTemCategoria(produtor, "Extrativismo") ||
    (atividadesAdicionais?.extrativismo && atividadesAdicionais.extrativismo.length > 0);

  const mostrarSecaoExtrativismo =
    temAlgumaAtividadeExtrativismo &&
    (
      mostrarMadeira ||
      mostrarNaoMadeireira ||
      mostrarExtrativismoVegetal ||
      mostrarExtrativismoMineral
    );

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .impressao-documento {
            width: 100% !important;
            max-width: 100% !important;
            padding: 8px !important;
            font-size: 7pt !important;
            line-height: 1.2 !important;
            page-break-inside: avoid !important;
            transform: scale(0.85);
            transform-origin: top left;
          }

          .impressao-documento h1 {
            font-size: 12pt !important;
            margin-bottom: 4px !important;
          }

          .impressao-documento h2 {
            font-size: 9pt !important;
            margin-bottom: 3px !important;
            margin-top: 6px !important;
          }

          .impressao-documento h3,
          .impressao-documento h4 {
            font-size: 8pt !important;
            margin-bottom: 2px !important;
            margin-top: 3px !important;
          }

          .impressao-documento .mb-6 {
            margin-bottom: 6px !important;
          }

          .impressao-documento .mb-4 {
            margin-bottom: 4px !important;
          }

          .impressao-documento .mb-3 {
            margin-bottom: 3px !important;
          }

          .impressao-documento .mb-2 {
            margin-bottom: 2px !important;
          }

          .impressao-documento .p-4 {
            padding: 4px !important;
          }

          .impressao-documento .p-2 {
            padding: 2px !important;
          }

          .impressao-documento table {
            font-size: 6pt !important;
          }

          .impressao-documento table th,
          .impressao-documento table td {
            padding: 1px 2px !important;
          }

          .impressao-documento .gap-3 {
            gap: 4px !important;
          }

          .impressao-documento .text-sm {
            font-size: 6.5pt !important;
          }

          .impressao-documento .text-xs {
            font-size: 6pt !important;
          }
        }
      `}</style>
      <div className="bg-white text-black mx-auto impressao-documento w-[1123px] min-h-[794px] py-[28px] px-[32px] font-sans text-[10pt] leading-[1.35]">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold">
            RELATÓRIO DE ATENDIMENTO TÉCNICO
          </h1>
          <p className="mt-1">Data: {formatarData(data)}</p>
        </div>

      <div className="mb-6 border p-4">
        <h2 className="font-bold mb-3">1. IDENTIFICAÇÃO DO PRODUTOR</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>
            <strong>Nome:</strong> {valor(produtor.nome)}
          </p>
          <p>
            <strong>CPF:</strong> {valor(produtor.cpf)}
          </p>
          <p>
            <strong>Telefone:</strong> {valor(produtor.telefone)}
          </p>
          <p>
            <strong>Email:</strong> {valor(produtor.email)}
          </p>
          <p className="col-span-2">
            <strong>Endereço:</strong> {valor(produtor.logradouro)} -{" "}
            {valor(produtor.municipio)} / {valor(produtor.uf)}
          </p>
          <p className="col-span-2">
            <strong>Comunidade:</strong> {valor(produtor.comunidade)}
          </p>
          <p className="col-span-2">
            <strong>Técnico Responsável:</strong>{" "}
            {valor(tecnicoResponsavel)}
          </p>
        </div>
      </div>

      {mostrarSecaoAgricultura && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">2. AGRICULTURA</h2>

          {mostrarGraos &&
            renderTabelaAgricultura("Grãos", atendimento.agricultura.graos)}

          {mostrarHorticultura &&
            renderTabelaAgricultura(
              "Horticultura",
              atendimento.agricultura.horticultura,
            )}

          {mostrarFruticultura &&
            renderTabelaAgricultura(
              "Fruticultura",
              atendimento.agricultura.fruticultura,
            )}

          {mostrarMandioca &&
            renderTabelaAgricultura(
              "Mandioca",
              atendimento.agricultura.mandioca,
            )}

          {mostrarCulturasIndustriais &&
            renderTabelaAgricultura(
              "Culturas Industriais",
              atendimento.agricultura.culturasIndustriais,
            )}
        </div>
      )}

      {mostrarSecaoPastagem && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">3. PASTAGEM</h2>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border p-2">Tipo</th>
                <th className="border p-2">Área Programada</th>
                <th className="border p-2">Área Realizada</th>
              </tr>
            </thead>
            <tbody>
              {mostrarTerraFirme && (
                <tr>
                  <td className="border p-2">Terra Firme</td>
                  <td className="border p-2">
                    {valor(atendimento.pastagem?.terraFirme?.areaProgramada)}
                  </td>
                  <td className="border p-2">
                    {valor(atendimento.pastagem?.terraFirme?.areaRealizada)}
                  </td>
                </tr>
              )}

              {mostrarVarzea && (
                <tr>
                  <td className="border p-2">Várzea</td>
                  <td className="border p-2">
                    {valor(atendimento.pastagem?.varzea?.areaProgramada)}
                  </td>
                  <td className="border p-2">
                    {valor(atendimento.pastagem?.varzea?.areaRealizada)}
                  </td>
                </tr>
              )}

              {mostrarCapineira && (
                <tr>
                  <td className="border p-2">Capineira</td>
                  <td className="border p-2">
                    {valor(atendimento.pastagem?.capineira?.areaProgramada)}
                  </td>
                  <td className="border p-2">
                    {valor(atendimento.pastagem?.capineira?.areaRealizada)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {mostrarSecaoPecuaria && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">4. PECUÁRIA</h2>

          {mostrarBovinocultura &&
            renderTabelaPecuaria(
              "Bovinocultura",
              atendimento.pecuaria.bovinocultura,
            )}

          {mostrarAvicultura &&
            renderTabelaPecuaria(
              "Avicultura",
              atendimento.pecuaria.avicultura,
            )}

          {mostrarSuinocultura &&
            renderTabelaPecuaria(
              "Suinocultura",
              atendimento.pecuaria.suinocultura,
            )}

          {mostrarBubalinocultura &&
            renderTabelaPecuaria(
              "Bubalinocultura",
              atendimento.pecuaria.bubalinocultura,
            )}

          {mostrarCaprinocultura &&
            renderTabelaPecuaria(
              "Caprinocultura",
              atendimento.pecuaria.caprinocultura,
            )}

          {mostrarOvinocultura &&
            renderTabelaPecuaria(
              "Ovinocultura",
              atendimento.pecuaria.ovinocultura,
            )}

          {mostrarEquinos &&
            renderTabelaPecuaria(
              "Equinos",
              atendimento.pecuaria.equinos,
            )}

          {mostrarCodorna &&
            renderTabelaPecuaria(
              "Codorna",
              atendimento.pecuaria.codorna,
            )}

          {mostrarPatoDomestico &&
            renderTabelaPecuaria(
              "Pato Doméstico",
              atendimento.pecuaria.patoDomestico,
            )}
        </div>
      )}

      {mostrarPiscicultura && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">5. PISCICULTURA</h2>
          {renderTabelaPiscicultura(atendimento.piscicultura)}
        </div>
      )}

      {mostrarSecaoPesca && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">6. PESCA</h2>

          {mostrarPescaArtesanal &&
            renderTabelaPesca(
              "Pesca Artesanal",
              atendimento.pesca.artesanal,
            )}

          {mostrarPescaManejada &&
            renderTabelaPesca(
              "Pesca Manejada",
              atendimento.pesca.manejada,
            )}

          {mostrarPescaComercial &&
            renderTabelaPesca(
              "Pesca Comercial",
              atendimento.pesca.comercial,
            )}

          {mostrarPescaSubsistencia &&
            renderTabelaPesca(
              "Pesca de Subsistência",
              atendimento.pesca.subsistencia,
            )}
        </div>
      )}

      {mostrarSecaoApicultura && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">7. APICULTURA / MELIPONICULTURA</h2>

          {mostrarApicultura &&
            renderTabelaApicultura(
              "Apicultura",
              atendimento.apicultura.apicultura,
            )}

          {mostrarMeliponicultura &&
            renderTabelaApicultura(
              "Meliponicultura",
              atendimento.apicultura.meliponicultura,
            )}
        </div>
      )}

      {mostrarSecaoExtrativismo && (
        <div className="mb-6 border p-4">
          <h2 className="font-bold mb-4">8. EXTRATIVISMO</h2>

          {mostrarMadeira &&
            renderTabelaExtrativismo(
              "Produção Florestal de Madeira",
              atendimento.extrativismo.madeira,
            )}

          {mostrarNaoMadeireira &&
            renderTabelaExtrativismo(
              "Produção Florestal Não Madeireira",
              atendimento.extrativismo.naoMadeireira,
            )}

          {mostrarExtrativismoVegetal &&
            renderTabelaExtrativismo(
              "Extrativismo Vegetal",
              atendimento.extrativismo.vegetal,
            )}

          {mostrarExtrativismoMineral &&
            renderTabelaExtrativismo(
              "Extrativismo Mineral",
              atendimento.extrativismo.mineral,
            )}
        </div>
      )}

      <div className="mt-10 pt-8 grid grid-cols-2 gap-10 text-center text-sm">
        <div>
          <div className="border-t border-black pt-2">
            {valor(tecnicoResponsavel)}
          </div>
        </div>
        <div>
          <div className="border-t border-black pt-2">Assinatura</div>
        </div>
      </div>
    </div>
    </>
  );
}
