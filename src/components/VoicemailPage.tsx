import { useState, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp,
  Volume2
} from 'lucide-react';
import { Voicemail } from '../types';
import { mockVoicemails as initialVoicemails } from '../utils/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const VoicemailPage = () => {
  const [voicemails, setVoicemails] = useState<Voicemail[]>(initialVoicemails);
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const filteredVoicemails = useMemo(() => {
    return voicemails.filter(v => 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.number.includes(searchQuery)
    ).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [voicemails, searchQuery]);

  const handlePlayToggle = (v: Voicemail) => {
    if (playingId === v.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = v.audioUrl;
        audioRef.current.play();
        setPlayingId(v.id);
        setExpandedId(v.id); // Auto expand when playing
        
        // Mark as read
        setVoicemails(prev => prev.map(item => 
          item.id === v.id ? { ...item, isRead: true } : item
        ));
      }
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingId === id) {
      audioRef.current?.pause();
      setPlayingId(null);
    }
    setVoicemails(prev => prev.filter(v => v.id !== id));
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    setPlayingId(null);
    setCurrentTime(0);
  };

  const formatTimestamp = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] overflow-hidden">
      <audio 
        ref={audioRef} 
        onTimeUpdate={onTimeUpdate} 
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      {/* Header */}
      <div className="p-4 md:px-8 pt-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed]">Voicemail</h1>
          <div className="flex-1 max-w-md mx-4 md:mx-8">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-google-gray group-focus-within:text-google-blue" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border-none rounded-lg leading-5 bg-google-light-gray dark:bg-gray-800 placeholder-google-gray dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-1 focus:ring-google-blue sm:text-sm transition-all shadow-sm"
                placeholder="Search voicemails"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto space-y-1">
          {filteredVoicemails.map((v) => (
            <motion.div
              layout
              key={v.id}
              className={`rounded-lg transition-all ${
                expandedId === v.id 
                ? 'bg-google-light-gray/50 dark:bg-gray-800/50 shadow-sm' 
                : 'hover:bg-google-light-gray dark:hover:bg-gray-800'
              }`}
            >
              <div 
                onClick={() => setExpandedId(expandedId === v.id ? null : v.id)}
                className="flex items-center p-4 cursor-pointer group"
              >
                {/* Play/Pause Minimal */}
                <button
                  onClick={(e) => { e.stopPropagation(); handlePlayToggle(v); }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 transition-all ${
                    playingId === v.id 
                    ? 'bg-google-blue text-white' 
                    : 'bg-blue-50 dark:bg-blue-900/10 text-google-blue group-hover:bg-google-blue group-hover:text-white'
                  }`}
                >
                  {playingId === v.id ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${!v.isRead ? 'font-bold' : 'font-medium'} text-[#202124] dark:text-[#e8eaed]`}>
                      {v.name || v.number}
                    </p>
                    <span className="text-xs text-google-gray dark:text-gray-500 ml-4 flex-shrink-0">
                      {formatTimestamp(v.timestamp)}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-google-gray dark:text-gray-500 mt-0.5">
                    <span>{v.number}</span>
                    <span className="mx-1">•</span>
                    <span>{v.duration}</span>
                  </div>
                </div>

                <div className="flex items-center ml-2 space-x-1 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shrink-0">
                  <button 
                    onClick={(e) => handleDelete(v.id, e)}
                    className="p-2 text-google-gray dark:text-gray-400 hover:text-red-500 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {expandedId === v.id ? <ChevronUp className="w-5 h-5 text-google-gray" /> : <ChevronDown className="w-5 h-5 text-google-gray" />}
                </div>
              </div>


              {/* Expanded Content */}
              <AnimatePresence>
                {expandedId === v.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-16 pb-6 pt-2">
                      {/* Progress Bar */}
                      {playingId === v.id && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-[10px] text-google-gray mb-1">
                            <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                            <span>{v.duration}</span>
                          </div>
                          <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-google-blue transition-all duration-100" 
                              style={{ width: `${(currentTime / duration) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Transcript */}
                      <div className="bg-white dark:bg-[#1a1c1e] p-4 rounded-xl border border-google-border dark:border-gray-700 relative">
                        <p className="text-sm text-[#202124] dark:text-gray-300 leading-relaxed italic">
                          "{v.transcript}"
                        </p>
                        <div className="mt-4 flex items-center space-x-4 border-t border-google-border dark:border-gray-700 pt-3">
                          <button className="flex items-center text-xs text-google-blue hover:underline">
                            <Download className="w-3.5 h-3.5 mr-1" />
                            Download
                          </button>
                          <button className="flex items-center text-xs text-google-blue hover:underline">
                            <Volume2 className="w-3.5 h-3.5 mr-1" />
                            Audio Settings
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filteredVoicemails.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-google-gray dark:text-gray-500">
              <div className="w-16 h-16 mb-4 opacity-10">
                <Play className="w-full h-full" />
              </div>
              <p className="text-lg">No voicemails found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoicemailPage;
