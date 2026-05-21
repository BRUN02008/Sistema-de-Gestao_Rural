interface ProdutorData {
  [key: string]: any;
}

interface Props {
  produtor: ProdutorData;
}

function valor(v: any) {
  if (v === null || v === undefined || v === "") return "";
  return String(v);
}

function marcar(condicao: boolean) {
  return condicao ? "X" : "";
}

function formatDateBR(value?: string) {
  if (!value) return "____/____/______";
  const data = new Date(value);
  if (isNaN(data.getTime())) return value;
  return data.toLocaleDateString("pt-BR");
}

function categoriasAtividades(produtor: any) {
  if (!Array.isArray(produtor.atividades)) return [];
  return produtor.atividades
    .map((item: any) => String(item?.categoria || "").toLowerCase())
    .filter(Boolean);
}

export default function SefazNormal({ produtor }: Props) {
  const atividades = categoriasAtividades(produtor);
  const situacaoImovel = String(
    produtor.situacaoImovel || "",
  ).toLowerCase();
  const condicaoAcesso = String(
    produtor.tipoLocalizacao || "",
  ).toLowerCase();

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .impressao-sefaz {
            width: 100% !important;
            max-width: 100% !important;
            font-size: 7px !important;
            line-height: 1.0 !important;
            padding: 6px !important;
            page-break-inside: avoid !important;
            transform: scale(0.92);
            transform-origin: top left;
          }

          .impressao-sefaz .p-2 {
            padding: 2px !important;
          }

          .impressao-sefaz .p-1 {
            padding: 1px !important;
          }

          .impressao-sefaz .gap-2 {
            gap: 2px !important;
          }

          .impressao-sefaz .mb-2 {
            margin-bottom: 2px !important;
          }

          .impressao-sefaz table td,
          .impressao-sefaz table th {
            padding: 1px !important;
          }
        }
      `}</style>
      <div
        className="bg-white text-[#127a35] mx-auto border border-[#127a35] impressao-sefaz"
        style={{
          width: "794px",
          minHeight: "1123px",
          fontFamily: "Arial, sans-serif",
          fontSize: "9px",
          lineHeight: 1.1,
          padding: "10px",
        }}
      >
      {/* Topo */}
      <div className="border border-[#127a35]">
        <div className="grid grid-cols-12">
          <div className="col-span-4 border-r border-[#127a35] p-2 flex items-center gap-2 min-h-[48px]">
            <div className="w-7 h-7 rounded-full border border-[#127a35] flex items-center justify-center text-[7px]">
              AM
            </div>
            <div className="font-bold uppercase leading-tight">
              Secretaria de Estado da Economia, Fazenda e Turismo
            </div>
          </div>

          <div className="col-span-5 border-r border-[#127a35] p-2 text-center flex items-center justify-center font-bold uppercase text-[10px]">
            Declaração de Produtor Rural (Dados Cadastrais)
          </div>

          <div className="col-span-3 p-1">
            <div className="text-right text-[8px] font-bold">
              01 MICROFILME
            </div>
            <div className="border border-[#127a35] h-[28px] mt-1"></div>
          </div>
        </div>
      </div>

      {/* Natureza do pedido + inscrição */}
      <div className="grid grid-cols-12 border-x border-b border-[#127a35]">
        <div className="col-span-4 border-r border-[#127a35] p-2">
          <div className="font-bold uppercase mb-2">
            02 Natureza do Pedido
          </div>
          <div className="grid grid-cols-2 gap-y-3">
            <div className="flex items-center gap-2">
              <span>Inscrição</span>
              <div className="w-6 h-4 border border-[#127a35] text-center">
                {marcar(
                  String(produtor.tipoSolicitacao || "").toLowerCase() ===
                    "inscrição",
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Baixa</span>
              <div className="w-6 h-4 border border-[#127a35] text-center">
                {marcar(
                  String(produtor.tipoSolicitacao || "").toLowerCase() ===
                    "baixa",
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>Alteração</span>
              <div className="w-6 h-4 border border-[#127a35] text-center">
                {marcar(
                  String(produtor.tipoSolicitacao || "").toLowerCase() ===
                    "alteração",
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>2ª Via</span>
              <div className="w-6 h-4 border border-[#127a35] text-center">
                {marcar(
                  String(produtor.tipoSolicitacao || "").toLowerCase() ===
                    "2ª via",
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-8">
          <div className="border-b border-[#127a35] p-1 text-center font-bold uppercase">
            03 Inscrição de Produtor
          </div>
          <div className="border-b border-[#127a35] p-2 min-h-[36px] flex items-center">
            <div className="border border-[#127a35] p-1 text-[8px] uppercase">
              Não utilize em caso de inscrição
            </div>
          </div>
          <div className="grid grid-cols-12">
            <div className="col-span-8 border-r border-[#127a35] p-1">
              <div className="font-bold">02 Nº do CPF</div>
              <div className="min-h-[22px] px-1 py-1 text-black">
                {valor(produtor.cpf)}
              </div>
            </div>
            <div className="col-span-4 p-1">
              <div className="font-bold">04 Estado Emissor</div>
              <div className="min-h-[22px] px-1 py-1 text-black">
                {valor(produtor.orgaoExpedidor)}
              </div>
            </div>
          </div>
          <div className="border-t border-[#127a35] p-1">
            <div className="font-bold">03 Nº de Documento de Identidade</div>
            <div className="min-h-[22px] px-1 py-1 text-black">
              {valor(produtor.rg)}
            </div>
          </div>
        </div>
      </div>

      {/* identificação */}
      <div className="border-x border-b border-[#127a35]">
        <div className="text-center font-bold uppercase border-b border-[#127a35] p-1">
          Identificação Caracterização do Produtor e do Imóvel
        </div>

        <div className="border-b border-[#127a35] p-1">
          <div className="font-bold">05 Nome do Produtor</div>
          <div className="min-h-[20px] text-black">
            {valor(produtor.nome)}
          </div>
        </div>

        <div className="text-center uppercase border-b border-[#127a35] p-1">
          Endereço para Correspondência
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-7 border-r border-[#127a35] p-1">
            <div className="font-bold">06 Rua / Av.</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.logradouro)}
            </div>
          </div>
          <div className="col-span-5 p-1">
            <div className="font-bold">07 Nome e Nº</div>
            <div className="min-h-[20px] text-black"></div>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-3 border-r border-[#127a35] p-1">
            <div className="font-bold">08 Bairro</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.bairro)}
            </div>
          </div>
          <div className="col-span-3 border-r border-[#127a35] p-1">
            <div className="font-bold">09 Município</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.municipio)}
            </div>
          </div>
          <div className="col-span-2 border-r border-[#127a35] p-1">
            <div className="font-bold">10 Cód. Municipal</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.codigoMunicipio)}
            </div>
          </div>
          <div className="col-span-1 border-r border-[#127a35] p-1">
            <div className="font-bold">11 UF</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.uf)}
            </div>
          </div>
          <div className="col-span-3 p-1">
            <div className="font-bold">12 CEP</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.cep)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-9 border-r border-[#127a35] p-1">
            <div className="font-bold">13 Endereço da Propriedade</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.logradouro)}
            </div>
          </div>
          <div className="col-span-3 p-1">
            <div className="font-bold">14 CEP</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.cep)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-8 border-r border-[#127a35] p-1">
            <div className="font-bold">15 Nome da Propriedade</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.nomeImovel)}
            </div>
          </div>
          <div className="col-span-4 p-1">
            <div className="font-bold">
              16 Nº da Inscrição INCRA ou SEPROR ou PM
            </div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.codigoUnloc)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-6 border-r border-[#127a35] p-1">
            <div className="font-bold">17 Comunidade</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.comunidade)}
            </div>
          </div>
          <div className="col-span-4 border-r border-[#127a35] p-1">
            <div className="font-bold">18 Município</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.municipio)}
            </div>
          </div>
          <div className="col-span-2 p-1">
            <div className="font-bold">19 Cód. Municipal</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.codigoMunicipio)}
            </div>
          </div>
        </div>
      </div>

      {/* atividade / posse / situação / acesso */}
      <div className="grid grid-cols-12 border-x border-b border-[#127a35]">
        <div className="col-span-4 border-r border-[#127a35] p-1">
          <div className="font-bold mb-1">20 Atividade</div>
          <div className="grid grid-cols-2 gap-y-1 text-[8px]">
            <div>
              Extrativismo [{marcar(atividades.includes("extrativismo"))}]
            </div>
            <div>
              Silvicultura [{marcar(atividades.includes("silvicultura"))}]
            </div>
            <div>
              Lavoura [
              {marcar(atividades.includes("lavoura")) ||
                marcar(atividades.includes("agricultura"))}
              ]
            </div>
            <div>
              Avicultura [{marcar(atividades.includes("avicultura"))}]
            </div>
            <div>
              Pecuária [
              {marcar(atividades.includes("pecuária")) ||
                marcar(atividades.includes("pecuaria"))}
              ]
            </div>
            <div>Pesca [{marcar(atividades.includes("pesca"))}]</div>
            <div>
              Agropecuária [
              {marcar(atividades.includes("agropecuária")) ||
                marcar(atividades.includes("agropecuaria"))}
              ]
            </div>
            <div>Outras [{marcar(atividades.includes("outras"))}]</div>
          </div>
        </div>

        <div className="col-span-3 border-r border-[#127a35] p-1">
          <div className="font-bold mb-1">
            21 Tipo de Posse ou Domínio do Imóvel
          </div>
          <div className="space-y-1 text-[8px]">
            <div>
              Proprietário [{marcar(situacaoImovel.includes("propriet"))}]
            </div>
            <div>
              Arrendatário [{marcar(situacaoImovel.includes("arrend"))}]
            </div>
            <div>
              Comodatário [{marcar(situacaoImovel.includes("comod"))}]
            </div>
            <div>
              Usufrutuário [{marcar(situacaoImovel.includes("usuf"))}]
            </div>
            <div>
              Posseiro [{marcar(situacaoImovel.includes("possei"))}]
            </div>
            <div>
              Outros [{marcar(situacaoImovel.includes("outro"))}]
            </div>
          </div>
        </div>

        <div className="col-span-2 border-r border-[#127a35] p-1">
          <div className="font-bold mb-1">22 Situação do Imóvel</div>
          <div className="space-y-1 text-[8px]">
            <div>
              Zona Rural [
              {marcar(
                String(produtor.situacaoProdutor || "")
                  .toLowerCase()
                  .includes("rural"),
              )}
              ]
            </div>
            <div>
              Zona Urbana [
              {marcar(
                String(produtor.situacaoProdutor || "")
                  .toLowerCase()
                  .includes("urbana"),
              )}
              ]
            </div>
            <div>
              Parte Rural/ Urbana [
              {marcar(
                String(produtor.situacaoProdutor || "")
                  .toLowerCase()
                  .includes("parte"),
              )}
              ]
            </div>
          </div>
        </div>

        <div className="col-span-3 p-1">
          <div className="font-bold mb-1">
            23 Condição de Acesso à Sede do Município
          </div>
          <div className="space-y-1 text-[8px]">
            <div>Asfalto [{marcar(condicaoAcesso.includes("asfalto"))}]</div>
            <div>
              Via Fluvial [{marcar(condicaoAcesso.includes("fluvial"))}]
            </div>
            <div>Terra [{marcar(condicaoAcesso.includes("terra"))}]</div>
            <div>Boa [{marcar(condicaoAcesso.includes("boa"))}]</div>
            <div>Ruim [{marcar(condicaoAcesso.includes("ruim"))}]</div>
          </div>
        </div>
      </div>

      {/* área */}
      <div className="grid grid-cols-7 border-x border-b border-[#127a35] text-center">
        {[
          ["24 Área Total do Imóvel", produtor.areaTotal],
          ["25 Área em Outro Estado", produtor.areaOutroEstado],
          ["26 Área no Estado", produtor.areaEstado],
          ["27 Área Explorada com Culturas", produtor.areaAgricultura],
          ["28 Área de Pastagem", produtor.areaPastagem],
          ["29 Área Arrendada", produtor.areaArrendada],
          ["30 Área Explorada em Parceria", produtor.areaParceria],
        ].map(([label, value], index) => (
          <div
            key={label}
            className={`p-1 ${
              index < 6 ? "border-r border-[#127a35]" : ""
            }`}
          >
            <div className="font-bold leading-tight min-h-[20px]">
              {label}
            </div>
            <div className="min-h-[20px] text-black mt-1">
              {valor(value)}
            </div>
          </div>
        ))}
      </div>

      {/* informações complementares */}
      <div className="border-x border-b border-[#127a35]">
        <div className="text-center font-bold uppercase border-b border-[#127a35] p-1">
          Informações Complementares
        </div>

        <div className="grid grid-cols-5 border-b border-[#127a35] text-[8px]">
          <div className="p-1 border-r border-[#127a35]">
            <div className="font-bold">
              31 Possui Máquina de Beneficiamento
            </div>
            <div className="mt-1">Sim [] Não []</div>
          </div>
          <div className="p-1 border-r border-[#127a35]">
            <div className="font-bold">
              32 Beneficia Produtos de Terceiros
            </div>
            <div className="mt-1">Sim [] Não []</div>
          </div>
          <div className="p-1 border-r border-[#127a35]">
            <div className="font-bold">
              33 Possui Talonários de Notas Fiscais
            </div>
            <div className="mt-1">Sim [] Não []</div>
          </div>
          <div className="p-1 border-r border-[#127a35]">
            <div className="font-bold">
              34 Distância do Imóvel à Sede do Município
            </div>
            <div className="mt-1 text-black">{valor(produtor.km)}</div>
          </div>
          <div className="p-1">
            <div className="font-bold">35 Possui Parceria</div>
            <div className="mt-1">
              Sim [{marcar(!!produtor.areaParceria)}] Não [
              {marcar(!produtor.areaParceria)}]
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-8 border-r border-[#127a35]">
            <div className="grid grid-cols-3">
              <div className="border-r border-[#127a35] p-1 min-h-[40px]">
                <div className="font-bold">
                  36 Relação de Outras Propriedades no Estado
                </div>
              </div>
              <div className="border-r border-[#127a35] p-1 min-h-[40px]">
                <div className="font-bold">37 Município</div>
              </div>
              <div className="p-1 min-h-[40px]">
                <div className="font-bold">38 Área Total</div>
              </div>
            </div>
          </div>
          <div className="col-span-2 border-r border-[#127a35] p-1 min-h-[40px]">
            <div className="font-bold">39 Marcas Utilizadas - Tipo</div>
          </div>
          <div className="col-span-2 p-1 min-h-[40px]">
            <div className="font-bold">40 Local de Colocação da Marca</div>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-6 border-r border-[#127a35] p-1 min-h-[55px]">
            <div className="font-bold">41 Principais Produções do Imóvel</div>
            <div className="text-black mt-2">
              {valor(produtor.outrasProducoes)}
            </div>
          </div>
          <div className="col-span-6 p-1 min-h-[55px]">
            <div className="font-bold">
              42 Produtos Fabricados ou Beneficiados no Imóvel
            </div>
            <div className="text-black mt-2"></div>
          </div>
        </div>

        <div className="border-b border-[#127a35] p-1 min-h-[70px]">
          <div className="font-bold text-center mb-1">
            OBSERVAÇÕES DO PRODUTOR
          </div>

          <div className="grid grid-cols-12 gap-0">
            <div className="col-span-3 font-bold text-[14px] leading-tight">
              ATIVIDADE PRINCIPAL
            </div>
            <div className="col-span-9 text-black text-[14px] font-bold">
              {valor(produtor.atividadePrincipal)}
            </div>

            <div className="col-span-3 font-bold text-[14px] leading-tight mt-2">
              ATIVIDADE SEGUNDARIA
            </div>
            <div className="col-span-9 text-black text-[14px] font-bold mt-2">
              {valor(produtor.atividadeSecundaria)}
            </div>
          </div>

          {produtor.observacoes && (
            <div className="text-black mt-3 whitespace-pre-wrap">
              {valor(produtor.observacoes)}
            </div>
          )}
        </div>
      </div>

      {/* declaração / assinatura */}
      <div className="border-x border-b border-[#127a35]">
        <div className="text-center font-bold uppercase border-b border-[#127a35] p-1">
          07 Declaro serem verdadeiras as informações prestadas
        </div>

        <div className="grid grid-cols-12 border-b border-[#127a35]">
          <div className="col-span-8 border-r border-[#127a35] p-1">
            <div className="font-bold">43 Local</div>
            <div className="min-h-[20px] text-black">
              {valor(produtor.municipio)}
            </div>
          </div>
          <div className="col-span-4 p-1">
            <div className="font-bold">44 Data</div>
            <div className="min-h-[20px] text-black">
              {formatDateBR(produtor.dataRegistro)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12">
          <div className="col-span-8 border-r border-[#127a35] p-1 min-h-[45px]">
            <div className="font-bold">
              45 Assinatura do Produtor / Seu Representante
            </div>
          </div>
          <div className="col-span-4 p-1 min-h-[45px]">
            <div className="font-bold">
              46 Documento de Identidade (no caso de representante)
            </div>
          </div>
        </div>
      </div>

      {/* parte final */}
      <div className="grid grid-cols-12 gap-4 mt-4">
        <div className="col-span-6 border border-[#127a35]">
          <div className="text-center font-bold uppercase border-b border-[#127a35] p-1">
            08 Uso da Repartição Fazendária
          </div>
          <div className="grid grid-cols-2 border-b border-[#127a35]">
            <div className="border-r border-[#127a35] p-1 min-h-[36px]">
              <div className="font-bold">Funcionário</div>
            </div>
            <div className="p-1 min-h-[36px]">
              <div className="font-bold">Data Recebimento</div>
            </div>
          </div>
          <div className="grid grid-cols-2">
            <div className="border-r border-[#127a35] p-1 min-h-[28px]">
              <div className="font-bold">MASP</div>
            </div>
            <div className="p-1 min-h-[28px]">
              <div className="font-bold">Data</div>
            </div>
          </div>
        </div>

        <div className="col-span-6 border border-[#127a35]">
          <div className="text-center font-bold uppercase border-b border-[#127a35] p-1">
            09 Recebimento do Cartão de Inscrição
          </div>
          <div className="grid grid-cols-2 border-b border-[#127a35]">
            <div className="border-r border-[#127a35] p-1 min-h-[36px]">
              <div className="font-bold">
                Data Recebimento Cartão de Inscrição
              </div>
            </div>
            <div className="p-1 min-h-[36px]">
              <div className="font-bold">
                Recebi o Cartão de Inscrição do Produtor Rural
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3">
            <div className="border-r border-[#127a35] p-1 min-h-[28px]">
              <div className="font-bold">Assinatura</div>
            </div>
            <div className="border-r border-[#127a35] p-1 min-h-[28px]">
              <div className="font-bold">EM</div>
            </div>
            <div className="p-1 min-h-[28px]">
              <div className="font-bold">Número Cart. Identidade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}