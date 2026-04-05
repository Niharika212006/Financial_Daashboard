import { useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { FinanceProvider, useFinance } from './FinanceContext';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights from './components/Insights';
import { ROLES } from './mockData';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { role, setRole, darkMode, setDarkMode } = useFinance();

  const sidebarBgClass = darkMode ? 'bg-gray-800' : 'bg-gray-900';
  const headerBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-gray-100' : 'text-gray-900';
  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex h-screen ${bgClass}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} ${sidebarBgClass} text-white transition-all duration-300 overflow-hidden flex flex-col`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold">💰 Finance</h2>
          <p className="text-gray-400 text-sm mt-1">Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'transactions', label: 'Transactions', icon: '💳' },
            { id: 'insights', label: 'Insights', icon: '📈' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-700'} p-4 space-y-3`}>
          {/* Role Selector */}
          <div>
            <label className="text-xs text-gray-400 block mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 text-gray-100 border-gray-600' : 'bg-gray-700 text-white border-gray-600'
              }`}
            >
              <option value={ROLES.VIEWER}>👁️ Viewer</option>
              <option value={ROLES.ADMIN}>🔑 Admin</option>
            </select>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition ${
              darkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span className="text-sm">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`${headerBgClass} shadow-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg hover:${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition`}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />} 
              </button>
              <h1 className={`text-2xl font-bold ${textClass} capitalize`}>
                {activeTab === 'dashboard' && '📊 Dashboard'}
                {activeTab === 'transactions' && '💳 Transactions'}
                {activeTab === 'insights' && '📈 Insights'}
              </h1>
            </div>

            {/* Header Right */}
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                role === ROLES.ADMIN
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              } ${darkMode ? 'bg-opacity-20' : ''}`}>
                {role === ROLES.ADMIN ? '🔑 Admin' : '👁️ Viewer'}
              </div>
              <div className="text-2xl">👤</div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}

export default App;