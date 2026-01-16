import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NoteCard from './NoteCard';
import { contentApi } from '../lib/api';
import {
  FileText,
  Play,
  Twitter,
  BookOpen,
  Headphones,
  GraduationCap,
  Link2,
  Home,
  Youtube,
} from 'lucide-react';

const typeIcons: Record<string, any> = {
  article: FileText,
  youtube: Youtube,
  twitter: Twitter,
  video: Play,
  podcast: Headphones,
  book: BookOpen,
  course: GraduationCap,
  other: Link2,
};

interface MainContentProps {
  searchQuery?: string;
}

const MainContent = ({ searchQuery = '' }: MainContentProps) => {
  const location = useLocation();
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getTypeFromPath = () => {
    const path = location.pathname;
    if (path === '/home' || path === '/' || path === '') return undefined;
    return path.substring(1);
  };

  const fetchContents = async () => {
    setLoading(true);
    setError('');

    const type = getTypeFromPath();
    const params: any = {};

    if (type) {
      params.type = type;
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    try {
      const response = type === undefined && !searchQuery
        ? await contentApi.getHome()
        : await contentApi.getAll(params);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setContents(response.data.contents || []);
      }
    } catch (err) {
      setError('Failed to load contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [location.pathname, searchQuery]);

  const handleContentUpdate = () => {
    fetchContents();
  };

  const getPageTitle = () => {
    const type = getTypeFromPath();
    if (!type) return 'All Notes';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (loading && contents.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-purple-600 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 lg:mb-8">{getPageTitle()}</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {contents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No content found</p>
          <p className="text-gray-400 text-sm">Start by adding your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {contents.map((content) => {
            const Icon = typeIcons[content.type] || FileText;
            
            const formatDate = (dateString: string | undefined): string => {
              if (!dateString) return 'unknown date';
              try {
                const dateObj = new Date(dateString);
                if (!isNaN(dateObj.getTime())) {
                  const time = dateObj.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  });
                  const day = dateObj.getDate();
                  const month = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                  }).toLowerCase();
                  const year = dateObj.getFullYear();
                  return `${time}, ${day} ${month} ${year}`;
                }
              } catch (error) {
                console.error('Date formatting error:', error);
              }
              return 'unknown date';
            };

            const createdAt = formatDate(content.createdAt);
            const updatedAt = formatDate(content.updatedAt);

            return (
              <NoteCard
                key={content.id}
                note={{
                  id: content.id,
                  type: content.type,
                  typeIcon: Icon,
                  title: content.title,
                  content: (
                    <div>
                      <p className="text-gray-600 mb-2">{content.description}</p>
                      {content.link && (
                        <a
                          href={content.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700 text-sm underline"
                        >
                          Open link
                        </a>
                      )}
                    </div>
                  ),
                  tags: content.tags?.map((tag: any) => `#${tag.title}`) || [],
                  createdAt,
                  updatedAt: updatedAt !== createdAt ? updatedAt : undefined,
                }}
                onUpdate={handleContentUpdate}
                onDelete={handleContentUpdate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MainContent;
