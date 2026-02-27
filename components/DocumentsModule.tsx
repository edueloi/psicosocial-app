import React, { useMemo, useState } from 'react';
import { Building2, Download, Eye, File, FileImage, FileSpreadsheet, FileText, FolderOpen, Lock, Search, UploadCloud, Users } from 'lucide-react';
import { ClientCompany, User, UserRole } from '../types';

type VisibilityScope = 'all' | 'restricted';

type StoredDocument = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  uploaderRole: string;
  visibility: VisibilityScope;
  companyIds: string[];
};

const DOCS_STORAGE_KEY = 'documents-center-v1';

const formatSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.includes('image/')) return <FileImage size={16} className="text-emerald-600" />;
  if (mimeType.includes('sheet') || mimeType.includes('excel') || mimeType.includes('csv')) return <FileSpreadsheet size={16} className="text-emerald-700" />;
  if (mimeType.includes('word') || mimeType.includes('presentation') || mimeType.includes('pdf') || mimeType.includes('text')) return <FileText size={16} className="text-indigo-600" />;
  return <File size={16} className="text-slate-500" />;
};

interface DocumentsModuleProps {
  currentUser: User;
  clientCompanies: ClientCompany[];
}

const DocumentsModule: React.FC<DocumentsModuleProps> = ({ currentUser, clientCompanies }) => {
  const [documents, setDocuments] = useState<StoredDocument[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(DOCS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<VisibilityScope>('all');
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isAdmin = [UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMINISTRATOR].includes(currentUser.role);

  const visibleDocuments = useMemo(() => {
    const term = search.trim().toLowerCase();
    return documents.filter((doc) => {
      const matchesSearch = !term || doc.name.toLowerCase().includes(term) || doc.mimeType.toLowerCase().includes(term);
      if (!matchesSearch) return false;
      if (isAdmin) return true;

      if (doc.visibility === 'all') return true;
      if (doc.uploadedBy === currentUser.id) return true;
      if (!currentUser.clientCompanyId) return false;
      return doc.companyIds.includes(currentUser.clientCompanyId);
    });
  }, [documents, search, isAdmin, currentUser.id, currentUser.clientCompanyId]);

  const saveDocuments = (next: StoredDocument[]) => {
    setDocuments(next);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(next));
  };

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;

    if (visibility === 'restricted' && !selectedCompanyIds.length) {
      setFeedback('Selecione ao menos uma empresa quando a visibilidade for restrita.');
      return;
    }

    const uploaded: StoredDocument[] = Array.from(files).map((file) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.id,
      uploaderRole: currentUser.role,
      visibility,
      companyIds: visibility === 'all' ? [] : selectedCompanyIds,
    }));

    saveDocuments([uploaded[0], ...uploaded.slice(1), ...documents]);
    setFeedback(`${uploaded.length} documento(s) anexado(s) com sucesso.`);
  };

  const toggleCompany = (companyId: string) => {
    setSelectedCompanyIds((prev) => (prev.includes(companyId) ? prev.filter((id) => id !== companyId) : [...prev, companyId]));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Central de Documentos</h2>
          <p className="text-slate-500 text-sm mt-1">Anexe arquivos (Word, Excel, PDF, PPT, PNG e outros) com visibilidade por empresa.</p>
        </div>
        <div className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 uppercase inline-flex items-center gap-2">
          <Users size={14} /> Perfil atual: {currentUser.role}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" placeholder="Buscar documento por nome/tipo" />
          </div>
          <select value={visibility} onChange={(e) => setVisibility(e.target.value as VisibilityScope)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50" disabled={!isAdmin}>
            <option value="all">Visibilidade: todas empresas</option>
            <option value="restricted">Visibilidade: empresas selecionadas</option>
          </select>
        </div>

        {isAdmin && visibility === 'restricted' && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Quem pode ver</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {clientCompanies.map((company) => (
                <label key={company.id} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <input type="checkbox" checked={selectedCompanyIds.includes(company.id)} onChange={() => toggleCompany(company.id)} />
                  {company.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <label className="w-full border-2 border-dashed border-indigo-200 rounded-2xl p-5 flex items-center justify-between bg-indigo-50/40 cursor-pointer hover:bg-indigo-50 transition">
          <div className="flex items-center gap-3">
            <UploadCloud className="text-indigo-600" size={20} />
            <div>
              <p className="text-sm font-black text-indigo-700">Anexar documentos</p>
              <p className="text-xs text-slate-500">Suporta múltiplos arquivos: doc, docx, xlsx, ppt, pdf, png, jpg...</p>
            </div>
          </div>
          <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          <span className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-xs font-black uppercase">Selecionar</span>
        </label>

        {feedback && <p className={`text-sm font-semibold ${feedback.includes('sucesso') ? 'text-emerald-600' : 'text-rose-600'}`}>{feedback}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Total documentos</p><p className="text-2xl font-black text-slate-800 mt-1">{documents.length}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Visíveis para você</p><p className="text-2xl font-black text-indigo-700 mt-1">{visibleDocuments.length}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Restritos</p><p className="text-2xl font-black text-amber-700 mt-1">{documents.filter((d) => d.visibility === 'restricted').length}</p></div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {!visibleDocuments.length && <div className="p-8 text-center text-sm text-slate-500">Nenhum documento disponível para seu perfil/empresa.</div>}
        {visibleDocuments.map((doc) => (
          <div key={doc.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getFileIcon(doc.mimeType)}</div>
              <div>
                <p className="font-black text-slate-800 text-sm">{doc.name}</p>
                <p className="text-xs text-slate-500">{doc.mimeType} • {formatSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleString('pt-BR')}</p>
                <div className="mt-1 flex items-center gap-2 text-xs">
                  {doc.visibility === 'all' ? (
                    <span className="px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold inline-flex items-center gap-1"><Eye size={12} /> Todas empresas</span>
                  ) : (
                    <span className="px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 font-bold inline-flex items-center gap-1"><Lock size={12} /> Restrito</span>
                  )}
                  {doc.visibility === 'restricted' && (
                    <span className="text-slate-500 inline-flex items-center gap-1"><Building2 size={12} /> {doc.companyIds.map((id) => clientCompanies.find((c) => c.id === id)?.name || id).join(', ')}</span>
                  )}
                </div>
              </div>
            </div>
            <button className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold uppercase inline-flex items-center gap-2 self-start md:self-auto">
              <Download size={14} /> Download
            </button>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900">
        <p className="font-bold uppercase tracking-widest inline-flex items-center gap-2"><FolderOpen size={14} /> Regras de acesso</p>
        <ul className="mt-2 space-y-1 list-disc ml-5">
          <li>Admins podem anexar e definir visibilidade por empresa.</li>
          <li>Usuários comuns visualizam apenas documentos globais, da empresa deles ou os próprios anexos.</li>
          <li>Tipos suportados: Word, Excel, PowerPoint, PDF, imagens e demais formatos de arquivo.</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentsModule;
