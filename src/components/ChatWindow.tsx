import { useEffect, useRef, useState } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone } from 'lucide-react';
import { Conversation } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatWindowProps {
  conversation: Conversation | null;
  onSendMessage: (text: string) => void;
}

const ChatWindow = ({ conversation, onSendMessage }: ChatWindowProps) => {
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-white dark:bg-[#1a1c1e] text-google-gray dark:text-gray-500">
        <div className="w-16 h-16 bg-google-light-gray dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Send className="w-8 h-8 opacity-20" />
        </div>
        <p className="text-lg">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] relative z-0">
      {/* Header */}
      <header className="h-16 px-6 border-b border-google-border dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-google-blue flex items-center justify-center text-white font-medium">
            {conversation.name[0]}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed] leading-tight">
              {conversation.name}
            </h2>
            <p className="text-xs text-google-gray dark:text-gray-500">
              {conversation.number}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-google-gray hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full transition-colors">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 text-google-gray hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {conversation.messages.map((msg, index) => {
            const isMe = msg.senderId === 'me';
            const showTime = index === 0 || msg.timestamp !== conversation.messages[index-1].timestamp;

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {showTime && (
                  <span className="text-[10px] text-google-gray dark:text-gray-500 mb-1 mx-2 uppercase tracking-tight">
                    {msg.timestamp}
                  </span>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe 
                      ? 'bg-google-blue text-white rounded-tr-none' 
                      : 'bg-google-light-gray dark:bg-gray-800 text-[#202124] dark:text-[#e8eaed] rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-google-border dark:border-gray-700">
        <form 
          onSubmit={handleSend}
          className="flex items-end space-x-2 bg-google-light-gray dark:bg-gray-800 rounded-2xl p-2 focus-within:bg-white dark:focus-within:bg-gray-700 focus-within:ring-1 focus-within:ring-google-blue transition-all"
        >
          <button type="button" className="p-2 text-google-gray hover:text-google-blue rounded-full">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Send a message"
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 resize-none max-h-32 dark:text-white"
          />
          <div className="flex items-center">
            <button type="button" className="p-2 text-google-gray hover:text-google-blue rounded-full">
              <Smile className="w-5 h-5" />
            </button>
            <button 
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-2 rounded-full transition-colors ${
                inputValue.trim() ? 'text-google-blue hover:bg-blue-50 dark:hover:bg-blue-900/20' : 'text-gray-300 dark:text-gray-600'
              }`}
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
