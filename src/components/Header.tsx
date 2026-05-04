import { Search, Settings, HelpCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onHelpClick: () => void;
}

const Header = ({ isDarkMode, toggleDarkMode, onHelpClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-google-border dark:border-gray-700 bg-white/80 dark:bg-[#1a1c1e]/80 backdrop-blur-md flex items-center justify-between px-4 z-10 transition-colors sticky top-0">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          {/* Mock Logo */}
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mr-2 shadow-sm shadow-green-500/20">
            <span className="text-white text-xl font-bold">V</span>
          </div>
          <span className="text-[#5f6368] dark:text-gray-300 text-xl font-medium hidden xs:block">Voice</span>
        </div>
      </div>

      <div className="flex-1 max-w-2xl mx-2 sm:mx-8 hidden sm:block">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-google-gray group-focus-within:text-google-blue transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-xl leading-5 bg-google-light-gray dark:bg-gray-800 placeholder-google-gray dark:placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-google-blue/20 sm:text-sm transition-all shadow-sm"
            placeholder="Search messages or calls"
          />
        </div>
      </div>

      <div className="flex items-center space-x-0.5 sm:space-x-2">
        <button className="p-2 text-google-gray dark:text-gray-400 hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full sm:hidden">
          <Search className="w-6 h-6" />
        </button>
        <button 
          onClick={toggleDarkMode}
          className="p-2 text-google-gray dark:text-gray-400 hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <button 
          onClick={onHelpClick}
          className="p-2 text-google-gray dark:text-gray-400 hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full hidden xs:block"
        >
          <HelpCircle className="w-6 h-6" />
        </button>
        <button className="p-2 text-google-gray dark:text-gray-400 hover:bg-google-light-gray dark:hover:bg-gray-800 rounded-full hidden md:block">
          <Settings className="w-6 h-6" />
        </button>
        <div className="w-8 h-8 rounded-full bg-google-blue flex items-center justify-center text-white font-medium ml-1 cursor-pointer border-2 border-transparent hover:border-google-blue-hover transition-all">
          A
        </div>
      </div>
    </header>

  );
};

export default Header;
