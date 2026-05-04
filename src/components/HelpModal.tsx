import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  User, 
  Bot, 
  Sparkles, 
  Trash2, 
  Mic,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  "How do I make a call?",
  "Fix microphone issue",
  "Block a number",
  "Voicemail not playing",
  "Change audio settings"
];

// Backend Proxy URL (Point to your secure Node.js server)
const BACKEND_URL = "/api/chat";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('help_chat_history');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        text: "Hi! I'm your Voice AI assistant. Tap the mic to speak or type a question.",
        sender: 'ai',
        timestamp: new Date()
      }
    ];
  });
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  // Text-to-Speech Function
  const speak = (text: string) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Clean text from markdown
    const cleanText = text.replace(/\*\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Persist chat
  useEffect(() => {
    localStorage.setItem('help_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await response.json();
      const responseText = data.response || "I'm sorry, I encountered an error. Please try again.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
      speak(responseText); // Speak the AI response
    } catch (err) {
      console.error('AI API Error:', err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearChat = () => {
    window.speechSynthesis?.cancel();
    setMessages([{
      id: 'initial',
      text: "Chat cleared. How can I help you now?",
      sender: 'ai',
      timestamp: new Date()
    }]);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-[#1a1c1e] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-[650px] border border-google-border dark:border-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className={`px-6 py-5 bg-google-blue text-white flex items-center justify-between shrink-0 transition-all ${isListening ? 'animate-pulse' : ''}`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center relative">
                <Sparkles className="w-6 h-6" />
                {isListening && <div className="absolute inset-0 bg-white rounded-xl animate-ping opacity-20" />}
              </div>
              <div>
                <h2 className="text-lg font-bold leading-tight">
                  {isListening ? 'Listening...' : 'Voice Assistant'}
                </h2>
                <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Help Center AI (Gemini Flash)</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                className={`p-2 rounded-full transition-colors ${isVoiceEnabled ? 'bg-white/20' : 'bg-transparent text-white/50'}`}
                title={isVoiceEnabled ? 'Mute AI Voice' : 'Enable AI Voice'}
              >
                {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button 
                onClick={clearChat}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Clear Chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { window.speechSynthesis?.cancel(); onClose(); }}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </header>

          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-[#1a1c1e]"
          >
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-auto mb-1 ${
                    msg.sender === 'user' ? 'ml-2 bg-google-blue text-white shadow-sm' : 'mr-2 bg-white dark:bg-gray-800 border border-google-border dark:border-gray-700 shadow-sm'
                  }`}>
                    {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5 text-google-blue" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-google-blue text-white rounded-br-none' 
                      : 'bg-white dark:bg-gray-800 text-[#202124] dark:text-gray-200 border border-google-border dark:border-gray-700 rounded-bl-none'
                  }`}>
                    {msg.text.split('**').map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part)}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex flex-row items-center">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 border border-google-border dark:border-gray-700 flex items-center justify-center mr-2 shadow-sm">
                    <Bot className="w-5 h-5 text-google-blue" />
                  </div>
                  <div className="px-4 py-3 bg-white dark:bg-gray-800 border border-google-border dark:border-gray-700 rounded-2xl shadow-sm rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-google-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-google-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-google-blue rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-6 py-3 bg-white dark:bg-[#1a1c1e] border-t border-google-border dark:border-gray-700 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <div className="flex space-x-2">
              {QUICK_SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="px-4 py-1.5 rounded-full border border-google-border dark:border-gray-700 text-xs font-semibold text-google-gray dark:text-gray-400 hover:bg-google-blue hover:text-white hover:border-google-blue transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="px-6 py-6 pb-10 bg-white dark:bg-[#1a1c1e] border-t border-google-border dark:border-gray-800">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="relative flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={isListening ? "Listening..." : "Ask a question..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 bg-google-light-gray dark:bg-gray-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-google-blue dark:text-white font-medium"
                />
                <button
                  type="button"
                  onClick={startListening}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                    isListening ? 'bg-red-500 text-white animate-pulse' : 'text-google-gray hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className={`p-4 rounded-2xl transition-all ${
                  input.trim() 
                  ? 'bg-google-blue text-white shadow-lg shadow-blue-500/30 active:scale-95' 
                  : 'bg-google-light-gray text-google-gray cursor-not-allowed opacity-50'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default HelpModal;
