import { CallRecord, Conversation, Voicemail, ArchiveItem, SpamBlockedItem } from '../types';

export const mockCalls: CallRecord[] = [
  { id: '1', name: 'John Doe', number: '(650) 555-0123', type: 'incoming', timestamp: '2026-04-15T10:45:00', duration: '5:24' },
  { id: '2', name: 'Jane Smith', number: '(415) 555-9876', type: 'missed', timestamp: '2026-04-15T09:12:00' },
  { id: '3', name: 'Google Workspace', number: '(800) 555-1212', type: 'outgoing', timestamp: '2026-04-14T14:20:00', duration: '1:12' },
  { id: '4', name: 'Spam Risk', number: '(202) 555-0000', type: 'incoming', timestamp: '2026-04-14T11:00:00' },
  { id: '5', name: 'Michael Scott', number: '(570) 555-1234', type: 'outgoing', timestamp: '2026-04-12T16:45:00', duration: '12:05' },
  { id: '6', name: 'Dwight Schrute', number: '(570) 555-5678', type: 'missed', timestamp: '2026-04-12T10:30:00' },
];

export const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'John Doe',
    number: '(650) 555-0123',
    lastMessage: 'Hey, are we still meeting today?',
    timestamp: '10:46 AM',
    unreadCount: 1,
    messages: [
      { id: 'm1', senderId: '1', text: 'Hey, are we still meeting today?', timestamp: '10:46 AM' },
      { id: 'm2', senderId: 'me', text: 'Yes, looking forward to it!', timestamp: '10:48 AM' },
      { id: 'm3', senderId: '1', text: 'Perfect, see you then.', timestamp: '10:50 AM' },
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    number: '(415) 555-9876',
    lastMessage: 'I sent you the documents.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      { id: 'm4', senderId: '2', text: 'I sent you the documents.', timestamp: 'Yesterday' },
    ]
  },
  {
    id: '3',
    name: 'Spam Bot',
    number: '(202) 555-0000',
    lastMessage: 'You won a free prize! Click here...',
    timestamp: 'Monday',
    unreadCount: 0,
    messages: [
      { id: 'm5', senderId: '3', text: 'You won a free prize! Click here...', timestamp: 'Monday' },
    ]
  }
];

export const mockVoicemails: Voicemail[] = [
  {
    id: 'v1',
    name: 'Michael Scott',
    number: '(570) 555-1212',
    timestamp: '2026-04-15T11:20:00',
    duration: '0:45',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    transcript: "Hey, it's Michael. I was just calling to ask if you got that thing I sent you. Also, we're having a party later, so let me know if you can make it.",
    isRead: false
  },
  {
    id: 'v2',
    name: 'Pam Beesly',
    number: '(570) 555-3434',
    timestamp: '2026-04-14T09:15:00',
    duration: '0:12',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    transcript: "Hi, this is Pam from Dunder Mifflin. Just checking in on that order. Thanks!",
    isRead: true
  },
  {
    id: 'v3',
    name: 'Unknown',
    number: '(212) 555-0987',
    timestamp: '2026-04-12T14:50:00',
    duration: '1:05',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    transcript: "Your warranty is about to expire. Please press 1 to speak with a representative immediately.",
    isRead: true
  }
];

export const mockArchivedItems: ArchiveItem[] = [
  {
    id: 'a1',
    name: 'Robert California',
    number: '(212) 555-5555',
    type: 'call',
    preview: 'Missed call',
    timestamp: '2026-04-10T09:00:00'
  },
  {
    id: 'a2',
    name: 'Creed Bratton',
    number: '(570) 555-9999',
    type: 'message',
    preview: 'I dropped it off at the usual spot.',
    timestamp: '2026-04-09T18:45:00'
  },
  {
    id: 'a3',
    name: 'Andy Bernard',
    number: '(607) 555-1122',
    type: 'voicemail',
    preview: 'Voicemail (0:22)',
    timestamp: '2026-04-08T13:20:00'
  }
];

export const mockSpamBlockedItems: SpamBlockedItem[] = [
  {
    id: 's1',
    name: 'IRS Department',
    number: '(800) 829-1040',
    type: 'spam',
    activityType: 'call',
    preview: 'Potential Fraud: Your tax refund is ready.',
    timestamp: '2026-04-15T09:00:00'
  },
  {
    id: 's2',
    name: 'Telemarketer',
    number: '(646) 555-0111',
    type: 'spam',
    activityType: 'message',
    preview: 'Get low interest rates now! Text STOP to opt-out.',
    timestamp: '2026-04-14T11:20:00'
  },
  {
    id: 'b1',
    name: 'Toxic Ex',
    number: '(415) 555-6666',
    type: 'blocked',
    activityType: 'call',
    preview: 'Blocked call',
    timestamp: '2026-04-10T22:15:00'
  },
  {
    id: 'b2',
    name: 'Persistent Salesman',
    number: '(202) 555-8888',
    type: 'blocked',
    activityType: 'voicemail',
    preview: 'Voicemail (0:45)',
    timestamp: '2026-04-05T14:30:00'
  }
];
