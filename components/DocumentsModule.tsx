import React, { useMemo, useState } from 'react';
import { Building2, Download, Eye, File, FileImage, FileSpreadsheet, FileText, FolderOpen, Lock, PlusCircle, Search, ShieldCheck, Users } from 'lucide-react';
import { ClientCompany, PermissionProfile, User, UserRole } from '../types';
import DragAndDropUpload from './DragAndDropUpload';

type VisibilityScope = 'all' | 'restricted';
type FolderAccessType = 'general' | 'restricted_companies' | 'restricted_profiles';

type StoredFolder = {
  id: string;
  name: string;
  description: string;
  accessType: FolderAccessType;
  companyIds: string[];
  permissionProfileIds: string[];
  createdAt: string;
  createdBy: string;
};

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
  folderId: string;
};

type DocumentsCenterState = {
  folders: StoredFolder[];
  documents: StoredDocument[];
};

const DOCS_STORAGE_KEY = 'documents-center-v2';
const GENERAL_FOLDER_ID = 'folder-general';

const defaultFolder = (currentUser: User): StoredFolder => ({
  id: GENERAL_FOLDER_ID,
  name: 'Documentos Gerais Completos',
  description: 'Pasta padrão para documentos gerais visíveis para toda a organização.',
  accessType: 'general',
  companyIds: [],
  permissionProfileIds: [],
  createdAt: new Date().toISOString(),
  createdBy: currentUser.id,
});

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
  permissionProfiles: PermissionProfile[];
}

