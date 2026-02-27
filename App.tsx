
import React, { useState } from 'react';
import { MOCK_USERS, MOCK_TENANTS } from './constants';
import { User, Tenant } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import ActionPlan from './components/ActionPlan';
import PsychosocialModule from './components/PsychosocialModule';
import Reports from './components/Reports';
import UsersModule from './components/UsersModule';
import UnitsModule from './components/UnitsModule';
import AuditReadiness from './components/AuditReadiness';
import ComplianceTimeline from './components/ComplianceTimeline';
import FormsCenter from './components/FormsCenter';
import OperationsHub from './components/OperationsHub';
import { AppDataProvider } from './appData';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(MOCK_TENANTS[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [vision, setVision] = useState<'tech' | 'exec'>('tech');

  const logout = () => {
    setCurrentUser(null);
    setCurrentTenant(null);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    const tenant = MOCK_TENANTS.find(t => t.id === user.tenantId) || null;
    setCurrentTenant(tenant);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-indigo-600 mb-2">NR01-Master</h1>
            <p className="text-slate-500">Selecione um usuário para demonstração</p>
          </div>
          <div className="space-y-4">
            {MOCK_USERS.map(u => (
              <button
                key={u.id}
                onClick={() => handleLogin(u)}
                className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
              >
                <div className="text-left">
                  <p className="font-semibold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">{u.role}</p>
                </div>
                <div className="text-indigo-600 font-medium group-hover:translate-x-1 transition-transform">Entrar →</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard vision={vision} />;
      case 'inventory': return <Inventory vision={vision} />;
      case 'actions': return <ActionPlan />;
      case 'psychosocial': return <PsychosocialModule vision={vision} />;
      case 'reports': return <Reports />;
      case 'users': return <UsersModule />;
      case 'units': return <UnitsModule />;
      case 'audit': return <AuditReadiness />;
      case 'timeline': return <ComplianceTimeline />;
      case 'forms': return <FormsCenter />;
      case 'operations': return <OperationsHub />;
      default: return <div className="p-10 text-center text-slate-400">Em desenvolvimento: {activeTab}</div>;
    }
  };

  return (
    <AppDataProvider onNavigate={setActiveTab}>
      <Layout 
        currentUser={currentUser} 
        currentTenant={currentTenant} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onLogout={logout}
        vision={vision}
        setVision={setVision}
      >
        {renderContent()}
      </Layout>
    </AppDataProvider>
  );
};

export default App;


