import { useState, useMemo } from 'react';
import { 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  Search, 
  Phone, 
  MessageSquare, 
  Info, 
  MoreVertical 
} from 'lucide-react';
import { CallRecord } from '../types';
import { mockCalls as initialCalls } from '../utils/mockData';
import { motion } from 'framer-motion';

interface CallsPageProps {
  onRedial: (number: string) => void;
}

type FilterType = 'all' | 'missed' | 'incoming' | 'outgoing';

const CallsPage = ({ onRedial }: CallsPageProps) => {
  const [calls] = useState<CallRecord[]>(initialCalls);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalls = useMemo(() => {
    return calls.filter(call => {
      const matchesFilter = filter === 'all' || call.type === filter;
      const matchesSearch = 
        call.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        call.number.includes(searchQuery);
      return matchesFilter && matchesSearch;
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [calls, filter, searchQuery]);

  // Group calls by date
  const groupedCalls = useMemo(() => {
    const groups: { [key: string]: CallRecord[] } = {};
    
    filteredCalls.forEach(call => {
      const date = new Date(call.timestamp);
      const now = new Date();
      let dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      if (date.toDateString() === now.toDateString()) {
        dateString = 'Today';
      } else {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
          dateString = 'Yesterday';
        }
      }

      if (!groups[dateString]) groups[dateString] = [];
      groups[dateString].push(call);
    });

    return groups;
  }, [filteredCalls]);

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'missed', label: 'Missed' },
    { id: 'incoming', label: 'Incoming' },
    { id: 'outgoing', label: 'Outgoing' },
  ];

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] overflow-hidden">
      {/* Header & Search */}
      <div className="p-4 md:px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed]">Calls</h1>
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-google-gray group-focus-within:text-google-blue" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-google-light-gray dark:bg-gray-800 placeholder-google-gray dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-google-blue sm:text-sm transition-all shadow-sm"
                placeholder="Search calls"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Filters */}
        <div className="flex space-x-1 border-b border-google-border dark:border-gray-700">
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
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-google-blue" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Call Log List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          {Object.entries(groupedCalls).map(([date, callsInGroup]) => (
            <div key={date} className="mb-6">
              <h3 className="text-[11px] font-bold text-google-gray dark:text-gray-500 uppercase tracking-widest px-3 mb-2">
                {date}
              </h3>
              <div className="space-y-0.5">
                {callsInGroup.map((call) => (
                  <motion.div
                    layout
                    key={call.id}
                    className="flex items-center p-3 rounded-lg hover:bg-google-light-gray dark:hover:bg-gray-800 cursor-pointer group transition-all"
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                      call.type === 'missed' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-blue-50 dark:bg-blue-900/10'
                    }`}>
                      {call.type === 'incoming' && <PhoneIncoming className="w-5 h-5 text-google-blue" />}
                      {call.type === 'outgoing' && <PhoneOutgoing className="w-5 h-5 text-google-blue" />}
                      {call.type === 'missed' && <PhoneMissed className="w-5 h-5 text-red-500" />}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className={`text-sm font-medium truncate ${call.type === 'missed' ? 'text-red-500' : 'text-[#202124] dark:text-[#e8eaed]'}`}>
                          {call.name || call.number}
                        </p>
                      </div>
                      <div className="flex items-center text-xs text-google-gray dark:text-gray-500 mt-0.5">
                        <span className="truncate">{call.number}</span>
                        <span className="mx-1">•</span>
                        <span>{formatTime(call.timestamp)}</span>
                        {call.duration && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{call.duration}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRedial(call.number); }}
                        className="p-2 text-google-gray hover:text-green-600 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors"
                        title="Call"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors" title="Message">
                        <MessageSquare className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <Info className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedCalls).length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-google-gray dark:text-gray-500">
              <Phone className="w-16 h-16 mb-4 opacity-10" />
              <p className="text-lg">No calls found</p>
              <p className="text-sm">Try adjusting your filters or search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallsPage;
