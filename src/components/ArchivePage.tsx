import { useState, useMemo } from 'react';
import { 
  ArchiveRestore, 
  Search, 
  MessageSquare, 
  Phone, 
  Voicemail as VoicemailIcon,
  Trash2
} from 'lucide-react';
import { ArchiveItem } from '../types';
import { mockArchivedItems as initialArchive } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const ArchivePage = () => {
  const [archive, setArchive] = useState<ArchiveItem[]>(initialArchive);
  const [filter, setFilter] = useState<'all' | 'message' | 'call' | 'voicemail'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArchive = useMemo(() => {
    return archive.filter(item => {
      const matchesFilter = filter === 'all' || item.type === filter;
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.number.includes(searchQuery);
      return matchesFilter && matchesSearch;
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [archive, filter, searchQuery]);

  const filters: { id: typeof filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'message', label: 'Messages' },
    { id: 'call', label: 'Calls' },
    { id: 'voicemail', label: 'Voicemails' },
  ];

  const handleUnarchive = (id: string) => {
    setArchive(prev => prev.filter(item => item.id !== id));
    // In a real app, this would trigger a state change in the parent or a backend call
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-5 h-5" />;
      case 'call': return <Phone className="w-5 h-5" />;
      case 'voicemail': return <VoicemailIcon className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] overflow-hidden">
      {/* Header */}
      <div className="p-4 md:px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed]">Archive</h1>
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-google-gray group-focus-within:text-google-blue" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-google-light-gray dark:bg-gray-800 placeholder-google-gray dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-google-blue sm:text-sm transition-all shadow-sm"
                placeholder="Search archive"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Filters */}
        <div className="flex space-x-1 border-b border-google-border dark:border-gray-700 mb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                filter === f.id 
                  ? 'text-google-blue' 
                  : 'text-google-gray dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {f.label}
              {filter === f.id && (
                <motion.div 
                  layoutId="archiveTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto space-y-1">
          <AnimatePresence initial={false}>
            {filteredArchive.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center p-3 rounded-lg hover:bg-google-light-gray dark:hover:bg-gray-800 cursor-pointer group transition-all"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-google-light-gray dark:bg-gray-800 flex items-center justify-center mr-4 text-google-gray dark:text-gray-400 group-hover:bg-google-blue group-hover:text-white transition-colors">
                  {getTypeIcon(item.type)}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate text-[#202124] dark:text-[#e8eaed]">
                      {item.name || item.number}
                    </p>
                    <span className="text-[10px] text-google-gray dark:text-gray-500 ml-4 flex-shrink-0 uppercase font-medium">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-google-gray dark:text-gray-500 truncate mt-0.5">
                    {item.preview}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center ml-2 space-x-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={() => handleUnarchive(item.id)}
                    className="p-2 text-google-gray dark:text-gray-400 hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    title="Restore"
                  >
                    <ArchiveRestore className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-google-gray dark:text-gray-400 hover:text-red-500 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors hidden sm:block" title="Delete permanently">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>

            ))}
          </AnimatePresence>

          {filteredArchive.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-google-gray dark:text-gray-500 text-center">
              <div className="w-16 h-16 mb-4 opacity-10">
                <ArchiveRestore className="w-full h-full" />
              </div>
              <p className="text-lg font-medium">No archived items</p>
              <p className="text-sm max-w-xs mt-1">
                Items you archive will appear here to keep your main tabs clean.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivePage;
