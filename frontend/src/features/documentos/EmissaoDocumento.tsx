import { useState, useMemo, useRef } from "react";
import {
  Search,
  Download,
  Printer,
  Eye,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

import DeclaracaoOficial from "./DeclaracaoOficial";
import DeclaracaoPescadorOficial from "./DeclaracaoPescadorOficial";
import SefazNormal from "./SefazNormal";
import SefazPescador from "./SefazPescador";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  tipoPesca?: string;
  rgPesca?: string;
  protocoloRgp?: string;
  atividades?: {
    categoria: string;
    tipos: string[];
  }[];
  [key: string]: unknown;
}

type TipoDocumento =
  | "declaracao-oficial"
  | "sefaz-normal"
  | "sefaz-pescador"
  | "declaracao-pescador";

export default function EmissaoDocumento() {
  const produtores = useMemo(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? (JSON.parse(stored) as Produtor[]) : [];
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProdutor, setSelectedProdutor] =
    useState<Produtor | null>(null);

  const [documentType, setDocumentType] =
    useState<TipoDocumento>("declaracao-oficial");

  const componentRef = useRef<HTMLDivElement>(null);

  const produtorComAtendimento = useMemo(() => {
    if (!selectedProdutor) return null;

    const atendimentos = JSON.parse(
      localStorage.getItem("atendimentos") || "[]"
    ) as Array<Record<string, unknown>>;

    const atendimentoDoProdutor = atendimentos.find((a) => {
      return (
        (a.produtorId as string | undefined) === selectedProdutor.id ||
        (a.produtorCpf as string | undefined) === selectedProdutor.cpf
      );
    });

    if (
      atendimentoDoProdutor &&
      atendimentoDoProdutor.dados &&
      typeof atendimentoDoProdutor.dados === "object"
    ) {
      return {
        ...selectedProdutor,
        ...(atendimentoDoProdutor.dados as Record<string, unknown>),
        dataAtendimento: atendimentoDoProdutor.data,
        tecnicoAtendimento: atendimentoDoProdutor.tecnicoResponsavel,
      } as Produtor;
    }

    return selectedProdutor;
  }, [selectedProdutor]);

  const filteredProdutores = produtores.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm),
  );

  const isPescador = (produtor: Produtor | null): boolean => {
    if (!produtor) return false;

    const temCamposPesca =
      !!produtor.tipoPesca ||
      !!produtor.rgPesca ||
      !!produtor.protocoloRgp;

    const temCategoriaOuSubtipoPesca =
      Array.isArray(produtor.atividades) &&
      produtor.atividades.some((a) => {
        const categoriaPesca =
          a.categoria?.toLowerCase() === "pesca";

        const subtiposPesca =
          Array.isArray(a.tipos) &&
          a.tipos.some((tipo) =>
            [
              "Pesca Artesanal",
              "Pesca Comercial",
              "Pesca de Subsistência",
              "Piscicultura",
            ].includes(tipo),
          );

        return categoriaPesca || subtiposPesca;
      });

    return temCamposPesca || !!temCategoriaOuSubtipoPesca;
  };

  const produtorEhPescador = isPescador(selectedProdutor);

  const documentTypeFinal = useMemo(() => {
    if (
      selectedProdutor &&
      !produtorEhPescador &&
      (documentType === "sefaz-pescador" ||
        documentType === "declaracao-pescador")
    ) {
      return "declaracao-oficial" as TipoDocumento;
    }
    return documentType;
  }, [selectedProdutor, produtorEhPescador, documentType]);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${documentTypeFinal}_${selectedProdutor?.nome || "documento"}`,
  });

  const handleDownloadPDF = () => {
    // usa a mesma impressão do documento isolado
    handlePrint();
  };

  const renderDocumento = () => {
    if (!produtorComAtendimento) return null;

    if (documentTypeFinal === "declaracao-oficial") {
      return <DeclaracaoOficial produtor={produtorComAtendimento} />;
    }

    // invertido de propósito porque os componentes estão trocados
    if (documentTypeFinal === "sefaz-normal") {
      return <SefazNormal produtor={produtorComAtendimento} />;
    }

    // invertido de propósito porque os componentes estão trocados
    if (documentTypeFinal === "sefaz-pescador") {
      return <SefazPescador produtor={produtorComAtendimento} />;
    }

    if (documentTypeFinal === "declaracao-pescador") {
      return (
        <DeclaracaoPescadorOficial produtor={produtorComAtendimento} />
      );
    }

    return null;
  };

  return (
    <div className="idam-form space-y-6">
      {/* BUSCA */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-foreground mb-4">
          Selecione o Produtor
        </h2>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-input-background rounded-lg border border-border"
          />
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredProdutores.map((produtor) => (
            <button
              key={produtor.id}
              onClick={() => {
                setSelectedProdutor(produtor);
                setDocumentType("declaracao-oficial");
              }}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedProdutor?.id === produtor.id
                  ? "bg-primary/10 border-primary"
                  : "bg-input-background border-border hover:bg-accent/50"
              }`}
            >
              <p className="text-foreground font-medium">
                {produtor.nome}
              </p>
              <p className="text-sm text-muted-foreground">
                CPF: {produtor.cpf}
              </p>
              {isPescador(produtor) && (
                <p className="text-xs text-primary mt-1">
                  Produtor com documentos de pesca
                </p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TIPOS DE DOCUMENTO */}
      {selectedProdutor && (
        <div className="bg-card p-6 rounded-xl border">
          <h2 className="mb-4 text-foreground">
            Tipo de Documento
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() =>
                setDocumentType("declaracao-oficial")
              }
              className={`p-4 border rounded-lg transition-all ${
                documentType === "declaracao-oficial"
                  ? "bg-primary/10 border-primary"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              Declaração Oficial
            </button>

            <button
              onClick={() => setDocumentType("sefaz-normal")}
              className={`p-4 border rounded-lg transition-all ${
                documentType === "sefaz-normal"
                  ? "bg-primary/10 border-primary"
                  : "border-border hover:bg-accent/50"
              }`}
            >
              SEFAZ Normal
            </button>

            {produtorEhPescador && (
              <>
                <button
                  onClick={() =>
                    setDocumentType("sefaz-pescador")
                  }
                  className={`p-4 border rounded-lg transition-all ${
                    documentType === "sefaz-pescador"
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-accent/50"
                  }`}
                >
                  SEFAZ Pescador
                </button>

                <button
                  onClick={() =>
                    setDocumentType("declaracao-pescador")
                  }
                  className={`p-4 border rounded-lg transition-all ${
                    documentType === "declaracao-pescador"
                      ? "bg-primary/10 border-primary"
                      : "border-border hover:bg-accent/50"
                  }`}
                >
                  Declaração de Pescador
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* AÇÕES */}
      {selectedProdutor && (
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/50 transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-accent/50 transition-all"
            >
              <Download className="w-4 h-4" />
              Baixar PDF
            </button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {selectedProdutor && (
        <div className="bg-card p-6 rounded-xl border">
          <div className="mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <h2 className="text-foreground">Preview</h2>
          </div>

          <div className="bg-gray-100 p-4 border rounded-lg overflow-auto max-h-[850px]">
            {/* somente o documento entra na ref */}
            <div className="flex justify-center">
              <div ref={componentRef}>
                {renderDocumento()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
