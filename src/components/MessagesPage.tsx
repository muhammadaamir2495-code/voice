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

  const handleSelectConversation = (id: string) => {
    setSelectedId(id);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === id ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full">
      <ConversationList 
        conversations={conversations}
        selectedId={selectedId}
        onSelect={handleSelectConversation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <ChatWindow 
        conversation={selectedConversation}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default MessagesPage;
