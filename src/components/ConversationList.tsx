import { Search } from 'lucide-react';
import { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ConversationList = ({ 
  conversations, 
  selectedId, 
  onSelect, 
  searchQuery, 
  setSearchQuery 
}: ConversationListProps) => {
  const filtered = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.number.includes(searchQuery)
  );

  return (
    <div className="w-full lg:w-80 h-full border-r border-google-border dark:border-gray-700 flex flex-col bg-white dark:bg-[#1a1c1e]">
      <div className="p-4 border-b border-google-border dark:border-gray-700">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-google-gray group-focus-within:text-google-blue" />
          </div>
          <input
            type="text"
            className="block w-full pl-9 pr-3 py-2 bg-google-light-gray dark:bg-gray-800 border-none rounded-lg text-sm placeholder-google-gray dark:placeholder-gray-500 focus:ring-1 focus:ring-google-blue focus:bg-white dark:focus:bg-gray-700 transition-all"
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`w-full text-left p-4 flex items-start space-x-3 hover:bg-google-light-gray dark:hover:bg-gray-800 transition-colors relative ${
              selectedId === conversation.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-google-blue flex-shrink-0 flex items-center justify-center text-white font-medium">
              {conversation.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-bold' : 'font-medium'} text-[#202124] dark:text-[#e8eaed]`}>
                  {conversation.name}
                </h3>
                <span className="text-[10px] text-google-gray dark:text-gray-500 flex-shrink-0 ml-2">
                  {conversation.timestamp}
                </span>
              </div>
              <p className={`text-xs truncate ${conversation.unreadCount > 0 ? 'text-black dark:text-white font-semibold' : 'text-google-gray dark:text-gray-500'}`}>
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unreadCount > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-google-blue rounded-full" />
            )}
            {selectedId === conversation.id && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-google-blue" />
            )}
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="p-8 text-center text-google-gray dark:text-gray-500 text-sm italic">
            No conversations found
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
