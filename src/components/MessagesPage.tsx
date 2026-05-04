import { useState } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import { mockConversations as initialConversations } from '../utils/mockData';
import { Conversation, Message } from '../types';

const MessagesPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(initialConversations[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConversation = conversations.find(c => c.id === selectedId) || null;

  const handleSendMessage = (text: string) => {
    if (!selectedId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations(prev => prev.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          lastMessage: text,
          timestamp: newMessage.timestamp,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
  };

  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    setShowChatOnMobile(true);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full relative">
      <div className={cn(
        "w-full md:w-80 lg:w-96 flex-shrink-0 transition-transform duration-300 md:translate-x-0 h-full",
        showChatOnMobile ? "-translate-x-full md:translate-x-0 hidden md:flex" : "flex"
      )}>
        <ConversationList 
          conversations={conversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      <div className={cn(
        "flex-1 h-full bg-white dark:bg-[#1a1c1e] transition-transform duration-300",
        showChatOnMobile ? "flex" : "hidden md:flex"
      )}>
        <ChatWindow 
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onBack={() => setShowChatOnMobile(false)}
        />
      </div>
    </div>
  );
};

// Simple utility for classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}


export default MessagesPage;
