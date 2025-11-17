import { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2 } from 'lucide-react';
import { BackendAPI } from '../lib/backend';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export function AdminPanel() {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [fallbackMessage, setFallbackMessage] = useState('');
  const [toneInstructions, setToneInstructions] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load existing settings
    const loadSettings = async () => {
      const settings = await BackendAPI.fetchSettings();
      setWelcomeMessage(settings.welcomeMessage);
      setFallbackMessage(settings.fallbackMessage);
      setToneInstructions(settings.toneInstructions);
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    const success = await BackendAPI.saveSettings({
      welcomeMessage,
      fallbackMessage,
      toneInstructions
    });
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
          
          <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 p-6 text-white overflow-hidden">
              {/* Animated pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/30 rounded-2xl blur"></div>
                    <div className="relative w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <Settings className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <h2 className="flex items-center gap-2">
                      Admin Panel
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">⚙️ Settings</span>
                    </h2>
                    <p className="text-sm text-purple-100 mt-1">Configure chatbot settings and behavior</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            <div className="p-8 space-y-8 bg-gradient-to-b from-slate-50/50 to-white/50">
              {/* Welcome Message */}
              <div className="space-y-3 group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">👋</span>
                  </div>
                  <Label htmlFor="welcome" className="text-slate-900">Welcome Message</Label>
                </div>
                <p className="text-sm text-slate-600 ml-10">
                  This message is displayed when users first open the chat widget.
                </p>
                <Textarea
                  id="welcome"
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Enter welcome message..."
                  rows={3}
                  className="resize-none ml-10 border-2 border-slate-200 focus:border-purple-400 rounded-xl bg-white shadow-sm transition-all duration-300"
                />
              </div>

              {/* Fallback Message */}
              <div className="space-y-3 group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">⚠️</span>
                  </div>
                  <Label htmlFor="fallback" className="text-slate-900">Fallback Message</Label>
                </div>
                <p className="text-sm text-slate-600 ml-10">
                  This message is shown when the AI can't find relevant information in the knowledge base (low similarity score).
                </p>
                <Textarea
                  id="fallback"
                  value={fallbackMessage}
                  onChange={(e) => setFallbackMessage(e.target.value)}
                  placeholder="Enter fallback message..."
                  rows={3}
                  className="resize-none ml-10 border-2 border-slate-200 focus:border-purple-400 rounded-xl bg-white shadow-sm transition-all duration-300"
                />
              </div>

              {/* Tone Instructions */}
              <div className="space-y-3 group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm">🎨</span>
                  </div>
                  <Label htmlFor="tone" className="text-slate-900">Tone Instructions</Label>
                </div>
                <p className="text-sm text-slate-600 ml-10">
                  Instructions for the AI on how to respond (tone, style, language).
                </p>
                <Textarea
                  id="tone"
                  value={toneInstructions}
                  onChange={(e) => setToneInstructions(e.target.value)}
                  placeholder="Enter tone instructions..."
                  rows={4}
                  className="resize-none ml-10 border-2 border-slate-200 focus:border-purple-400 rounded-xl bg-white shadow-sm transition-all duration-300"
                />
              </div>

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-4 ml-10">
                <Button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-700 hover:via-pink-700 hover:to-purple-800 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 px-6 h-12"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Settings
                </Button>
                {saved && (
                  <div className="flex items-center gap-2 text-green-600 animate-slide-up bg-green-50 px-4 py-2 rounded-xl border-2 border-green-200">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Settings saved successfully!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="border-t-2 border-slate-200/50 bg-gradient-to-r from-slate-50 to-purple-50/30 p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-slate-900 mb-4 flex items-center gap-2">
                    How it works
                    <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">Guide</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-purple-200/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">1</span>
                      </div>
                      <div>
                        <p className="text-slate-900"><strong>Welcome Message</strong></p>
                        <p className="text-slate-600 text-xs mt-1">Displayed when chat widget loads</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-purple-200/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">2</span>
                      </div>
                      <div>
                        <p className="text-slate-900"><strong>Fallback Message</strong></p>
                        <p className="text-slate-600 text-xs mt-1">Used when RAG similarity score {'<'} 15%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-purple-200/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">3</span>
                      </div>
                      <div>
                        <p className="text-slate-900"><strong>Tone Instructions</strong></p>
                        <p className="text-slate-600 text-xs mt-1">Guides AI response style and language</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/60 p-3 rounded-xl border border-purple-200/50">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">4</span>
                      </div>
                      <div>
                        <p className="text-slate-900"><strong>Human Escalation</strong></p>
                        <p className="text-slate-600 text-xs mt-1">Triggered by "refund" or "money back"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Info */}
        <div className="mt-8 backdrop-blur-xl bg-gradient-to-r from-purple-50/80 to-pink-50/80 border-2 border-purple-200/50 rounded-2xl p-6 shadow-xl animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-purple-900 mb-3 flex items-center gap-2">
                RAG System Features
                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full">Technical</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-purple-800">
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">📚</span>
                  <span><strong>Knowledge Base:</strong> IPTV article from Simple Wikipedia</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">✂️</span>
                  <span><strong>Text Chunking:</strong> Article split into semantic chunks (~500 chars)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🔍</span>
                  <span><strong>Vector Search:</strong> Similarity calculation to find relevant chunks</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">💉</span>
                  <span><strong>Context Injection:</strong> Relevant chunk provided to AI for response</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">💾</span>
                  <span><strong>Conversation Storage:</strong> All messages saved with conversation ID</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🤝</span>
                  <span><strong>Human Escalation:</strong> Keyword-based routing to human agents</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}