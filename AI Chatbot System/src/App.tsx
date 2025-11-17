import { useState, useEffect } from 'react';
import { ChatWidget } from './components/ChatWidget';
import { AdminPanel } from './components/AdminPanel';
import { AdminLogin } from './components/AdminLogin';

type View = 'chat' | 'admin-login' | 'admin-panel';

export default function App() {
  const [view, setView] = useState<View>('chat');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem('adminAuthenticated');
    if (adminAuth === 'true') {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('adminAuthenticated', 'true');
    setView('admin-panel');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    setView('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Navigation Bar */}
      <nav className="relative backdrop-blur-md bg-white/80 shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur opacity-40 animate-pulse-glow"></div>
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Chatbot RAG System
                </div>
                <div className="text-xs text-slate-500">Powered by Vector Search</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView('chat')}
                className={`px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  view === 'chat'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50'
                    : 'text-slate-600 hover:bg-white/50 backdrop-blur-sm'
                }`}
              >
                💬 Chat Widget
              </button>
              {isAdminAuthenticated ? (
                <>
                  <button
                    onClick={() => setView('admin-panel')}
                    className={`px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      view === 'admin-panel'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                        : 'text-slate-600 hover:bg-white/50 backdrop-blur-sm'
                    }`}
                  >
                    ⚙️ Admin Panel
                  </button>
                  <button
                    onClick={handleAdminLogout}
                    className="px-5 py-2.5 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    🚪 Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setView('admin-login')}
                  className={`px-5 py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    view === 'admin-login'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'text-slate-600 hover:bg-white/50 backdrop-blur-sm'
                  }`}
                >
                  🔐 Admin Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        {view === 'chat' && <ChatWidget />}
        {view === 'admin-login' && !isAdminAuthenticated && (
          <AdminLogin onLogin={handleAdminLogin} />
        )}
        {view === 'admin-panel' && isAdminAuthenticated && (
          <AdminPanel />
        )}
      </main>
    </div>
  );
}