import { Search, Plus } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  onAddContent: () => void;
  onSearch: (query: string) => void;
}

const TopBar = ({ onAddContent, onSearch }: TopBarProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="h-14 lg:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 lg:px-6 gap-2 lg:gap-3 sticky top-0 z-20">
      <div className="flex-1 min-w-0">
        <div className="relative">
          <Search className="absolute left-2 lg:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search notes..."
            className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 text-sm lg:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
          />
        </div>
      </div>
      <button
        onClick={onAddContent}
        className="flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium whitespace-nowrap text-sm lg:text-base flex-shrink-0"
      >
        <Plus size={16} className="lg:w-[18px] lg:h-[18px]" />
        <span className="hidden sm:inline">Add Content</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
};

export default TopBar
