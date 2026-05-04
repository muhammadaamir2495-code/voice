import { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Settings2, 
  Smartphone, 
  Headphones, 
  Monitor,
  Music,
  Zap,
  FastForward,
  Mic2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AudioPage = () => {
  // Device Lists
  const [inputs, setInputs] = useState<MediaDeviceInfo[]>([]);
  const [outputs, setOutputs] = useState<MediaDeviceInfo[]>([]);
  const [permission, setPermission] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Persistence Loading
  const loadSetting = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  };

  // State
  const [settings, setSettings] = useState(() => loadSetting('audio_settings', {
    selectedMic: 'default',
    selectedSpeaker: 'default',
    muteMic: false,
    echoCancellation: true,
    ringtone: 'Classic',
    ringtoneVolume: 80,
    incomingCallSound: true,
    messageSound: true,
    voicemailSound: true,
    playbackSpeed: 1,
    autoPlayVoicemail: false,
    rememberPosition: true,
  }));

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Enumerate Devices
  const getDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      setInputs(devices.filter(d => d.kind === 'audioinput'));
      setOutputs(devices.filter(d => d.kind === 'audiooutput'));
      
      // Check labels to see if we have permission
      if (devices.some(d => d.label !== '')) {
        setPermission('granted');
      }
    } catch (err) {
      console.error('Error enumerating devices:', err);
    }
  };

  const requestPermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermission('granted');
      getDevices();
    } catch (err) {
      setPermission('denied');
    }
  };

  useEffect(() => {
    getDevices();
    
    // Listen for device changes
    navigator.mediaDevices.ondevicechange = getDevices;
    return () => {
      navigator.mediaDevices.ondevicechange = null;
    };
  }, []);

  // Save Settings
  useEffect(() => {
    localStorage.setItem('audio_settings', JSON.stringify(settings));
  }, [settings]);

  // Audio Preview Logic
  const toggleRingtonePreview = () => {
    if (isPlayingPreview) {
      audioPreviewRef.current?.pause();
      setIsPlayingPreview(false);
    } else {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.volume = settings.ringtoneVolume / 100;
        audioPreviewRef.current.play();
        setIsPlayingPreview(true);
      }
    }
  };

  const handleVolumeChange = (v: number) => {
    setSettings({ ...settings, ringtoneVolume: v });
    if (audioPreviewRef.current) {
      audioPreviewRef.current.volume = v / 100;
    }
  };

  const Toggle = ({ enabled, onChange, label, description, icon: Icon }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-google-border dark:border-gray-800 last:border-0">
      <div className="flex items-center space-x-3 flex-1 pr-4">
        {Icon && <Icon className="w-5 h-5 text-google-gray dark:text-gray-500" />}
        <div>
          <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">{label}</p>
          <p className="text-xs text-google-gray dark:text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
          enabled ? 'bg-google-blue' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] overflow-hidden">
      <audio 
        ref={audioPreviewRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" 
        onEnded={() => setIsPlayingPreview(false)}
      />

      <div className="p-4 md:px-8 pt-6">
        <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed] mb-1">Audio Settings</h1>
        <p className="text-xs text-google-gray dark:text-gray-500 mb-6 font-medium uppercase tracking-wider">Configure your voice and audio experience</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-8 pb-10">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Call Audio Section */}
          <section className="bg-white dark:bg-gray-800/20 rounded-2xl border border-google-border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-google-light-gray dark:bg-gray-800/50 border-b border-google-border dark:border-gray-700 flex items-center space-x-3">
              <Mic2 className="w-5 h-5 text-google-blue" />
              <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed]">Call Audio</h2>
            </div>
            <div className="p-6 space-y-6">
              {permission !== 'granted' ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="w-5 h-5 text-google-blue" />
                    <p className="text-sm text-google-blue font-medium">Allow microphone access to select devices</p>
                  </div>
                  <button 
                    onClick={requestPermission}
                    className="bg-google-blue text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-google-blue-hover transition-colors"
                  >
                    Request Permissions
                  </button>
                </div>
              ) : null}

              {/* Devices Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-google-gray dark:text-gray-500 uppercase tracking-widest mb-2">Microphone</label>
                  <select 
                    value={settings.selectedMic}
                    onChange={e => setSettings({...settings, selectedMic: e.target.value})}
                    className="w-full bg-google-light-gray dark:bg-gray-800 border-none rounded-xl text-sm py-3 px-4 outline-none dark:text-white"
                  >
                    {inputs.length > 0 ? inputs.map(i => (
                      <option key={i.deviceId} value={i.deviceId}>{i.label || `Microphone ${i.deviceId.slice(0,5)}`}</option>
                    )) : <option value="default">Default Device</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-google-gray dark:text-gray-500 uppercase tracking-widest mb-2">Speakers</label>
                  <select 
                    value={settings.selectedSpeaker}
                    onChange={e => setSettings({...settings, selectedSpeaker: e.target.value})}
                    className="w-full bg-google-light-gray dark:bg-gray-800 border-none rounded-xl text-sm py-3 px-4 outline-none dark:text-white"
                  >
                    {outputs.length > 0 ? outputs.map(i => (
                      <option key={i.deviceId} value={i.deviceId}>{i.label || `Speaker ${i.deviceId.slice(0,5)}`}</option>
                    )) : <option value="default">Default Device</option>}
                  </select>
                </div>
              </div>

              {/* Real-time Mute & Echo */}
              <div className="pt-2">
                <Toggle 
                  label="Mute Microphone" 
                  description="Start all calls with your microphone muted by default" 
                  icon={Mic}
                  enabled={settings.muteMic} 
                  onChange={(v: boolean) => setSettings({...settings, muteMic: v})}
                />
                <Toggle 
                  label="Echo Cancellation" 
                  description="Reduce background noise and echo during calls" 
                  icon={Zap}
                  enabled={settings.echoCancellation} 
                  onChange={(v: boolean) => setSettings({...settings, echoCancellation: v})}
                />
              </div>
            </div>
          </section>

          {/* Ringtones & Alerts Section */}
          <section className="bg-white dark:bg-gray-800/20 rounded-2xl border border-google-border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-google-light-gray dark:bg-gray-800/50 border-b border-google-border dark:border-gray-700 flex items-center space-x-3">
              <Music className="w-5 h-5 text-google-blue" />
              <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed]">Ringtones & Alerts</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-8 pb-8 border-b border-google-border dark:border-gray-800">
                <div className="flex-1 max-w-xs">
                  <label className="block text-xs font-bold text-google-gray dark:text-gray-500 uppercase tracking-widest mb-2">Incoming Call Ringtone</label>
                  <div className="flex items-center space-x-2">
                    <select 
                      value={settings.ringtone}
                      onChange={e => setSettings({...settings, ringtone: e.target.value})}
                      className="flex-1 bg-google-light-gray dark:bg-gray-800 border-none rounded-xl text-sm py-2 px-3 outline-none dark:text-white"
                    >
                      <option>Classic</option>
                      <option>Modern</option>
                      <option>Echo</option>
                      <option>Digital</option>
                    </select>
                    <button 
                      onClick={toggleRingtonePreview}
                      className={`p-2 rounded-lg transition-colors ${
                        isPlayingPreview ? 'bg-red-500 text-white' : 'bg-google-blue text-white hover:bg-google-blue-hover '
                      }`}
                    >
                      {isPlayingPreview ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex-1 max-w-xs ml-8">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-google-gray dark:text-gray-500 uppercase tracking-widest">Alert Volume</label>
                    <span className="text-xs font-bold text-google-blue">{settings.ringtoneVolume}%</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <VolumeX className="w-4 h-4 text-google-gray" />
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={settings.ringtoneVolume}
                      onChange={e => handleVolumeChange(parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-google-light-gray dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-google-blue"
                    />
                    <Volume2 className="w-4 h-4 text-google-gray" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <Toggle 
                  label="Call Sound" 
                  description="Incoming call ringtone" 
                  enabled={settings.incomingCallSound} 
                  onChange={(v: boolean) => setSettings({...settings, incomingCallSound: v})}
                />
                <Toggle 
                  label="Message Alert" 
                  description="Sound for new messages" 
                  enabled={settings.messageSound} 
                  onChange={(v: boolean) => setSettings({...settings, messageSound: v})}
                />
                <Toggle 
                  label="Voicemail Alert" 
                  description="Sound for new voicemails" 
                  enabled={settings.voicemailSound} 
                  onChange={(v: boolean) => setSettings({...settings, voicemailSound: v})}
                />
              </div>
            </div>
          </section>

          {/* Voicemail Playback Section */}
          <section className="bg-white dark:bg-gray-800/20 rounded-2xl border border-google-border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-google-light-gray dark:bg-gray-800/50 border-b border-google-border dark:border-gray-700 flex items-center space-x-3">
              <FastForward className="w-5 h-5 text-google-blue" />
              <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed]">Voicemail Playback</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between py-4 border-b border-google-border dark:border-gray-800">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">Default Playback Speed</p>
                  <p className="text-xs text-google-gray dark:text-gray-500">Select how fast you want to hear voicemails</p>
                </div>
                <div className="flex bg-google-light-gray dark:bg-gray-800 rounded-lg p-1">
                  {[1, 1.5, 2].map((speed) => (
                    <button 
                      key={speed}
                      onClick={() => setSettings({...settings, playbackSpeed: speed})}
                      className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                        settings.playbackSpeed === speed ? 'bg-white dark:bg-gray-700 shadow-sm font-bold ' : 'text-google-gray'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
              <Toggle 
                label="Auto-play Voicemail" 
                description="Automatically play voicemail when you open the thread" 
                enabled={settings.autoPlayVoicemail} 
                onChange={(v: boolean) => setSettings({...settings, autoPlayVoicemail: v})}
              />
              <Toggle 
                label="Remember Last Position" 
                description="Pick up where you left off in long voicemails" 
                enabled={settings.rememberPosition} 
                onChange={(v: boolean) => setSettings({...settings, rememberPosition: v})}
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default AudioPage;