const DocumentsModule: React.FC<DocumentsModuleProps> = ({ currentUser, clientCompanies, permissionProfiles }) => {
  const [centerState, setCenterState] = useState<DocumentsCenterState>(() => {
    const fallback = { folders: [defaultFolder(currentUser)], documents: [] };
    if (typeof window === 'undefined') return fallback;

    try {
      const raw = localStorage.getItem(DOCS_STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as Partial<DocumentsCenterState>;
      const folders = Array.isArray(parsed.folders) ? parsed.folders : [defaultFolder(currentUser)];
      const hasGeneral = folders.some((folderItem) => folderItem.id === GENERAL_FOLDER_ID);
      return {
        folders: hasGeneral ? folders : [defaultFolder(currentUser), ...folders],
        documents: Array.isArray(parsed.documents) ? parsed.documents : [],
      };
    } catch {
      return fallback;
    }
  });

  const folders = centerState.folders;
  const documents = centerState.documents;

  const [search, setSearch] = useState('');
  const [visibility, setVisibility] = useState<VisibilityScope>('all');
  const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string>(GENERAL_FOLDER_ID);
  const [folderFilter, setFolderFilter] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);

  const [folderName, setFolderName] = useState('');
  const [folderDescription, setFolderDescription] = useState('');
  const [folderAccessType, setFolderAccessType] = useState<FolderAccessType>('general');
  const [folderCompanyIds, setFolderCompanyIds] = useState<string[]>([]);
  const [folderPermissionProfileIds, setFolderPermissionProfileIds] = useState<string[]>([]);

  const isAdmin = [UserRole.TENANT_ADMIN, UserRole.SUPER_ADMIN, UserRole.ADMINISTRATOR].includes(currentUser.role);

  const saveState = (next: DocumentsCenterState) => {
    setCenterState(next);
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(next));
  };

  const profileMap = useMemo(
    () => Object.fromEntries(permissionProfiles.map((profileItem) => [profileItem.id, profileItem.name])),
    [permissionProfiles],
  );

  const canAccessFolder = (folder: StoredFolder) => {
    if (isAdmin) return true;

    if (folder.accessType === 'general') return true;
    if (folder.accessType === 'restricted_companies') {
      if (!currentUser.clientCompanyId) return false;
      return folder.companyIds.includes(currentUser.clientCompanyId);
    }

    return !!currentUser.permissionProfileId && folder.permissionProfileIds.includes(currentUser.permissionProfileId);
  };

  const visibleDocuments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return documents.filter((doc) => {
      const folder = folders.find((folderItem) => folderItem.id === doc.folderId);
      if (!folder || !canAccessFolder(folder)) return false;

      const matchesSearch = !term || doc.name.toLowerCase().includes(term) || doc.mimeType.toLowerCase().includes(term) || folder.name.toLowerCase().includes(term);
      if (!matchesSearch) return false;

      if (folderFilter !== 'all' && doc.folderId !== folderFilter) return false;

      if (isAdmin) return true;
      if (doc.visibility === 'all') return true;
      if (doc.uploadedBy === currentUser.id) return true;
      if (!currentUser.clientCompanyId) return false;
      return doc.companyIds.includes(currentUser.clientCompanyId);
    });
  }, [documents, folders, search, folderFilter, isAdmin, currentUser.id, currentUser.clientCompanyId]);

  const handleUpload = (files: FileList | null) => {
    if (!files?.length) return;

    const selectedFolder = folders.find((folderItem) => folderItem.id === selectedFolderId);
    if (!selectedFolder) {
      setFeedback('Selecione uma pasta válida para anexar arquivos.');
      return;
    }

    if (visibility === 'restricted' && !selectedCompanyIds.length) {
      setFeedback('Selecione ao menos uma empresa quando a visibilidade do documento for restrita.');
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
      folderId: selectedFolder.id,
    }));

    saveState({ folders, documents: [...uploaded, ...documents] });
    setFeedback(`${uploaded.length} documento(s) anexado(s) com sucesso na pasta ${selectedFolder.name}.`);
  };

  const toggleSelection = (value: string, selectedValues: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => (selectedValues.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]));
  };

  const createFolder = () => {
    if (!isAdmin) return;

    const normalizedName = folderName.trim();
    if (!normalizedName) {
      setFeedback('Informe o nome da pasta para criar.');
      return;
    }

    if (folderAccessType === 'restricted_companies' && !folderCompanyIds.length) {
      setFeedback('Selecione ao menos uma empresa para pasta restrita por empresa.');
      return;
    }

    if (folderAccessType === 'restricted_profiles' && !folderPermissionProfileIds.length) {
      setFeedback('Selecione ao menos um perfil para pasta restrita por perfil de permissão.');
      return;
    }

    const nextFolder: StoredFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: normalizedName,
      description: folderDescription.trim() || 'Sem descrição',
      accessType: folderAccessType,
      companyIds: folderAccessType === 'restricted_companies' ? folderCompanyIds : [],
      permissionProfileIds: folderAccessType === 'restricted_profiles' ? folderPermissionProfileIds : [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
    };

    const nextFolders = [nextFolder, ...folders];
    saveState({ folders: nextFolders, documents });
    setSelectedFolderId(nextFolder.id);
    setFolderFilter(nextFolder.id);
    setFolderName('');
    setFolderDescription('');
    setFolderAccessType('general');
    setFolderCompanyIds([]);
    setFolderPermissionProfileIds([]);
    setFeedback(`Pasta "${nextFolder.name}" criada com sucesso.`);
  };

  const visibleFolders = folders.filter((folderItem) => canAccessFolder(folderItem));

  const selectedFolder = folders.find((folderItem) => folderItem.id === selectedFolderId) || folders[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Central de Documentos</h2>
          <p className="text-slate-500 text-sm mt-1">Anexe arquivos e organize em pastas com regras por empresa e perfil de permissão.</p>
        </div>
        <div className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-600 uppercase inline-flex items-center gap-2">
          <Users size={14} /> Perfil atual: {currentUser.role}
        </div>
      </div>

      {isAdmin && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-2 text-indigo-700">
            <PlusCircle size={16} />
            <p className="text-sm font-black uppercase">Criar pasta</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={folderName} onChange={(e) => setFolderName(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Nome da pasta (ex.: Documentos NR-01)" />
            <input value={folderDescription} onChange={(e) => setFolderDescription(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" placeholder="Descrição opcional" />
          </div>

          <select value={folderAccessType} onChange={(e) => setFolderAccessType(e.target.value as FolderAccessType)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
            <option value="general">Pasta geral (todos podem visualizar)</option>
            <option value="restricted_companies">Pasta restrita por empresa</option>
            <option value="restricted_profiles">Pasta restrita por perfil de permissão</option>
          </select>

          {folderAccessType === 'restricted_companies' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Empresas com acesso</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {clientCompanies.map((company) => (
                  <label key={company.id} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <input type="checkbox" checked={folderCompanyIds.includes(company.id)} onChange={() => toggleSelection(company.id, folderCompanyIds, setFolderCompanyIds)} />
                    {company.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          {folderAccessType === 'restricted_profiles' && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Perfis com acesso</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {permissionProfiles.map((profileItem) => (
                  <label key={profileItem.id} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <input type="checkbox" checked={folderPermissionProfileIds.includes(profileItem.id)} onChange={() => toggleSelection(profileItem.id, folderPermissionProfileIds, setFolderPermissionProfileIds)} />
                    {profileItem.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <button onClick={createFolder} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase inline-flex items-center gap-2 w-fit">
            <FolderOpen size={14} /> Criar pasta
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px_260px] gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm" placeholder="Buscar documento por nome, tipo ou pasta" />
          </div>

          <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50">
            <option value="all">Todas as pastas</option>
            {visibleFolders.map((folderItem) => (
              <option key={folderItem.id} value={folderItem.id}>{folderItem.name}</option>
            ))}
          </select>

          <select value={visibility} onChange={(e) => setVisibility(e.target.value as VisibilityScope)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50" disabled={!isAdmin}>
            <option value="all">Documento: todas empresas</option>
            <option value="restricted">Documento: empresas selecionadas</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select value={selectedFolderId} onChange={(e) => setSelectedFolderId(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold bg-slate-50" disabled={!visibleFolders.length}>
            {visibleFolders.map((folderItem) => (
              <option key={folderItem.id} value={folderItem.id}>{folderItem.name}</option>
            ))}
          </select>

          {selectedFolder && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-xs text-indigo-900">
              <p className="font-bold uppercase tracking-widest">Pasta selecionada</p>
              <p className="font-semibold mt-1">{selectedFolder.name}</p>
              <p className="text-indigo-800/80 mt-1">{selectedFolder.description}</p>
            </div>
          )}
        </div>

        {isAdmin && visibility === 'restricted' && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Quem pode ver este documento</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {clientCompanies.map((company) => (
                <label key={company.id} className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                  <input type="checkbox" checked={selectedCompanyIds.includes(company.id)} onChange={() => toggleSelection(company.id, selectedCompanyIds, setSelectedCompanyIds)} />
                  {company.name}
                </label>
              ))}
            </div>
          </div>
        )}

        <DragAndDropUpload
          onFilesSelected={handleUpload}
          disabled={visibility === 'restricted' && selectedCompanyIds.length === 0}
          title="Anexar documentos"
          description="Arraste e solte ou selecione múltiplos arquivos: doc, docx, xlsx, ppt, pdf, png, jpg..."
          buttonLabel="Selecionar"
        />

        {feedback && <p className={`text-sm font-semibold ${feedback.includes('sucesso') ? 'text-emerald-600' : 'text-rose-600'}`}>{feedback}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Total documentos</p><p className="text-2xl font-black text-slate-800 mt-1">{documents.length}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Pastas</p><p className="text-2xl font-black text-slate-800 mt-1">{folders.length}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Visíveis para você</p><p className="text-2xl font-black text-indigo-700 mt-1">{visibleDocuments.length}</p></div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4"><p className="text-xs font-bold text-slate-500 uppercase">Restritos</p><p className="text-2xl font-black text-amber-700 mt-1">{documents.filter((d) => d.visibility === 'restricted').length}</p></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleFolders.map((folderItem) => {
          const folderDocs = documents.filter((doc) => doc.folderId === folderItem.id);
          return (
            <button key={folderItem.id} onClick={() => setFolderFilter(folderItem.id)} className="text-left bg-white rounded-2xl border border-slate-200 p-4 hover:border-indigo-300 transition">
              <p className="font-black text-slate-800 inline-flex items-center gap-2"><FolderOpen size={14} /> {folderItem.name}</p>
              <p className="text-xs text-slate-500 mt-2">{folderItem.description}</p>
              <div className="mt-2 text-xs text-slate-500">{folderDocs.length} arquivo(s)</div>
              <div className="mt-3 text-[11px] font-bold text-slate-700">
                {folderItem.accessType === 'general' && <span className="inline-flex items-center gap-1 text-emerald-700"><Eye size={12} /> Acesso geral</span>}
                {folderItem.accessType === 'restricted_companies' && <span className="inline-flex items-center gap-1 text-amber-700"><Building2 size={12} /> {folderItem.companyIds.map((id) => clientCompanies.find((company) => company.id === id)?.name || id).join(', ')}</span>}
                {folderItem.accessType === 'restricted_profiles' && <span className="inline-flex items-center gap-1 text-violet-700"><ShieldCheck size={12} /> {folderItem.permissionProfileIds.map((id) => profileMap[id] || id).join(', ')}</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
        {!visibleDocuments.length && <div className="p-8 text-center text-sm text-slate-500">Nenhum documento disponível para seu perfil/empresa/pasta.</div>}
        {visibleDocuments.map((doc) => {
          const docFolder = folders.find((folderItem) => folderItem.id === doc.folderId);
          return (
            <div key={doc.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getFileIcon(doc.mimeType)}</div>
                <div>
                  <p className="font-black text-slate-800 text-sm">{doc.name}</p>
                  <p className="text-xs text-slate-500">{doc.mimeType} • {formatSize(doc.size)} • {new Date(doc.uploadedAt).toLocaleString('pt-BR')}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs flex-wrap">
                    {doc.visibility === 'all' ? (
                      <span className="px-2 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold inline-flex items-center gap-1"><Eye size={12} /> Todas empresas</span>
                    ) : (
                      <span className="px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 font-bold inline-flex items-center gap-1"><Lock size={12} /> Restrito</span>
                    )}
                    {doc.visibility === 'restricted' && (
                      <span className="text-slate-500 inline-flex items-center gap-1"><Building2 size={12} /> {doc.companyIds.map((id) => clientCompanies.find((c) => c.id === id)?.name || id).join(', ')}</span>
                    )}
                    {docFolder && <span className="text-indigo-700 inline-flex items-center gap-1"><FolderOpen size={12} /> {docFolder.name}</span>}
                  </div>
                </div>
              </div>
              <button className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold uppercase inline-flex items-center gap-2 self-start md:self-auto">
                <Download size={14} /> Download
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-xs text-indigo-900">
        <p className="font-bold uppercase tracking-widest inline-flex items-center gap-2"><FolderOpen size={14} /> Regras de acesso</p>
        <ul className="mt-2 space-y-1 list-disc ml-5">
          <li>Você pode criar pastas gerais, restritas por empresa e restritas por perfil de permissão.</li>
          <li>Documentos podem ser anexados em pastas específicas para facilitar organização e compliance.</li>
          <li>Usuários sem perfil admin só veem pastas permitidas para sua empresa/perfil e os documentos autorizados.</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentsModule;
