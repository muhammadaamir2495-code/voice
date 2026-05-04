import { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Ban, 
  Search, 
  Trash2, 
  MessageSquare, 
  Phone, 
  Voicemail,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { SpamBlockedItem } from '../types';
import { mockSpamBlockedItems as initialItems } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const SpamPage = () => {
  const [items, setItems] = useState<SpamBlockedItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<'spam' | 'blocked'>('spam');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesTab = item.type === activeTab;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.number.includes(searchQuery);
      return matchesTab && matchesSearch;
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [items, activeTab, searchQuery]);

  const handleAction = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'voicemail': return <Voicemail className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  const spamCount = items.filter(i => i.type === 'spam').length;
  const blockedCount = items.filter(i => i.type === 'blocked').length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] overflow-hidden">
      {/* Header */}
      <div className="p-4 md:px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed]">Spam & Blocked</h1>
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-google-gray group-focus-within:text-google-blue" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-google-light-gray dark:bg-gray-800 placeholder-google-gray dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-google-blue sm:text-sm transition-all shadow-sm"
                placeholder={`Search ${activeTab} items`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-google-border dark:border-gray-700">
          <button
            onClick={() => setActiveTab('spam')}
            className={`px-6 py-2 text-sm font-medium transition-colors relative flex items-center ${
              activeTab === 'spam' ? 'text-google-blue' : 'text-google-gray dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Spam ({spamCount})
            {activeTab === 'spam' && (
              <motion.div layoutId="spamTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-6 py-2 text-sm font-medium transition-colors relative flex items-center ${
              activeTab === 'blocked' ? 'text-google-blue' : 'text-google-gray dark:text-gray-400 hover:text-black dark:hover:text-white'
            }`}
          >
            Blocked ({blockedCount})
            {activeTab === 'blocked' && (
              <motion.div layoutId="spamTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue" />
            )}
          </button>
        </div>
      </div>

      {/* List Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto space-y-1">
          <AnimatePresence initial={false}>
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center p-4 rounded-lg hover:bg-google-light-gray/50 dark:hover:bg-gray-800/50 cursor-pointer group transition-all"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                  item.type === 'spam' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-500' : 'bg-red-50 dark:bg-red-900/10 text-red-500'
                }`}>
                  {item.type === 'spam' ? <ShieldAlert className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-[#202124] dark:text-[#e8eaed] truncate">
                      {item.name || item.number}
                    </span>
                    <span className="text-[10px] text-google-gray dark:text-gray-500 font-medium ml-4">
                      {formatTime(item.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-google-gray dark:text-gray-500">
                    <span className="mr-2">{getIcon(item.activityType)}</span>
                    <span className="truncate">{item.preview}</span>
                  </div>
                </div>

                <div className="flex items-center ml-4 space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleAction(item.id)}
                    className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    title={item.type === 'spam' ? "Not spam" : "Unblock"}
                  >
                    {item.type === 'spam' ? <CheckCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => handleAction(item.id)}
                    className="p-2 text-google-gray hover:text-red-500 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    title="Delete permanently"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-google-gray dark:text-gray-500 text-center">
              <div className="w-16 h-16 mb-4 opacity-10">
                {activeTab === 'spam' ? <ShieldAlert className="w-full h-full" /> : <Ban className="w-full h-full" />}
              </div>
              <p className="text-lg font-medium">No {activeTab} items</p>
              <p className="text-sm mt-1 max-w-xs">
                {activeTab === 'spam' 
                  ? "Items that look suspicious will appear here." 
                  : "Numbers you block will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpamPage;
