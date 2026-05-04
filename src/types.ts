export type TabType = 'messages' | 'calls' | 'voicemail' | 'archive' | 'spam' | 'settings' | 'audio';

export interface SpamBlockedItem {
  id: string;
  name: string;
  number: string;
  type: 'spam' | 'blocked';
  activityType: 'message' | 'call' | 'voicemail';
  preview: string;
  timestamp: string;
}

export interface CallRecord {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface Message {
  id: string;
  senderId: 'me' | string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  number: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

export interface Voicemail {
  id: string;
  name: string;
  number: string;
  timestamp: string;
  duration: string;
  audioUrl: string;
  transcript: string;
  isRead: boolean;
}

export interface ArchiveItem {
  id: string;
  name: string;
  number: string;
  type: 'message' | 'call' | 'voicemail';
  preview: string;
  timestamp: string;
}

