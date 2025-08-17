import { useDeleteNoteMutation } from '../hooks/useDeleteNoteMutation';
import { Note } from '@repo/types';
import { MoreVertical, Trash2, Edit, Calendar, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface NoteCardProps {
    note: Note;
    onClick: () => void;
}

const NoteCard = ({ note, onClick }: NoteCardProps) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const deleteMutation = useDeleteNoteMutation();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!showDeleteConfirm) {
            setShowDeleteConfirm(true);
            return;
        }

        try {
            await deleteMutation.mutateAsync(note.id);
            setShowDeleteConfirm(false);
        } catch (error) {
            console.error('Failed to delete note:', error);
            alert('Failed to delete note. Please try again.');
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClick();
        setShowMenu(false);
    };

    const formatDate = (date: Date | string) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: d.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
        });
    };

    // Get preview text from content blocks
    const getPreviewText = () => {
        if (!note.content?.blocks?.length) return 'No content';
        
        // Skip the first block if it's a header (title)
        const contentBlocks = note.content.blocks.slice(1);
        const textBlock = contentBlocks.find(block => 
            block.type === 'paragraph' && block.data?.text
        );
        
        if (textBlock?.data?.text) {
            // Remove HTML tags and limit length
            const cleanText = textBlock.data.text.replace(/<[^>]*>/g, '');
            return cleanText.length > 100 ? cleanText.substring(0, 100) + '...' : cleanText;
        }
        
        return 'No content';
    };

    return (
        <div 
            className="ai-card rounded-xl p-6 hover:ai-glow-hover hover:border-blue-200 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
            onClick={onClick}
        >
            {/* Menu Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(!showMenu);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    disabled={deleteMutation.isPending}
                >
                    <MoreVertical className="w-4 h-4 text-secondary" />
                </button>

                {/* Dropdown Menu */}
                {showMenu && (
                    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-[120px] z-10">
                        <button
                            onClick={handleEdit}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2"
                        >
                            <Edit className="w-3 h-3" />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className={`w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 ${
                                showDeleteConfirm ? 'text-red-600 bg-red-50' : 'text-red-500'
                            }`}
                        >
                            {deleteMutation.isPending ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-3 h-3" />
                                    {showDeleteConfirm ? 'Confirm Delete' : 'Delete'}
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Click outside to close menu */}
            {showMenu && (
                <div 
                    className="fixed inset-0 z-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        setShowDeleteConfirm(false);
                    }}
                />
            )}

            {/* Note Content */}
            <div className="space-y-3">
                {/* Title */}
                <h3 className="font-semibold text-primary text-lg line-clamp-2">
                    {note.title}
                </h3>

                {/* Preview */}
                <p className="text-secondary text-sm line-clamp-3">
                    {getPreviewText()}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs text-secondary">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {formatDate(note.updatedAt)}
                        </span>
                    </div>

                    {/* Word count or block count indicator */}
                    <div className="text-xs text-secondary">
                        {note.content?.blocks?.length || 0} blocks
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
