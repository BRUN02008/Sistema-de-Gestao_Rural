import { useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import RecomendacoesDocumento from "./RecomendacoesDocumento";
import { Printer } from "lucide-react";

interface Produtor {
  nome: string;
  cpf?: string;
}

interface Recomendacao {
  id: string;
  produtorNome: string;
  produtorCpf: string;

  recomendacao: string;

  tecnicoResponsavel: string;
  tecnicoResponsavelId?: string;
  tecnicoResponsavelEmail?: string;

  criadoPorId?: string;
  criadoPorNome?: string;
  criadoPorEmail?: string;

  data: string;
  documento?: string;

  dataCriacao?: string;
}

export default function RecomendacoesTecnicas() {
  const [produtores] = useState<Produtor[]>(() => {
    const stored = localStorage.getItem("produtores");
    return stored ? JSON.parse(stored) : [];
  });
  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>(() => {
    const stored = localStorage.getItem("recomendacoesTecnicas");
    return stored ? JSON.parse(stored) : [];
  });
  const usuarioLogado = JSON.parse(
    localStorage.getItem("usuarioLogado") || "null",
  );

  const [busca, setBusca] = useState("");
  const [produtorSelecionado, setProdutorSelecionado] =
    useState<Produtor | null>(null);
  const [recomendacaoParaVisualizar, setRecomendacaoParaVisualizar] =
    useState<Recomendacao | null>(null);

  const documentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: documentRef,
    documentTitle: recomendacaoParaVisualizar
      ? `Recomendacoes_${recomendacaoParaVisualizar.produtorNome}`
      : "Recomendacoes_Tecnicas",
  });

  const [formData, setFormData] = useState({
    recomendacao: "",
    tecnicoResponsavel: usuarioLogado?.nome || "",
    data: new Date().toISOString().split("T")[0],
    documento: "",
  });

  const produtoresFiltrados = produtores.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (p.cpf || "").includes(busca),
  );

  const handleSelecionar = (produtor: Produtor) => {
    setProdutorSelecionado(produtor);
  };

  const handleUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({
        ...formData,
        documento: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSalvar = () => {
    if (!produtorSelecionado || !formData.recomendacao) {
      alert("Selecione um produtor e escreva a recomendação.");
      return;
    }

    const usuarioLogado = JSON.parse(
      localStorage.getItem("usuarioLogado") || "null",
    );

    const nova: Recomendacao = {
      id: Date.now().toString(),
      produtorNome: produtorSelecionado.nome,
      produtorCpf: produtorSelecionado.cpf || "",

      recomendacao: formData.recomendacao,

      tecnicoResponsavel:
        formData.tecnicoResponsavel ||
        usuarioLogado?.nome ||
        "",

      tecnicoResponsavelId: usuarioLogado?.id || "",
      tecnicoResponsavelEmail: usuarioLogado?.email || "",

      criadoPorId: usuarioLogado?.id || "",
      criadoPorNome: usuarioLogado?.nome || "",
      criadoPorEmail: usuarioLogado?.email || "",

      data: formData.data,
      documento: formData.documento,

      dataCriacao: new Date().toISOString(),
    };

    const lista = [nova, ...recomendacoes];

    setRecomendacoes(lista);

    localStorage.setItem(
      "recomendacoesTecnicas",
      JSON.stringify(lista),
    );

    // Definir a recomendação recém-criada para visualização
    setRecomendacaoParaVisualizar(nova);

    setFormData({
      recomendacao: "",
      tecnicoResponsavel: usuarioLogado?.nome || "",
      data: new Date().toISOString().split("T")[0],
      documento: "",
    });

    alert("Salvo com sucesso! Você pode visualizar e imprimir o documento abaixo.");
  };

  return (
    <div className="space-y-6">
      {/* 🔍 BUSCA */}
      <div className="bg-card p-6 rounded-xl border">
        <h2 className="font-semibold mb-4">Buscar Produtor</h2>

        <input
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <div className="mt-4 space-y-2 max-h-60 overflow-auto">
          {produtoresFiltrados.map((p, i) => (
            <div
              key={i}
              onClick={() => handleSelecionar(p)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-accent"
            >
              <strong>{p.nome}</strong>
              <p className="text-xs">{p.cpf}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 📋 FORM */}
      {produtorSelecionado && (
        <div className="bg-card p-6 rounded-xl border space-y-4">
          <h2 className="font-semibold">
            Produtor: {produtorSelecionado.nome}
          </h2>

          <label htmlFor="tecnico-responsavel" className="block text-sm font-medium mb-2">
            Técnico responsável
          </label>
          <input
            id="tecnico-responsavel"
            type="text"
            value={formData.tecnicoResponsavel}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          />

          <label htmlFor="recomendacao-textarea" className="block text-sm font-medium mb-2">
            Recomendação técnica
          </label>
          <textarea
            id="recomendacao-textarea"
            placeholder="Digite a recomendação técnica..."
            value={formData.recomendacao}
            onChange={(e) =>
              setFormData({
                ...formData,
                recomendacao: e.target.value,
              })
            }
            className="w-full px-4 py-2 border rounded-lg"
            rows={5}
          />

          {/* 📎 Upload */}
          <div>
            <label className="block mb-3 font-semibold text-foreground">
              📎 Anexar Documento (Opcional)
            </label>
            <div className="flex items-center gap-3 bg-accent/30 p-4 rounded-lg border border-border">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-all shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                Escolher Arquivo
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) =>
                    e.target.files &&
                    handleUpload(e.target.files[0])
                  }
                  className="hidden"
                />
              </label>
              <span className="text-sm text-muted-foreground">
                {formData.documento ? "✓ Arquivo anexado" : "Nenhum arquivo selecionado"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Formatos aceitos: PDF, imagens (JPG, PNG)
            </p>
          </div>

          <button
            onClick={handleSalvar}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Salvar recomendação
          </button>
        </div>
      )}

      {/* 📚 LISTA */}
      <div className="bg-card p-6 rounded-xl border">
        <h3 className="font-semibold mb-4">
          Recomendações registradas
        </h3>

        {recomendacoes.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Nenhuma recomendação registrada ainda
          </p>
        ) : (
          recomendacoes.map((r) => (
            <div
              key={r.id}
              className="border p-4 rounded-lg mb-3 space-y-3"
            >
              <div>
                <strong className="text-foreground">{r.produtorNome}</strong>
                {r.produtorCpf && (
                  <span className="text-sm text-muted-foreground ml-2">
                    - CPF: {r.produtorCpf}
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {r.recomendacao}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Técnico: {r.tecnicoResponsavel}</span>
                <span>Data: {new Date(r.data).toLocaleDateString("pt-BR")}</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setRecomendacaoParaVisualizar(r)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Visualizar/Imprimir Documento
                </button>

                {r.documento && (
                  <a
                    href={r.documento}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-all"
                  >
                    Ver anexo
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 📄 VISUALIZAÇÃO DO DOCUMENTO */}
      {recomendacaoParaVisualizar && (
        <div className="bg-card p-6 rounded-xl border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Documento de Recomendações Técnicas
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => handlePrint()}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
              >
                <Printer className="w-4 h-4" />
                Imprimir
              </button>
              <button
                onClick={() => setRecomendacaoParaVisualizar(null)}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-all"
              >
                Fechar
              </button>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-white">
            <div ref={documentRef}>
              <RecomendacoesDocumento
                produtor={{
                  nome: recomendacaoParaVisualizar.produtorNome,
                  cpf: recomendacaoParaVisualizar.produtorCpf,
                }}
                recomendacao={recomendacaoParaVisualizar.recomendacao}
                tecnicoResponsavel={recomendacaoParaVisualizar.tecnicoResponsavel}
                data={recomendacaoParaVisualizar.data}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
