import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Users,
  FileText,
  CalendarDays,
  ClipboardPenLine,
  BarChart3,
} from "lucide-react";

interface Produtor {
  id: string;
  nome: string;
  cpf: string;
  cadastradoPorId?: string;
  cadastradoPorNome?: string;
  tipoPesca?: string;
  rgPesca?: string;
  protocoloRgp?: string;
  perfil?: string[];
  atividades?: string[];
  [key: string]: any;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  tipo: "adm" | "tecnico";
}

interface DocumentoGerado {
  id: string;
  produtorId?: string;
  produtorNome?: string;
  tipoDocumento?: string;
  geradoPorId?: string;
  geradoPorNome?: string;
  dataGeracao?: string;
}

interface CronogramaItem {
  id: string;
  criadoPorId?: string;
  criadoPorNome?: string;
  [key: string]: any;
}

interface ObservacaoItem {
  id: string;
  tecnicoResponsavelId?: string;
  tecnicoResponsavelNome?: string;
  tecnicoResponsavel?: string;
  [key: string]: any;
}

function Card({
  titulo,
  valor,
  icon,
  onClick,
}: {
  titulo: string;
  valor: number | string;
  icon: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-card rounded-xl border border-border p-5 shadow-sm transition ${
        onClick ? "cursor-pointer hover:bg-accent/40" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-muted-foreground">{titulo}</p>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-foreground">{valor}</p>
    </div>
  );
}

export default function PainelAdmin() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [produtores, setProdutores] = useState<Produtor[]>([]);
  const [documentos, setDocumentos] = useState<DocumentoGerado[]>([]);
  const [cronogramas, setCronogramas] = useState<CronogramaItem[]>([]);
  const [observacoes, setObservacoes] = useState<ObservacaoItem[]>([]);

  const [secaoAtiva, setSecaoAtiva] = useState<
    "produtores" | "documentos" | "cronogramas" | "observacoes" | null
  >(null);

  useEffect(() => {
    setUsuarios(JSON.parse(localStorage.getItem("usuarios") || "[]"));
    setProdutores(JSON.parse(localStorage.getItem("produtores") || "[]"));
    setDocumentos(
      JSON.parse(localStorage.getItem("historicoDocumentos") || "[]")
    );
    setCronogramas(JSON.parse(localStorage.getItem("cronogramas") || "[]"));
    setObservacoes(
      JSON.parse(localStorage.getItem("recomendacoesTecnicas") || "[]")
    );
  }, []);

  function isPescador(produtor: Produtor) {
    return (
      produtor.tipoPesca ||
      produtor.rgPesca ||
      produtor.protocoloRgp ||
      produtor.perfil?.includes?.("Pescador") ||
      produtor.atividades?.includes?.("Pesca")
    );
  }

  function documentosDisponiveis(produtor: Produtor) {
    const docs = ["Declaração Oficial", "SEFAZ"];

    if (isPescador(produtor)) {
      docs.push("Declaração de Pescador", "SEFAZ Pescador");
    }

    return docs;
  }

  const tecnicos = useMemo(
    () => usuarios.filter((u) => u.tipo === "tecnico"),
    [usuarios]
  );

  const resumoTecnicos = useMemo(() => {
    return tecnicos.map((tecnico) => {
      const produtoresDoTecnico = produtores.filter(
        (p) => p.cadastradoPorId === tecnico.id
      ).length;

      const documentosDoTecnico = documentos.filter(
        (d) => d.geradoPorId === tecnico.id
      ).length;

      const cronogramasDoTecnico = cronogramas.filter(
        (c) => c.criadoPorId === tecnico.id
      ).length;

      const observacoesDoTecnico = observacoes.filter(
        (o) =>
          o.tecnicoResponsavelId === tecnico.id ||
          o.tecnicoResponsavelNome === tecnico.nome ||
          o.tecnicoResponsavel === tecnico.nome
      ).length;

      const faltam = Math.max(72 - produtoresDoTecnico, 0);
      const progresso = Math.min(
        Math.round((produtoresDoTecnico / 72) * 100),
        100
      );

      return {
        ...tecnico,
        produtoresDoTecnico,
        documentosDoTecnico,
        cronogramasDoTecnico,
        observacoesDoTecnico,
        faltam,
        progresso,
      };
    });
  }, [tecnicos, produtores, documentos, cronogramas, observacoes]);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-foreground text-xl font-semibold">
          Painel Administrativo
        </h2>
        <p className="text-muted-foreground mt-1">
          Acompanhamento geral dos técnicos, produtores, cronogramas,
          observações e documentos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          titulo="Produtores cadastrados"
          valor={produtores.length}
          icon={<Users className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("produtores")}
        />

        <Card
          titulo="Documentos gerados"
          valor={documentos.length}
          icon={<FileText className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("documentos")}
        />

        <Card
          titulo="Cronogramas"
          valor={cronogramas.length}
          icon={<CalendarDays className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("cronogramas")}
        />

        <Card
          titulo="Observações técnicas"
          valor={observacoes.length}
          icon={<ClipboardPenLine className="w-5 h-5" />}
          onClick={() => setSecaoAtiva("observacoes")}
        />
      </div>

      {secaoAtiva === "produtores" && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-foreground text-lg font-semibold mb-4">
            Produtores Cadastrados
          </h3>

          {produtores.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum produtor cadastrado.
            </p>
          ) : (
            <div className="space-y-3">
              {produtores.map((produtor) => (
                <div
                  key={produtor.id}
                  className="rounded-xl border border-border p-4 space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="text-foreground font-semibold">
                        {produtor.nome}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        CPF: {produtor.cpf}
                      </p>
                    </div>

                    <div className="text-sm text-muted-foreground md:text-right">
                      <p>Cadastrado por:</p>
                      <p className="text-foreground font-medium">
                        {produtor.cadastradoPorNome || "Não informado"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Documentos disponíveis:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {documentosDisponiveis(produtor).map((doc) => (
                        <span
                          key={doc}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {secaoAtiva === "documentos" && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-foreground text-lg font-semibold mb-4">
            Documentos Gerados
          </h3>

          {documentos.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum documento gerado.
            </p>
          ) : (
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-lg border border-border p-4"
                >
                  <p className="text-foreground font-medium">
                    {doc.tipoDocumento || "Documento sem tipo informado"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Produtor: {doc.produtorNome || "Não informado"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Gerado por: {doc.geradoPorNome || "Não informado"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data: {doc.dataGeracao || "Não informada"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {secaoAtiva === "cronogramas" && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-foreground text-lg font-semibold mb-4">
            Cronogramas
          </h3>

          {cronogramas.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhum cronograma cadastrado.
            </p>
          ) : (
            <div className="space-y-3">
              {cronogramas.map((cronograma) => (
                <div
                  key={cronograma.id}
                  className="rounded-lg border border-border p-4"
                >
                  <p className="text-foreground font-medium">
                    {cronograma.titulo || "Cronograma sem título"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Criado por:{" "}
                    {cronograma.criadoPorNome || "Não informado"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {secaoAtiva === "observacoes" && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-foreground text-lg font-semibold mb-4">
            Observações Técnicas
          </h3>

          {observacoes.length === 0 ? (
            <p className="text-muted-foreground">
              Nenhuma observação registrada.
            </p>
          ) : (
            <div className="space-y-3">
              {observacoes.map((obs) => (
                <div
                  key={obs.id}
                  className="rounded-lg border border-border p-4"
                >
                  <p className="text-foreground font-medium">
                    {obs.titulo || "Observação técnica"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Técnico:{" "}
                    {obs.tecnicoResponsavelNome ||
                      obs.tecnicoResponsavel ||
                      "Não informado"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {obs.descricao || obs.observacao || "Sem descrição."}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-primary" />
          <h3 className="text-foreground text-lg font-semibold">
            Acompanhamento por Técnico
          </h3>
        </div>

        {resumoTecnicos.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum técnico cadastrado ainda.
          </p>
        ) : (
          <div className="space-y-4">
            {resumoTecnicos.map((tecnico) => (
              <div
                key={tecnico.id}
                className="rounded-xl border border-border p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <div>
                    <p className="text-foreground font-medium">
                      {tecnico.nome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tecnico.email}
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Meta: 72 produtores
                  </div>
                </div>

                <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${tecnico.progresso}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-muted-foreground">Produtores</p>
                    <p className="text-foreground font-semibold">
                      {tecnico.produtoresDoTecnico}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-muted-foreground">Faltam</p>
                    <p className="text-foreground font-semibold">
                      {tecnico.faltam}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-muted-foreground">Documentos</p>
                    <p className="text-foreground font-semibold">
                      {tecnico.documentosDoTecnico}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-muted-foreground">Cronogramas</p>
                    <p className="text-foreground font-semibold">
                      {tecnico.cronogramasDoTecnico}
                    </p>
                  </div>

                  <div className="rounded-lg bg-accent/40 p-3">
                    <p className="text-muted-foreground">Observações</p>
                    <p className="text-foreground font-semibold">
                      {tecnico.observacoesDoTecnico}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-foreground text-lg font-semibold mb-4">
          Últimos Produtores Cadastrados
        </h3>

        {produtores.length === 0 ? (
          <p className="text-muted-foreground">
            Nenhum produtor cadastrado.
          </p>
        ) : (
          <div className="space-y-3">
            {[...produtores]
              .slice(-5)
              .reverse()
              .map((produtor) => (
                <div
                  key={produtor.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="text-foreground font-medium">
                      {produtor.nome}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      CPF: {produtor.cpf}
                    </p>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Cadastrado por:{" "}
                    {produtor.cadastradoPorNome || "Não informado"}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}