import { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, X, Loader2 } from 'lucide-react';
import { BackendAPI } from '../lib/backend';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [needsHuman, setNeedsHuman] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load welcome message on mount
    const loadSettings = async () => {
      const settings = await BackendAPI.fetchSettings();
      setMessages([{
        role: 'assistant',
        content: settings.welcomeMessage,
        timestamp: Date.now()
      }]);
    };
    loadSettings();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading || needsHuman) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Add user message immediately
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Call backend API
      const response = await BackendAPI.chat(userMessage, conversationId);

      if (response.needs_human) {
        setNeedsHuman(true);
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'AI a oprit. Un coleg va prelua conversația.',
          timestamp: Date.now()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.message,
          timestamp: Date.now()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        content: 'A apărut o eroare. Vă rugăm să încercați din nou.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto animate-slide-up">
        <div className="relative">
          {/* Glow effect behind card */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-20"></div>
          
          <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white overflow-hidden">
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
                      <MessageCircle className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <h2 className="flex items-center gap-2">
                      IPTV Assistant
                      <span className="text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">AI Powered</span>
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                      <p className="text-sm text-white/90">Online • Ready to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="h-[500px] p-6 bg-gradient-to-b from-slate-50/50 to-white/50">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div
                      className={`group max-w-[80%] rounded-2xl px-5 py-3.5 transition-all duration-300 hover:scale-[1.02] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                          : message.role === 'system'
                          ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-amber-900 border-2 border-amber-200 shadow-lg shadow-amber-200/50'
                          : 'bg-white text-slate-900 border border-slate-200 shadow-lg'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p
                        className={`text-xs mt-2 flex items-center gap-1 ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : message.role === 'system'
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(message.timestamp).toLocaleTimeString('ro-RO', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-slide-up">
                    <div className="bg-white text-slate-900 rounded-2xl px-5 py-3.5 border border-slate-200 shadow-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin text-purple-600" />
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></span>
                          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                          <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                        </div>
                        <span>Se scrie...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-5 border-t border-slate-200/50 bg-white/80 backdrop-blur-sm">
              {needsHuman ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                    <p className="text-slate-700">
                      Conversația este acum gestionată de un reprezentant uman.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Scrieți mesajul dvs..."
                      disabled={isLoading}
                      className="pr-12 bg-white border-2 border-slate-200 focus:border-purple-400 rounded-xl h-12 shadow-sm transition-all duration-300"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isLoading}
                    className="relative h-12 px-6 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 hover:from-blue-600 hover:via-purple-700 hover:to-pink-700 text-white rounded-xl shadow-lg shadow-purple-500/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        <span>Send</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-purple-50/30 border-t border-slate-200/50">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Conversation ID:</span>
                <span className="font-mono text-slate-900 bg-white/60 px-2 py-0.5 rounded">{conversationId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="mt-8 backdrop-blur-xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 border-2 border-blue-200/50 rounded-2xl p-6 shadow-xl animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-blue-900 mb-3 flex items-center gap-2">
                Demo Instructions
                <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">Try it now!</span>
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">💡</span>
                  <span>Ask questions about IPTV in English or Romanian</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🎯</span>
                  <span>Try: <code className="bg-white/60 px-2 py-0.5 rounded text-xs">"What is IPTV?"</code>, <code className="bg-white/60 px-2 py-0.5 rounded text-xs">"Ce servicii oferă IPTV?"</code>, <code className="bg-white/60 px-2 py-0.5 rounded text-xs">"Tell me about VOD"</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🤝</span>
                  <span>Type <code className="bg-white/60 px-2 py-0.5 rounded text-xs">"refund"</code> or <code className="bg-white/60 px-2 py-0.5 rounded text-xs">"money back"</code> to trigger human escalation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">🔍</span>
                  <span>RAG system searches the knowledge base for relevant information</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}