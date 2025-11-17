import { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple demo credentials
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid credentials. Try: admin / admin123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
          
          <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-10 text-white text-center overflow-hidden">
              {/* Animated pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
              </div>
              
              <div className="relative">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur"></div>
                  <div className="relative w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30">
                    <Lock className="w-10 h-10" />
                  </div>
                </div>
                <h2 className="flex items-center justify-center gap-2">
                  Admin Panel
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">🔐 Secure</span>
                </h2>
                <p className="text-sm text-purple-100 mt-2">Sign in to manage chatbot settings</p>
              </div>
            </div>

            {/* Login Form */}
            <div className="p-8 bg-gradient-to-b from-slate-50/50 to-white/50">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <Label htmlFor="username">Username</Label>
                  </div>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    className="border-2 border-slate-200 focus:border-purple-400 rounded-xl bg-white shadow-sm transition-all duration-300 h-12"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="border-2 border-slate-200 focus:border-purple-400 rounded-xl bg-white shadow-sm transition-all duration-300 h-12"
                  />
                </div>

                {error && (
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3 animate-slide-up">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                </Button>
              </form>

              {/* Demo Credentials Info */}
              <div className="mt-6 backdrop-blur-sm bg-gradient-to-r from-slate-50/80 to-purple-50/80 border-2 border-slate-200/50 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-600 mb-3">Demo Credentials:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">Username:</span>
                        <code className="text-sm font-mono text-slate-900 bg-white/60 px-3 py-1 rounded-lg border border-slate-200">admin</code>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-600">Password:</span>
                        <code className="text-sm font-mono text-slate-900 bg-white/60 px-3 py-1 rounded-lg border border-slate-200">admin123</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}