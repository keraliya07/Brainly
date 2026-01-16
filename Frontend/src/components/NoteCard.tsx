import { Trash2, Edit2 } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { contentApi } from '../lib/api';
import { useState } from 'react';
import ContentModal from './ContentModal';

interface NoteCardProps {
  note: {
    id: number;
    type: string;
    typeIcon: LucideIcon;
    title: string;
    content: React.ReactNode;
    tags: string[];
    createdAt: string;
    updatedAt?: string;
  };
  onUpdate?: () => void;
  onDelete?: () => void;
}

const NoteCard = ({ note, onUpdate, onDelete }: NoteCardProps) => {
  const Icon = note.typeIcon;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    setIsDeleting(true);
    const response = await contentApi.delete(note.id);

    if (!response.error && onDelete) {
      onDelete();
    }
    setIsDeleting(false);
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 lg:p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Icon size={18} />
            <span className="text-sm font-medium capitalize">{note.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-1.5 hover:bg-purple-50 rounded transition-colors"
              title="Edit"
            >
              <Edit2 size={16} className="text-gray-500 hover:text-purple-600" />
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={16} className="text-gray-500 hover:text-red-600" />
            </button>
          </div>
        </div>
        <div className="flex-1">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 line-clamp-2">{note.title}</h3>
        <div className="mb-3 sm:mb-4 text-sm lg:text-base">{note.content}</div>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded text-xs lg:text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-end">
          <div className="text-right">
            {note.updatedAt && note.updatedAt !== note.createdAt ? (
              <p className="text-[10px] lg:text-xs text-gray-500">
                updated at {note.updatedAt}
              </p>
            ) : (
              <p className="text-[10px] lg:text-xs text-gray-500">
                created at {note.createdAt || 'unknown date'}
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <ContentModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            if (onUpdate) onUpdate();
          }}
          contentId={note.id}
        />
      )}
    </>
  );
};

export default NoteCard
