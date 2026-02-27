import React from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  ListChecks,
  CalendarDays,
  ToggleRight,
  Type,
  ChevronDownSquare,
  Dot,
  Save,
  Download,
  Upload,
  RotateCcw,
} from 'lucide-react';

type FieldType = 'text' | 'textarea' | 'dropdown' | 'radio' | 'date' | 'boolean';

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  helpText?: string;
}

interface PersistedFormState {
  formName: string;
  description: string;
  successMessage: string;
  fields: FormField[];
  publicSlug: string;
}

const STORAGE_KEY = 'forms-center-state-v1';
const DEFAULT_PUBLIC_SLUG = `form-${Math.random().toString(36).slice(2, 8)}`;

const defaultFields: FormField[] = [
  { id: 'f1', type: 'text', label: 'Nome completo', placeholder: 'Digite seu nome', required: true, helpText: 'Identificação do colaborador.' },
  { id: 'f2', type: 'dropdown', label: 'Setor', required: true, options: ['Produção', 'Administrativo', 'Logística'], helpText: 'Selecione seu setor.' },
  { id: 'f3', type: 'radio', label: 'Como avalia sua carga de trabalho?', required: true, options: ['Leve', 'Moderada', 'Alta'], helpText: 'Percepção individual.' },
  { id: 'f4', type: 'date', label: 'Data da avaliação', required: true, helpText: 'Quando você preencheu este formulário?' },
  { id: 'f5', type: 'boolean', label: 'Autoriza compartilhamento externo dos dados para análise?', required: true, helpText: 'Consentimento obrigatório.' },
];

const fieldTemplates: Record<FieldType, Omit<FormField, 'id'>> = {
  text: { type: 'text', label: 'Campo de texto', placeholder: 'Digite aqui', required: false, helpText: 'Resposta curta.' },
  textarea: { type: 'textarea', label: 'Descrição detalhada', placeholder: 'Descreva em detalhes', required: false, helpText: 'Resposta longa.' },
  dropdown: { type: 'dropdown', label: 'Seleção única', required: false, options: ['Opção 1', 'Opção 2'], helpText: 'Escolha uma alternativa.' },
  radio: { type: 'radio', label: 'Múltipla escolha', required: false, options: ['Sim', 'Não', 'Parcial'], helpText: 'Marque apenas uma opção.' },
  date: { type: 'date', label: 'Data', required: false, helpText: 'Selecione a data desejada.' },
  boolean: { type: 'boolean', label: 'Confirmação', required: false, helpText: 'Verdadeiro / Falso' },
};

const typeLabels: Record<FieldType, string> = {
  text: 'Input',
  textarea: 'Texto longo',
  dropdown: 'Dropdown',
  radio: 'Radio button',
  date: 'Data',
  boolean: 'Boolean',
};

const quickTemplates: { name: string; fields: FormField[] }[] = [
  {
    name: 'Template Ginástica Laboral',
    fields: [
      { id: 't1', type: 'text', label: 'Nome do colaborador', placeholder: 'Digite o nome', required: true },
      { id: 't2', type: 'dropdown', label: 'Turno', required: true, options: ['Turno A', 'Turno B', 'Turno C'] },
      { id: 't3', type: 'boolean', label: 'Participou da sessão?', required: true },
      { id: 't4', type: 'radio', label: 'Nível de dor atual', required: true, options: ['Sem dor', 'Leve', 'Moderada', 'Alta'] },
    ],
  },
  {
    name: 'Template Embrião NR1',
    fields: [
      { id: 't5', type: 'boolean', label: 'Você sentiu ansiedade nesta semana?', required: true },
      { id: 't6', type: 'boolean', label: 'Está em acompanhamento terapêutico?', required: false },
      { id: 't7', type: 'radio', label: 'Carga mental percebida', required: true, options: ['Baixa', 'Média', 'Alta'] },
      { id: 't8', type: 'textarea', label: 'Observações adicionais', required: false, placeholder: 'Opcional' },
    ],
  },
];

const getInitialState = (): PersistedFormState => {
  const fallbackState: PersistedFormState = {
    formName: 'Formulário de Avaliação Psicossocial',
    description: 'Questionário detalhado para coleta de evidências e ações preventivas.',
    successMessage: 'Obrigado! Suas respostas foram enviadas com sucesso.',
    fields: defaultFields,
    publicSlug: DEFAULT_PUBLIC_SLUG,
  };

  if (typeof window === 'undefined') {
    return fallbackState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error('no persisted form state');
    const parsed = JSON.parse(raw) as Partial<PersistedFormState>;

    return {
      formName: typeof parsed.formName === 'string' && parsed.formName.trim() ? parsed.formName : fallbackState.formName,
      description: typeof parsed.description === 'string' ? parsed.description : fallbackState.description,
      successMessage: typeof parsed.successMessage === 'string' ? parsed.successMessage : fallbackState.successMessage,
      fields: Array.isArray(parsed.fields) && parsed.fields.length > 0 ? parsed.fields : fallbackState.fields,
      publicSlug: typeof parsed.publicSlug === 'string' && parsed.publicSlug.trim() ? parsed.publicSlug : fallbackState.publicSlug,
    };
  } catch {
    return fallbackState;
  }
};

