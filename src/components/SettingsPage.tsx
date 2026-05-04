import { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Settings as SettingsIcon, 
  Moon, 
  Sun, 
  Globe, 
  Clock, 
  ShieldCheck, 
  LogOut,
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsPageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsPage = ({ isDarkMode, toggleDarkMode }: SettingsPageProps) => {
  // Persistence Loading
  const loadSetting = (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  };

  // State
  const [notifications, setNotifications] = useState(() => loadSetting('settings_notifications', {
    incoming: true,
    messages: true,
    voicemail: true,
    sound: true,
    desktop: false,
  }));

  const [preferences, setPreferences] = useState(() => loadSetting('settings_preferences', {
    language: 'English',
    timeFormat: '12h',
    autoDelete: false,
    callBehavior: 'browser',
  }));

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Persistence Writing
  useEffect(() => {
    localStorage.setItem('settings_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('settings_preferences', JSON.stringify(preferences));
  }, [preferences]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.next !== password.confirm) {
      showToast("Passwords don't match!", 'error');
      return;
    }
    if (password.next.length < 6) {
      showToast("Password must be at least 6 characters.", 'error');
      return;
    }
    showToast("Password updated successfully!");
    setPassword({ current: '', next: '', confirm: '' });
  };

  const Toggle = ({ enabled, onChange, label, description }: any) => (
    <div className="flex items-center justify-between py-4 border-b border-google-border dark:border-gray-800 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">{label}</p>
        <p className="text-xs text-google-gray dark:text-gray-500">{description}</p>
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
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1a1c1e] overflow-hidden relative">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 20, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`absolute top-0 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 border ${
              toast.type === 'success' 
              ? 'bg-white dark:bg-gray-900 border-green-500 text-green-600' 
              : 'bg-white dark:bg-gray-900 border-red-500 text-red-600'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-4 md:px-8 pt-6">
        <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed] mb-2">Settings</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 space-y-8">
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          
          {/* Account Section */}
          <section className="bg-white dark:bg-gray-800/20 rounded-2xl border border-google-border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-google-light-gray dark:bg-gray-800/50 border-b border-google-border dark:border-gray-700 flex items-center space-x-3">
              <User className="w-5 h-5 text-google-blue" />
              <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed]">Account</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-google-blue flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-md relative">
                  A
                  <button className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm border border-google-border dark:border-gray-600">
                    <Save className="w-3 h-3 text-google-blue" />
                  </button>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#202124] dark:text-[#e8eaed]">Antigravity User</h3>
                  <p className="text-sm text-google-gray dark:text-gray-500">user@antigravity.ai</p>
                  <p className="text-xs text-google-blue mt-1 cursor-pointer hover:underline font-medium">+1 (650) 555-0199</p>
                </div>
              </div>

              <div className="border-t border-google-border dark:border-gray-800 pt-6">
                <h4 className="text-sm font-medium text-[#202124] dark:text-[#e8eaed] mb-4">Change Password</h4>
                <form onSubmit={handlePasswordChange} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={password.current}
                    onChange={e => setPassword({...password, current: e.target.value})}
                    className="px-4 py-2 bg-google-light-gray dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-google-blue dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password.next}
                    onChange={e => setPassword({...password, next: e.target.value})}
                    className="px-4 py-2 bg-google-light-gray dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-google-blue dark:text-white"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={password.confirm}
                    onChange={e => setPassword({...password, confirm: e.target.value})}
                    className="px-4 py-2 bg-google-light-gray dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-google-blue dark:text-white"
                  />
                  <div className="md:col-span-3 flex justify-end">
                    <button 
                      type="submit"
                      className="bg-google-blue hover:bg-google-blue-hover text-white px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="mt-8 pt-6 border-t border-google-border dark:border-gray-800 flex justify-between items-center">
                <div className="flex items-center text-sm text-google-gray dark:text-gray-500">
                  <ShieldCheck className="w-4 h-4 mr-2 text-green-500" />
                  Two-factor authentication is enabled
                </div>
                <button className="text-red-500 text-sm font-medium hover:underline flex items-center">
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </button>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-white dark:bg-gray-800/20 rounded-2xl border border-google-border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-google-light-gray dark:bg-gray-800/50 border-b border-google-border dark:border-gray-700 flex items-center space-x-3">
              <Bell className="w-5 h-5 text-google-blue" />
              <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed]">Notifications</h2>
            </div>
            <div className="p-6">
              <Toggle 
                label="Incoming Calls" 
                description="Get notified about incoming voice calls" 
                enabled={notifications.incoming} 
                onChange={(v: boolean) => setNotifications({...notifications, incoming: v})}
              />
              <Toggle 
                label="Messages" 
                description="Show alerts for new incoming text messages" 
                enabled={notifications.messages} 
                onChange={(v: boolean) => setNotifications({...notifications, messages: v})}
              />
              <Toggle 
                label="Voicemails" 
                description="Notify me when I receive a new voicemail" 
                enabled={notifications.voicemail} 
                onChange={(v: boolean) => setNotifications({...notifications, voicemail: v})}
              />
              <Toggle 
                label="Sounds" 
                description="Play a sound for every new notification" 
                enabled={notifications.sound} 
                onChange={(v: boolean) => setNotifications({...notifications, sound: v})}
              />
            </div>
          </section>

          {/* Preferences Section */}
          <section className="bg-white dark:bg-gray-800/20 rounded-2xl border border-google-border dark:border-gray-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-google-light-gray dark:bg-gray-800/50 border-b border-google-border dark:border-gray-700 flex items-center space-x-3">
              <SettingsIcon className="w-5 h-5 text-google-blue" />
              <h2 className="text-sm font-semibold text-[#202124] dark:text-[#e8eaed]">Preferences</h2>
            </div>
            <div className="p-6">
              {/* Appearance */}
              <div className="flex items-center justify-between py-4 border-b border-google-border dark:border-gray-800">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">Dark Mode</p>
                  <p className="text-xs text-google-gray dark:text-gray-500">Toggle between light and dark theme</p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full border border-google-border dark:border-gray-700 transition-colors ${
                    isDarkMode ? 'bg-gray-800 text-yellow-400' : 'bg-google-light-gray text-google-blue'
                  }`}
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {/* Language */}
              <div className="flex items-center justify-between py-4 border-b border-google-border dark:border-gray-800">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-google-gray" />
                    <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">Language</p>
                  </div>
                  <p className="text-xs text-google-gray dark:text-gray-500">Select your preferred display language</p>
                </div>
                <select 
                  value={preferences.language}
                  onChange={e => setPreferences({...preferences, language: e.target.value})}
                  className="bg-google-light-gray dark:bg-gray-800 border-none rounded-lg text-sm dark:text-white px-3 py-2 outline-none"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>

              {/* Time Format */}
              <div className="flex items-center justify-between py-4 border-b border-google-border dark:border-gray-800">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-google-gray" />
                    <p className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">Time Format</p>
                  </div>
                  <p className="text-xs text-google-gray dark:text-gray-500">Display time in 12-hour or 24-hour clock</p>
                </div>
                <div className="flex bg-google-light-gray dark:bg-gray-800 rounded-lg p-1">
                  <button 
                    onClick={() => setPreferences({...preferences, timeFormat: '12h'})}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                      preferences.timeFormat === '12h' ? 'bg-white dark:bg-gray-700 shadow-sm font-bold' : 'text-google-gray'
                    }`}
                  >
                    12H
                  </button>
                  <button 
                    onClick={() => setPreferences({...preferences, timeFormat: '24h'})}
                    className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                      preferences.timeFormat === '24h' ? 'bg-white dark:bg-gray-700 shadow-sm font-bold' : 'text-google-gray'
                    }`}
                  >
                    24H
                  </button>
                </div>
              </div>

              <Toggle 
                label="Auto-delete History" 
                description="Automatically delete messages older than 365 days" 
                enabled={preferences.autoDelete} 
                onChange={(v: boolean) => setPreferences({...preferences, autoDelete: v})}
              />
            </div>
          </section>

          <div className="flex justify-center pt-4">
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="text-google-gray dark:text-gray-500 text-xs font-medium hover:underline px-4 py-2"
            >
              Reset all settings to default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
