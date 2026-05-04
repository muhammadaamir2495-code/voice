import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dialpad from './components/Dialpad';
import CallsPage from './components/CallsPage';
import MessagesPage from './components/MessagesPage';
import VoicemailPage from './components/VoicemailPage';
import ArchivePage from './components/ArchivePage';
import SpamPage from './components/SpamPage';
import SettingsPage from './components/SettingsPage';
import AudioPage from './components/AudioPage';
import HelpModal from './components/HelpModal';
import { TabType } from './types';
import { Plus, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calls');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentNumber, setCurrentNumber] = useState('');
  const [isDialerOpen, setIsDialerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [callingState, setCallingState] = useState<'idle' | 'calling' | 'connected'>('idle');

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleDial = (num: string) => {
    setCurrentNumber((prev: string) => prev + num);
  };

  const handleDelete = () => {
    setCurrentNumber((prev: string) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setCurrentNumber('');
  };

  const handleCall = (number: string) => {
    if (!number) return;
    setCallingState('calling');
    setTimeout(() => {
      setCallingState('connected');
      setTimeout(() => {
        setCallingState('idle');
        setIsDialerOpen(false);
        setCurrentNumber('');
      }, 3000);
    }, 1500);
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#1a1c1e] transition-colors overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Header 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
        onHelpClick={() => setIsHelpOpen(true)}
      />
        
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {activeTab === 'calls' && (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              {/* Main Calls Area */}
              <div className="flex-1 overflow-hidden">
                <CallsPage onRedial={(number) => {
                  setCurrentNumber(number);
                  setIsDialerOpen(true);
                }} />
              </div>

              {/* Dialer Panel (Desktop) */}
              <div className="hidden md:flex w-96 border-l border-google-border dark:border-gray-700 bg-white dark:bg-[#1a1c1e] flex-col overflow-y-auto">
                <Dialpad 
                  currentNumber={currentNumber} 
                  onDial={handleDial} 
                  onDelete={handleDelete}
                  onClear={handleClear}
                  onCall={handleCall}
                />
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <MessagesPage />
          )}

          {activeTab === 'voicemail' && (
            <VoicemailPage />
          )}

          {activeTab === 'archive' && (
            <ArchivePage />
          )}

          {activeTab === 'spam' && (
            <SpamPage />
          )}

          {activeTab === 'settings' && (
            <SettingsPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          )}

          {activeTab === 'audio' && (
            <AudioPage />
          )}

          {/* Floating Action Button (Mobile Only / Toggle) */}
          <div className="md:hidden fixed bottom-6 right-6 z-20">
            <button
              onClick={() => setIsDialerOpen(true)}
              className="w-14 h-14 bg-google-blue hover:bg-google-blue-hover text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            >
              <Phone className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Dialer Modal */}
          <AnimatePresence>
            {isDialerOpen && (
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-50 md:hidden bg-white dark:bg-[#1a1c1e] flex flex-col"
              >
                <div className="p-4 flex justify-end">
                  <button 
                    onClick={() => setIsDialerOpen(false)}
                    className="p-2 text-google-gray hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full"
                  >
                    <Plus className="w-8 h-8 rotate-45" />
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                   <Dialpad 
                    currentNumber={currentNumber} 
                    onDial={handleDial} 
                    onDelete={handleDelete}
                    onClear={handleClear}
                    onCall={handleCall}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call Overlay */}
          <AnimatePresence>
            {callingState !== 'idle' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-md flex items-center justify-center p-6 text-white"
              >
                <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-[#1a1c1e] text-[#202124] dark:text-[#e8eaed] rounded-[3rem] p-12 shadow-2xl max-w-sm w-full mx-auto text-center border border-google-border dark:border-gray-800"
                >
                  <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 bg-google-blue rounded-full animate-ping opacity-20" />
                    <div className="absolute -inset-4 bg-google-blue rounded-full animate-pulse opacity-10" />
                    <div className="relative w-full h-full bg-google-blue rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                      <Phone className="w-12 h-12 text-white fill-current" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-2 tracking-tight">
                    {currentNumber || "Unknown"}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 mb-12">
                    <div className={`w-2 h-2 rounded-full ${callingState === 'connected' ? 'bg-green-500' : 'bg-google-blue animate-bounce'}`} />
                    <p className="text-google-gray dark:text-gray-400 font-medium uppercase tracking-widest text-xs">
                      {callingState === 'calling' ? 'Connecting...' : 'Active Call'}
                    </p>
                  </div>
                  
                  <div className="flex justify-center space-x-6">
                    <button
                      onClick={() => setCallingState('idle')}
                      className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-xl shadow-red-500/40 active:scale-95 group"
                    >
                      <Phone className="w-8 h-8 rotate-[135deg] fill-current group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