const FormsCenter: React.FC = () => {
  const initialState = React.useMemo(() => getInitialState(), []);

  const [formName, setFormName] = React.useState(initialState.formName);
  const [description, setDescription] = React.useState(initialState.description);
  const [successMessage, setSuccessMessage] = React.useState(initialState.successMessage);
  const [publicSlug, setPublicSlug] = React.useState(initialState.publicSlug);
  const [copied, setCopied] = React.useState(false);
  const [importError, setImportError] = React.useState<string | null>(null);
  const [fields, setFields] = React.useState<FormField[]>(initialState.fields);

  const publicLink = `https://forms.nr01master.com/${publicSlug}`;

  React.useEffect(() => {
    const state: PersistedFormState = { formName, description, successMessage, fields, publicSlug };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [formName, description, successMessage, fields, publicSlug]);

  const addField = (type: FieldType) => {
    const template = fieldTemplates[type];
    setFields(prev => [
      ...prev,
      {
        ...template,
        id: `f${Date.now()}`,
      },
    ]);
  };

  const applyQuickTemplate = (name: string) => {
    const template = quickTemplates.find(item => item.name === name);
    if (!template) return;
    setFields(template.fields.map((field, idx) => ({ ...field, id: `qt-${Date.now()}-${idx}` })));
  };

  const updateField = (id: string, patch: Partial<FormField>) => {
    setFields(prev => prev.map(field => (field.id === id ? { ...field, ...patch } : field)));
  };

  const deleteField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
  };

  const updateOption = (fieldId: string, idx: number, value: string) => {
    setFields(prev => prev.map(field => {
      if (field.id !== fieldId || !field.options) return field;
      const nextOptions = [...field.options];
      nextOptions[idx] = value;
      return { ...field, options: nextOptions };
    }));
  };

  const addOption = (fieldId: string) => {
    setFields(prev => prev.map(field => {
      if (field.id !== fieldId) return field;
      return { ...field, options: [...(field.options || []), `Opção ${(field.options?.length || 0) + 1}`] };
    }));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicLink);
      setCopied(true);
      setImportError(null);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const exportJson = () => {
    const payload: PersistedFormState = { formName, description, successMessage, fields, publicSlug };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formName.toLowerCase().replace(/\s+/g, '-') || 'formulario'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as Partial<PersistedFormState>;
        setFormName(parsed.formName || 'Formulário importado');
        setDescription(parsed.description || 'Descrição importada');
        setSuccessMessage(parsed.successMessage || 'Obrigado!');
        const importedFields = Array.isArray(parsed.fields) ? parsed.fields : [];
        if (!importedFields.length) {
          throw new Error('invalid fields');
        }
        setFields(importedFields.map((f, idx) => ({ ...f, id: f.id || `imp-${Date.now()}-${idx}` })));
        if (typeof parsed.publicSlug === 'string' && parsed.publicSlug.trim()) {
          setPublicSlug(parsed.publicSlug);
        }
        setImportError(null);
      } catch {
        setImportError('Arquivo inválido. Verifique o JSON e tente novamente.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetForm = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    const fallback = getInitialState();
    setFormName(fallback.formName);
    setDescription(fallback.description);
    setSuccessMessage(fallback.successMessage);
    setFields(fallback.fields);
    setPublicSlug(DEFAULT_PUBLIC_SLUG);
    setImportError(null);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 overflow-y-auto h-full">
      <div className="bg-white rounded-2xl border border-slate-200 p-5 md:p-7 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-500 font-bold">Novo módulo</p>
            <h2 className="text-2xl font-bold text-slate-900">Central de Formulários Externos</h2>
            <p className="text-sm text-slate-500 mt-1">Crie formulários completos com input, dropdown, radio, data, boolean e compartilhamento externo.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 flex items-center gap-2">
              <Save size={16} /> Salvar rascunho
            </button>
            <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2">
              <ExternalLink size={16} /> Publicar formulário
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-6">
        <section className="2xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Nome do formulário</label>
              <input value={formName} onChange={(e) => setFormName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Descrição</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-3 bg-slate-50 flex flex-wrap gap-2">
            {quickTemplates.map(item => (
              <button key={item.name} onClick={() => applyQuickTemplate(item.name)} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:border-indigo-300 hover:bg-indigo-50">
                Usar {item.name}
              </button>
            ))}
            <button onClick={exportJson} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1"><Download size={12} /> Exportar JSON</button>
            <label className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer">
              <Upload size={12} /> Importar JSON
              <input type="file" accept="application/json" className="hidden" onChange={importJson} />
            </label>
            <button onClick={resetForm} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1"><RotateCcw size={12} /> Restaurar</button>
          </div>

          {importError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 font-medium">
              {importError}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Adicionar novo campo</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {(['text', 'textarea', 'dropdown', 'radio', 'date', 'boolean'] as FieldType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => addField(type)}
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> {typeLabels[type]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <article key={field.id} className="border border-slate-200 rounded-2xl p-4 md:p-5 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">Campo {index + 1} · {typeLabels[field.type]}</p>
                  <button onClick={() => deleteField(field.id)} className="text-rose-600 hover:text-rose-700 text-sm font-semibold flex items-center gap-1">
                    <Trash2 size={14} /> Remover
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Título da pergunta</label>
                    <input value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                  </div>

                  {(field.type === 'text' || field.type === 'textarea') && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600">Placeholder</label>
                      <input value={field.placeholder || ''} onChange={(e) => updateField(field.id, { placeholder: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-600">Texto de ajuda</label>
                    <input value={field.helpText || ''} onChange={(e) => updateField(field.id, { helpText: e.target.value })} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                  </div>

                  {(field.type === 'dropdown' || field.type === 'radio') && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold text-slate-600">Opções</label>
                      <div className="mt-2 space-y-2">
                        {(field.options || []).map((option, optionIndex) => (
                          <input key={optionIndex} value={option} onChange={(e) => updateOption(field.id, optionIndex, e.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                        ))}
                        <button onClick={() => addOption(field.id)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                          <Plus size={14} /> Adicionar opção
                        </button>
                      </div>
                    </div>
                  )}

                  <label className="md:col-span-2 inline-flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })} className="rounded border-slate-300" />
                    Campo obrigatório
                  </label>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 md:p-6 space-y-5 h-fit">
          <div>
            <p className="text-sm font-semibold text-slate-800">Publicação e link externo</p>
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs text-slate-500 mb-1">URL pública</p>
              <p className="text-xs text-slate-800 break-all">{publicLink}</p>
              <button onClick={copyLink} className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Copy size={13} /> {copied ? 'Link copiado!' : 'Copiar link'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Mensagem de sucesso</label>
            <textarea rows={3} value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          </div>

          <div className="border-t border-slate-200 pt-4">
            <p className="text-sm font-semibold text-slate-800 mb-3">Pré-visualização do formulário</p>
            <div className="space-y-3">
              {fields.map((field) => (
                <div key={`${field.id}-preview`} className="rounded-xl border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-800">{field.label} {field.required && <span className="text-rose-500">*</span>}</p>
                  {field.helpText && <p className="text-xs text-slate-500 mb-2">{field.helpText}</p>}

                  {field.type === 'text' && <div className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-400">{field.placeholder || 'Resposta curta'}</div>}
                  {field.type === 'textarea' && <div className="rounded-lg border border-slate-300 px-3 py-3 text-xs text-slate-400">{field.placeholder || 'Resposta longa'}</div>}
                  {field.type === 'dropdown' && (
                    <div className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-400 flex justify-between items-center">Selecione <ChevronDownSquare size={14} /></div>
                  )}
                  {field.type === 'radio' && (
                    <div className="space-y-1 text-xs text-slate-600">
                      {(field.options || []).map((option, idx) => (
                        <p key={idx} className="flex items-center gap-1"><Dot size={14} /> {option}</p>
                      ))}
                    </div>
                  )}
                  {field.type === 'date' && <div className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-400">dd/mm/aaaa</div>}
                  {field.type === 'boolean' && <div className="flex gap-2 text-xs"><span className="px-2 py-1 rounded-lg border border-slate-300">Sim</span><span className="px-2 py-1 rounded-lg border border-slate-300">Não</span></div>}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="rounded-xl border border-slate-200 p-2 flex items-center gap-2"><Type size={14} /> Inputs</div>
            <div className="rounded-xl border border-slate-200 p-2 flex items-center gap-2"><ListChecks size={14} /> Dropdown</div>
            <div className="rounded-xl border border-slate-200 p-2 flex items-center gap-2"><CalendarDays size={14} /> Data</div>
            <div className="rounded-xl border border-slate-200 p-2 flex items-center gap-2"><ToggleRight size={14} /> Boolean</div>
            <div className="col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2 flex items-center gap-2 text-emerald-700"><CheckCircle2 size={14} /> Responsivo para desktop e mobile</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FormsCenter;
