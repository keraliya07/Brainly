import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MainContent from './MainContent';
import ContentModal from './ContentModal';
import { Menu, X } from 'lucide-react';

const Layout = () => {
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddContent = () => {
    setIsContentModalOpen(true);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleContentSuccess = () => {
    setIsContentModalOpen(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <div
        className={`fixed lg:relative h-full ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out z-50 lg:z-auto`}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-1 flex flex-col min-w-0 w-full lg:w-auto">
        <div className="lg:hidden bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 sticky top-0 z-30">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
          </button>
          <img 
            src="/logo.svg" 
            alt="Brainly Logo" 
            className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0"
          />
          <span className="text-base sm:text-lg font-semibold text-gray-900">Brainly</span>
        </div>
        <TopBar onAddContent={handleAddContent} onSearch={handleSearchChange} />
        <MainContent searchQuery={searchQuery} key={refreshKey} />
      </div>

      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        onSuccess={handleContentSuccess}
      />
    </div>
  );
};

export default Layout
