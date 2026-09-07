import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Download,
  Star,
  RefreshCw,
  ExternalLink,
  Film,
  Sparkles,
  FileText,
  Volume2,
  Code2,
  Calendar,
  AlertCircle,
  FolderOpen,
} from 'lucide-react';
import { CreatedItem, CreationCategory, CreationToolItem } from '../types';
import { CATEGORY_METADATA, CREATION_TOOLS } from '../data/creationData';

interface MyCreationsViewProps {
  items: CreatedItem[];
  onDeleteItem: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onRegenerate: (tool: CreationToolItem, prompt: string, options: Record<string, any>) => void;
  onGoToTools: () => void;
}

export const MyCreationsView: React.FC<MyCreationsViewProps> = ({
  items,
  onDeleteItem,
  onToggleFavorite,
  onRegenerate,
  onGoToTools,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemForModal, setSelectedItemForModal] = useState<CreatedItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'favorites'
        ? item.isFavorite
        : item.category === selectedCategory;

    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.resultContent.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (item: CreatedItem) => {
    const element = document.createElement('a');
    const file = new Blob([item.resultContent], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${item.category}-${item.toolId}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerateClick = (item: CreatedItem) => {
    const tool = CREATION_TOOLS.find((t) => t.id === item.toolId) || {
      id: item.toolId,
      category: item.category,
      name: item.toolName,
      description: '',
      iconName: 'Sparkles',
      promptPlaceholder: '',
    };
    onRegenerate(tool, item.prompt, item.options);
  };

  const getCategoryIcon = (cat: CreationCategory) => {
    switch (cat) {
      case 'video':
        return <Film className="w-3.5 h-3.5 text-purple-600" />;
      case 'image':
        return <Sparkles className="w-3.5 h-3.5 text-blue-600" />;
      case 'text':
        return <FileText className="w-3.5 h-3.5 text-emerald-600" />;
      case 'audio':
        return <Volume2 className="w-3.5 h-3.5 text-amber-600" />;
      case 'code':
        return <Code2 className="w-3.5 h-3.5 text-cyan-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar nas suas criações..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-blue-500 shadow-2xs font-medium"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Todas ({items.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedCategory('favorites')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'favorites'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>Favoritos</span>
          </button>

          {CATEGORY_METADATA.map((cat) => {
            const count = items.filter((i) => i.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{cat.iconEmoji}</span>
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Creations */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FolderOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-slate-900">Nenhuma criação encontrada</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Nenhum resultado corresponde à sua busca atual.'
                : 'Você ainda não gerou criações nesta categoria. Escolha uma ferramenta e gere seu primeiro conteúdo!'}
            </p>
          </div>
          <div>
            <button
              onClick={onGoToTools}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Explorar Ferramentas</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-slate-100">{getCategoryIcon(item.category)}</span>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[140px]">
                      {item.toolName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.isFavorite
                          ? 'text-amber-500 hover:text-amber-600'
                          : 'text-slate-300 hover:text-amber-500'
                      }`}
                      title={item.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                    >
                      <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt Title */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug">
                    "{item.prompt}"
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span className="uppercase font-semibold">{item.category}</span>
                  </div>
                </div>

                {/* Content Snippet */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-600 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {item.resultContent}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedItemForModal(item)}
                  className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer inline-flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Visualizar</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleCopy(item.id, item.resultContent)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    title="Copiar"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownload(item)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    title="Baixar .txt"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRegenerateClick(item)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    title="Regenerar / Reabrir"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Preview Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-xl font-bold">
                  {getCategoryIcon(selectedItemForModal.category)}
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900">{selectedItemForModal.toolName}</h4>
                  <p className="text-[11px] text-slate-500">{new Date(selectedItemForModal.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(selectedItemForModal.id, selectedItemForModal.resultContent)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer inline-flex items-center gap-1.5"
                >
                  {copiedId === selectedItemForModal.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === selectedItemForModal.id ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedItemForModal)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Baixar"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSelectedItemForModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Prompt utilizado</span>
                <p className="text-xs font-bold text-slate-800 bg-slate-100/70 p-3 rounded-xl border border-slate-200">
                  {selectedItemForModal.prompt}
                </p>
              </div>

              {selectedItemForModal.statusNotice && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                  {selectedItemForModal.statusNotice}
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">Conteúdo</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {selectedItemForModal.resultContent}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => {
                  const item = selectedItemForModal;
                  setSelectedItemForModal(null);
                  handleRegenerateClick(item);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer inline-flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerar / Editar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
