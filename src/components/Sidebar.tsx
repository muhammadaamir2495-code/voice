import { MessageSquare, Phone, Voicemail, Menu, Archive, ShieldAlert, Settings, Mic2 } from 'lucide-react';
import { TabType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const tabs = [
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
    { id: 'calls', icon: Phone, label: 'Calls' },
    { id: 'voicemail', icon: Voicemail, label: 'Voicemail' },
    { id: 'archive', icon: Archive, label: 'Archive' },
    { id: 'spam', icon: ShieldAlert, label: 'Spam' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'audio', icon: Mic2, label: 'Audio' },
  ];

  return (
    <div className="w-16 md:w-24 lg:w-64 h-full border-r border-google-border dark:border-gray-700 bg-white dark:bg-[#1a1c1e] flex flex-col transition-all duration-300">
      <div className="p-4 mb-4">
        <button className="p-2 hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full transition-colors">
          <Menu className="w-6 h-6 text-google-gray dark:text-gray-400" />
        </button>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={cn(
              "w-full flex items-center p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden mb-1",
              activeTab === tab.id 
                ? "bg-google-blue/10 text-google-blue shadow-[0_0_20px_rgba(26,115,232,0.1)]" 
                : "text-google-gray dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50"
            )}
          >
            <tab.icon className={cn(
              "w-6 h-6 lg:mr-4 shrink-0 transition-transform duration-300 group-hover:scale-110",
              activeTab === tab.id ? "text-google-blue" : "text-google-gray dark:text-gray-400"
            )} />
            <span className="hidden lg:block font-bold text-sm tracking-tight">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div 
                layoutId="sidebar-active"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-google-blue rounded-r-full" 
              />
            )}
          </button>
        ))}
      </nav>

      {/* Credit / Footer info could go here */}
      <div className="p-4 text-center">
        <div className="hidden lg:block text-xs text-google-gray dark:text-gray-500">
          Google Voice Clone
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
