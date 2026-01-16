import { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { contentApi, tagApi } from '../lib/api';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  contentId?: number;
  initialData?: {
    title: string;
    description: string;
    link: string;
    type: string;
    tagIds: number[];
  };
}

const ContentModal = ({ isOpen, onClose, onSuccess, contentId, initialData }: ContentModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [type, setType] = useState('article');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  useEffect(() => {
    const loadTags = async () => {
      setLoadingTags(true);
      const response = await tagApi.getAll();
      if (response.data) {
        setAvailableTags(response.data.tags || []);
      }
      setLoadingTags(false);
    };

    if (isOpen) {
      loadTags();
    }
  }, [isOpen]);

  useEffect(() => {
    const loadContent = async () => {
      if (contentId && !initialData) {
        setLoadingContent(true);
        setError('');
        try {
          const response = await contentApi.getById(contentId);
          if (response.data?.content) {
            const content = response.data.content;
            setTitle(content.title || '');
            setDescription(content.description || '');
            setLink(content.link || '');
            setType(content.type || 'article');
            setSelectedTagIds(content.tags?.map((tag: any) => tag.id) || []);
          } else if (response.error) {
            setError(response.error);
          }
        } catch (err) {
          setError('Failed to load content');
        } finally {
          setLoadingContent(false);
        }
      } else if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setLink(initialData.link || '');
        setType(initialData.type || 'article');
        setSelectedTagIds(initialData.tagIds || []);
      } else {
        setTitle('');
        setDescription('');
        setLink('');
        setType('article');
        setSelectedTagIds([]);
      }
      setError('');
      setShowNewTagInput(false);
      setNewTagName('');
    };

    if (isOpen) {
      loadContent();
    }
  }, [initialData, isOpen, contentId]);

  if (!isOpen) return null;

  if (loadingContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="text-purple-600 text-lg">Loading content...</div>
          </div>
        </div>
      </div>
    );
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setLoadingTags(true);
    const response = await tagApi.create(newTagName.trim());
    if (response.data?.tag) {
      setAvailableTags([...availableTags, response.data.tag]);
      setSelectedTagIds([...selectedTagIds, response.data.tag.id]);
      setNewTagName('');
      setShowNewTagInput(false);
    } else if (response.error) {
      setError(response.error);
    }
    setLoadingTags(false);
  };

  const handleToggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]);
    }
  };

  const handleRemoveTag = (tagId: number) => {
    setSelectedTagIds(selectedTagIds.filter(id => id !== tagId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = {
      title,
      description,
      link: link || undefined,
      type,
      tagIds: selectedTagIds.length > 0 ? selectedTagIds : undefined,
    };

    try {
      if (contentId) {
        const response = await contentApi.update(contentId, data);
        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }
      } else {
        const response = await contentApi.create(data);
        if (response.error) {
          setError(response.error);
          setLoading(false);
          return;
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError('An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
            {contentId ? 'Edit Content' : 'Add New Content'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <X size={20} className="sm:w-6 sm:h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
            >
              <option value="article">Article</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter</option>
              <option value="video">Video</option>
              <option value="podcast">Podcast</option>
              <option value="book">Book</option>
              <option value="course">Course</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none resize-none"
              placeholder="Enter description"
            />
          </div>

          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Link (optional)
            </label>
            <input
              id="link"
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {selectedTagIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTagIds.map((tagId) => {
                    const tag = availableTags.find(t => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <span
                        key={tagId}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                      >
                        #{tag.title}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tagId)}
                          className="hover:bg-purple-200 rounded-full p-0.5 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {availableTags
                  .filter(tag => !selectedTagIds.includes(tag.id))
                  .map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.id)}
                      className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-purple-50 hover:border-purple-300 transition-colors"
                    >
                      + #{tag.title}
                    </button>
                  ))}
              </div>

              {showNewTagInput ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCreateTag();
                      } else if (e.key === 'Escape') {
                        setShowNewTagInput(false);
                        setNewTagName('');
                      }
                    }}
                    placeholder="Enter tag name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none text-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={!newTagName.trim() || loadingTags}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTagInput(false);
                      setNewTagName('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowNewTagInput(true)}
                  className="flex items-center gap-2 px-3 py-2 text-purple-600 hover:bg-purple-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Plus size={16} />
                  Create New Tag
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {loading ? 'Saving...' : contentId ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentModal;
