import { Plus, Eye, Sparkles, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useNotes } from '../../hooks/useNotes';
import NoteCard from '../NoteCard';

export const NotesPage = () => {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 minimal-pattern">
            <NotesHeader />
            <NotesContent />
        </div>
    );
};

const NotesHeader = () => {
    return (
        <div className="ai-card border-b border-blue-100/50">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg ai-gradient">
                                <Eye className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-primary">OpenNapkinAI</h1>
                            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
                        </div>
                        <p className="text-secondary text-sm">
                            Turn Your Words into Stunning Visuals
                        </p>
                    </div>

                    <Link
                        to={`/new`}
                        className="flex items-center gap-2 ai-button text-white px-6 py-3 rounded-xl transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        New Note
                    </Link>
                </div>
            </div>
        </div>
    );
};


const NotesContent = () => {
    const { notes, isLoading, error } = useNotes();
    const navigate = useNavigate();

    // Loading state
    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-accent" />
                        <span className="text-secondary">Loading notes...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="text-center py-16">
                    <div className="ai-card rounded-2xl p-12 max-w-md mx-auto border-red-200">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                            Failed to load notes
                        </h3>
                        <p className="text-red-600 mb-6">
                            {error instanceof Error ? error.message : 'Something went wrong'}
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-8">
            {notes.length === 0 ? (
                <div className="text-center py-16">
                    <div className="ai-card rounded-2xl p-12 max-w-md mx-auto ai-glow">
                        <div className="relative mb-6">
                            <Eye className="w-16 h-16 text-accent mx-auto mb-2" />
                            <Sparkles className="w-6 h-6 text-blue-400 absolute top-0 right-1/3 animate-pulse" />
                        </div>
                        <h3 className="text-xl font-semibold text-primary mb-2">No notes yet</h3>
                        <p className="text-secondary mb-6">
                            Create your first note and transform text into visual insights with AI assistance.
                        </p>
                        <Link
                            to={`/new`}
                            className="flex items-center gap-2 ai-button text-white px-6 py-3 rounded-xl transition-all duration-300 mx-auto"
                        >
                            <Plus className="w-5 h-5" />
                            Create Note
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onClick={() => navigate(`/${note.id}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotesContent;