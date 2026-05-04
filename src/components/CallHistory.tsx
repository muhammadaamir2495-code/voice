import { PhoneIncoming, PhoneOutgoing, PhoneMissed, Info, MoreVertical } from 'lucide-react';
import { CallRecord } from '../types';
import { mockCalls } from '../utils/mockData';

interface CallHistoryProps {
  onSelectCall: (call: CallRecord) => void;
}

const CallHistory = ({ onSelectCall }: CallHistoryProps) => {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-20">
      <div className="max-w-3xl mx-auto py-6">
        <h2 className="text-xs font-semibold text-google-gray dark:text-gray-400 uppercase tracking-wider mb-4 px-2">
          Recent Calls
        </h2>
        
        <div className="space-y-1">
          {mockCalls.map((call) => (
            <div
              key={call.id}
              onClick={() => onSelectCall(call)}
              className="flex items-center p-3 rounded-lg hover:bg-google-light-gray dark:hover:bg-gray-800 cursor-pointer group transition-colors"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center mr-4",
                call.type === 'missed' ? "bg-red-50 dark:bg-red-900/10" : "bg-blue-50 dark:bg-blue-900/10"
              )}>
                {call.type === 'incoming' && <PhoneIncoming className="w-5 h-5 text-google-blue" />}
                {call.type === 'outgoing' && <PhoneOutgoing className="w-5 h-5 text-google-blue" />}
                {call.type === 'missed' && <PhoneMissed className="w-5 h-5 text-red-500" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-medium truncate",
                  call.type === 'missed' ? "text-red-500" : "text-[#202124] dark:text-[#e8eaed]"
                )}>
                  {call.name || call.number}
                </p>
                <div className="flex items-center text-xs text-google-gray dark:text-gray-500">
                  <span className="truncate">{call.number}</span>
                  <span className="mx-1">•</span>
                  <span>{call.timestamp}</span>
                  {call.duration && (
                    <>
                      <span className="mx-1">•</span>
                      <span>{call.duration}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700">
                  <Info className="w-5 h-5" />
                </button>
                <button className="p-2 text-google-gray hover:text-google-blue rounded-full hover:bg-white dark:hover:bg-gray-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default CallHistory;
