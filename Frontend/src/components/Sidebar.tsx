import { NavLink } from 'react-router-dom';
import { Twitter, Play, FileText, BookOpen, Headphones, GraduationCap, Link2, Hash, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  onNavigate?: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: Home, label: 'All Notes', path: '/home' },
    { icon: Twitter, label: 'Tweets', path: '/twitter' },
    { icon: Play, label: 'Videos', path: '/video' },
    { icon: FileText, label: 'Articles', path: '/article' },
    { icon: BookOpen, label: 'Books', path: '/book' },
    { icon: Headphones, label: 'Podcasts', path: '/podcast' },
    { icon: GraduationCap, label: 'Courses', path: '/course' },
    { icon: Link2, label: 'Other', path: '/other' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg lg:shadow-none">
      <div className="p-4 lg:p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.svg" 
            alt="Brainly Logo" 
            className="w-8 h-8 flex-shrink-0"
          />
          <span className="text-lg lg:text-xl font-semibold text-gray-900">Brainly</span>
        </div>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors ${
                      isActive ? 'bg-purple-50 text-purple-700' : ''
                    }`
                  }
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="mb-3 px-4 py-2">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
        >
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar
