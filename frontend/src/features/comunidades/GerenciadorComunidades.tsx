import { useState } from "react";
import { MapPin, Plus, Trash2, Edit2, Save, X } from "lucide-react";

interface Comunidade {
  id: string;
  nome: string;
  municipio: string;
  localizacao: string;
  dataCadastro: string;
}

export default function GerenciadorComunidades() {
  const [comunidades, setComunidades] = useState<Comunidade[]>(() => {
    const comunidadesStorage = localStorage.getItem("comunidades");
    return comunidadesStorage ? JSON.parse(comunidadesStorage) : [];
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Comunidade | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    municipio: "",
    localizacao: "",
  });

  const gerarId = () => Date.now().toString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editando) {
      // Atualizar
      const novasComunidades = comunidades.map(c =>
        c.id === editando.id
          ? { ...editando, ...formData }
          : c
      );
      setComunidades(novasComunidades);
      localStorage.setItem("comunidades", JSON.stringify(novasComunidades));
    } else {
      // Criar nova
      const novaComunidade: Comunidade = {
        id: gerarId(),
        ...formData,
        dataCadastro: new Date().toISOString(),
      };
      const novasComunidades = [...comunidades, novaComunidade];
      setComunidades(novasComunidades);
      localStorage.setItem("comunidades", JSON.stringify(novasComunidades));
    }

    limparFormulario();
  };

  const limparFormulario = () => {
    setFormData({ nome: "", municipio: "", localizacao: "" });
    setMostrarFormulario(false);
    setEditando(null);
  };

  const handleEditar = (comunidade: Comunidade) => {
    setEditando(comunidade);
    setFormData({
      nome: comunidade.nome,
      municipio: comunidade.municipio,
      localizacao: comunidade.localizacao,
    });
    setMostrarFormulario(true);
  };

  const handleExcluir = (id: string) => {
    if (confirm("Deseja realmente excluir esta comunidade?")) {
      const novasComunidades = comunidades.filter(c => c.id !== id);
      setComunidades(novasComunidades);
      localStorage.setItem("comunidades", JSON.stringify(novasComunidades));
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-linear-to-r from-teal-600 to-teal-700 rounded-xl p-6 shadow-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Gerenciar Comunidades</h2>
              <p className="text-teal-100 mt-1">
                Cadastre e gerencie as comunidades da região
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMostrarFormulario(true);
              limparFormulario();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-all shadow-lg font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nova Comunidade
          </button>
        </div>
      </div>

      {/* FORMULÁRIO */}
      {mostrarFormulario && (
        <div className="bg-card rounded-xl border-2 border-teal-500/20 p-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
          <h3 className="text-lg font-bold text-foreground mb-6">
            {editando ? "Editar Comunidade" : "Nova Comunidade"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nome da Comunidade <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                placeholder="Ex: São José, Santa Maria..."
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Município <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.municipio}
                onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                placeholder="Ex: Manaus, Parintins..."
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Localização de Referência
              </label>
              <input
                type="text"
                value={formData.localizacao}
                onChange={(e) => setFormData({ ...formData, localizacao: e.target.value })}
                placeholder="Ex: Margem direita do Rio Negro, KM 23 da AM-010..."
                className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg font-semibold"
              >
                <Save className="w-5 h-5" />
                {editando ? "Atualizar" : "Salvar"}
              </button>
              <button
                type="button"
                onClick={limparFormulario}
                className="px-6 py-3 border-2 border-border rounded-lg hover:bg-accent transition-all font-semibold"
                aria-label="Cancelar"
                title="Cancelar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LISTA DE COMUNIDADES */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground mb-4">
          Comunidades Cadastradas ({comunidades.length})
        </h3>

        {comunidades.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Nenhuma comunidade cadastrada</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comunidades.map(comunidade => (
              <div
                key={comunidade.id}
                className="bg-gradient-to-br from-teal-50 to-teal-100/30 border border-teal-200 p-4 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-teal-900 text-lg">
                      {comunidade.nome}
                    </h4>
                    <p className="text-sm text-teal-700 mt-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {comunidade.municipio}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditar(comunidade)}
                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExcluir(comunidade.id)}
                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {comunidade.localizacao && (
                  <p className="text-xs text-teal-600 bg-white/60 p-2 rounded">
                    {comunidade.localizacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
