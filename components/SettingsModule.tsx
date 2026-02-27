import React from 'react';
import { CheckCircle2, Globe2, Save, UserCircle2 } from 'lucide-react';
import { UserPreferences, UserProfileSettings } from '../types';

interface SettingsModuleProps {
  profile: UserProfileSettings;
  preferences: UserPreferences;
  onProfileChange: (next: UserProfileSettings) => void;
  onPreferencesChange: (next: UserPreferences) => void;
  onClose: () => void;
}

const languageLabel = {
  'pt-BR': 'Português (Brasil)',
  'en-US': 'English (US)',
  'es-ES': 'Español (ES)',
};

const SettingsModule: React.FC<SettingsModuleProps> = ({
  profile,
  preferences,
  onProfileChange,
  onPreferencesChange,
  onClose,
}) => {
  const [saved, setSaved] = React.useState(false);

  const setProfile = <K extends keyof UserProfileSettings>(k: K, v: UserProfileSettings[K]) => {
    onProfileChange({ ...profile, [k]: v });
    setSaved(false);
  };

  const setPreferences = <K extends keyof UserPreferences>(k: K, v: UserPreferences[K]) => {
    onPreferencesChange({ ...preferences, [k]: v });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/55 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Configurações gerais</h2>
            <p className="text-sm text-slate-500">Meu perfil e preferências de idioma/notificações.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold">Fechar</button>
            <button onClick={handleSave} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold flex items-center gap-2">
              <Save size={14} /> Salvar
            </button>
          </div>
        </div>

        {saved && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700 flex items-center gap-2"><CheckCircle2 size={15}/>Configurações salvas.</div>}

        <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><UserCircle2 size={17}/>Meu perfil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input value={profile.fullName} onChange={(e)=>setProfile('fullName', e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Nome completo"/>
            <input value={profile.email} onChange={(e)=>setProfile('email', e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="E-mail"/>
            <input value={profile.phone} onChange={(e)=>setProfile('phone', e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Telefone"/>
            <input value={profile.roleTitle} onChange={(e)=>setProfile('roleTitle', e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Cargo"/>
            <input value={profile.department} onChange={(e)=>setProfile('department', e.target.value)} className="md:col-span-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Departamento"/>
            <textarea value={profile.bio} onChange={(e)=>setProfile('bio', e.target.value)} rows={3} className="md:col-span-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder="Bio"/>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Globe2 size={17}/>Idioma e preferências</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={preferences.language} onChange={(e)=>setPreferences('language', e.target.value as UserPreferences['language'])} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
              <option value="pt-BR">Português</option><option value="en-US">English</option><option value="es-ES">Español</option>
            </select>
            <select value={preferences.timezone} onChange={(e)=>setPreferences('timezone', e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
              <option value="America/Sao_Paulo">America/Sao_Paulo</option>
              <option value="America/Mexico_City">America/Mexico_City</option>
              <option value="Europe/Madrid">Europe/Madrid</option>
              <option value="UTC">UTC</option>
            </select>
            <select value={preferences.digestFrequency} onChange={(e)=>setPreferences('digestFrequency', e.target.value as UserPreferences['digestFrequency'])} className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm">
              <option value="daily">Diário</option><option value="weekly">Semanal</option><option value="monthly">Mensal</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="inline-flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm"><span>Email alerts</span><input type="checkbox" checked={preferences.emailAlerts} onChange={()=>setPreferences('emailAlerts', !preferences.emailAlerts)} /></label>
            <label className="inline-flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2 text-sm"><span>Push alerts</span><input type="checkbox" checked={preferences.pushAlerts} onChange={()=>setPreferences('pushAlerts', !preferences.pushAlerts)} /></label>
          </div>
          <p className="text-sm text-slate-600">Idioma atual: <strong>{languageLabel[preferences.language]}</strong></p>
        </section>
      </div>
    </div>
  );
};

export default SettingsModule;
