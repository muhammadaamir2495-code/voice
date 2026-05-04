import { Phone, Delete, X, Hash, Asterisk } from 'lucide-react';
import { motion } from 'framer-motion';

interface DialpadProps {
  onDial: (num: string) => void;
  onDelete: () => void;
  onClear: () => void;
  onCall: (number: string) => void;
  currentNumber: string;
}

const Dialpad = ({ onDial, onDelete, onClear, onCall, currentNumber }: DialpadProps) => {
  const buttons = [
    { num: '1', letters: '' },
    { num: '2', letters: 'ABC' },
    { num: '3', letters: 'DEF' },
    { num: '4', letters: 'GHI' },
    { num: '5', letters: 'JKL' },
    { num: '6', letters: 'MNO' },
    { num: '7', letters: 'PQRS' },
    { num: '8', letters: 'TUV' },
    { num: '9', letters: 'WXYZ' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ];

  const playTone = (lowFreq: number, highFreq: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const oscillatorLow = audioCtx.createOscillator();
      const oscillatorHigh = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillatorLow.type = 'sine';
      oscillatorLow.frequency.setValueAtTime(lowFreq, audioCtx.currentTime);
      
      oscillatorHigh.type = 'sine';
      oscillatorHigh.frequency.setValueAtTime(highFreq, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

      oscillatorLow.connect(gainNode);
      oscillatorHigh.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillatorLow.start();
      oscillatorHigh.start();
      oscillatorLow.stop(audioCtx.currentTime + 0.2);
      oscillatorHigh.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio Context not supported');
    }
  };

  const handleKeyPress = (num: string) => {
    const dtmf: Record<string, [number, number]> = {
      '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
      '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
      '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
      '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
    };
    
    if (dtmf[num]) {
      playTone(dtmf[num][0], dtmf[num][1]);
    }
    onDial(num);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/80 dark:bg-[#1a1c1e]/80 backdrop-blur-xl w-full max-w-sm mx-auto animate-fade-in rounded-3xl border border-white/20 shadow-2xl">

      {/* Display */}
      <div className="w-full mb-8 relative flex items-center justify-center min-h-[60px]">
        <input
          type="text"
          value={currentNumber}
          readOnly
          placeholder="Enter a number"
          className="w-full text-3xl font-light text-center bg-transparent border-none outline-none text-[#202124] dark:text-[#e8eaed] placeholder:text-gray-300 dark:placeholder:text-gray-600"
        />
        {currentNumber && (
          <button 
            onClick={onClear}
            className="absolute right-0 p-2 text-google-gray hover:text-red-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {buttons.map((btn) => (
          <motion.button
            key={btn.num}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleKeyPress(btn.num)}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-full hover:bg-google-light-gray dark:hover:bg-gray-800 transition-colors group"
          >
            <span className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed]">
              {btn.num === '*' ? <Asterisk className="w-5 h-5" /> : btn.num === '#' ? <Hash className="w-5 h-5" /> : btn.num}
            </span>
            <span className="text-[10px] text-google-gray dark:text-gray-500 font-medium tracking-widest uppercase">
              {btn.letters}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between w-full px-4">
        <div className="w-12" /> {/* Placeholder for alignment */}
        
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onCall(currentNumber)}
          disabled={!currentNumber}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all",
            currentNumber 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed shadow-none"
          )}
        >
          <Phone className="w-7 h-7 fill-current" />
        </motion.button>

        <button
          onClick={onDelete}
          disabled={!currentNumber}
          className="w-12 h-12 flex items-center justify-center text-google-gray hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Internal utility to merge classes
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export default Dialpad;
