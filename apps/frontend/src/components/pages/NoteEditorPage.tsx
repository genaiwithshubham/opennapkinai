import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useParams } from 'react-router';
import Editor from '../Editor';
import type { OutputData } from '@editorjs/editorjs';
import { useState, useEffect } from 'react';
import { useNoteQuery } from '../../hooks/useNoteQuery';
import { useNotes } from '../../hooks/useNotes';

const INITIAL_DATA = {
    time: new Date().getTime(),
    blocks: [
        {
            type: "header",
            data: {
                text: "Title",
                level: 1,
            },
        }
    ],
};

export const NoteEditorPage = () => {
    const { id } = useParams();
    const isNewNote = !id || id === 'new';

    // For existing notes, fetch the specific note
    const { data: note, isLoading: isLoadingNote, error } = useNoteQuery(id!, !isNewNote);

    const { saveNote, isSaving } = useNotes();
    const [content, setContent] = useState<OutputData>(INITIAL_DATA);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Update content when note is loaded
    useEffect(() => {
        if (note) {
            setContent(note.content);
            setHasUnsavedChanges(false);
        }
    }, [note]);

    // Track unsaved changes
    useEffect(() => {
        if (note && JSON.stringify(content) !== JSON.stringify(note.content)) {
            setHasUnsavedChanges(true);
        } else if (!note && JSON.stringify(content) !== JSON.stringify(INITIAL_DATA)) {
            setHasUnsavedChanges(true);
        } else {
            setHasUnsavedChanges(false);
        }
    }, [content, note]);

    const handleSave = async () => {
        try {
            const noteId = note?.id || crypto.randomUUID();
            const updatedNote = {
                id: isNewNote ? crypto.randomUUID() : noteId,
                title: content.blocks[0]?.data?.text || 'Untitled Note',
                content,
                createdAt: note?.createdAt || new Date(),
                updatedAt: new Date(),
            };

            await saveNote(updatedNote);
            setHasUnsavedChanges(false);

            // Show success message
            // You can replace this with a toast notification
            alert('Note saved successfully!');
        } catch (error) {
            console.error('Failed to save note:', error);
            alert('Failed to save note. Please try again.');
        }
    };

    // Loading state for existing notes
    if (!isNewNote && isLoadingNote) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 minimal-pattern">
                <NoteEditorHeader
                    handleSave={handleSave}
                    isSaving={isSaving}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
                <div className="flex items-center justify-center py-16">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-accent" />
                        <span className="text-secondary">Loading note...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (!isNewNote && error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 minimal-pattern">
                <NoteEditorHeader
                    handleSave={handleSave}
                    isSaving={isSaving}
                    hasUnsavedChanges={hasUnsavedChanges}
                />
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⚠️</span>
                        </div>
                        <h3 className="text-xl font-semibold text-red-700 mb-2">
                            Failed to load note
                        </h3>
                        <p className="text-red-600 mb-6">
                            {error instanceof Error ? error.message : 'Note not found'}
                        </p>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-accent text-white rounded-xl hover:bg-accent/90 transition-colors"
                        >
                            Back to Notes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 minimal-pattern">
            <NoteEditorHeader
                handleSave={handleSave}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
            />
          {note && <NoteEditorContent content={note.content} setContent={setContent} />}
            {!note && <NoteEditorContent content={content} setContent={setContent} />}
        </div>
    );
};

// Updated NoteEditorHeader component
interface NoteEditorHeaderProps {
    handleSave: () => void;
    isSaving?: boolean;
    hasUnsavedChanges?: boolean;
}

const NoteEditorHeader = ({ handleSave, isSaving, hasUnsavedChanges }: NoteEditorHeaderProps) => {
    return (
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Notes
                </Link>

                <div className="flex items-center gap-4">
                    {hasUnsavedChanges && (
                        <span className="text-sm text-amber-600">
                            Unsaved changes
                        </span>
                    )}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 ai-button text-white px-6 py-2.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Note
                            </>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

// NoteEditorContent component (assuming you have this)
interface NoteEditorContentProps {
    content: OutputData;
    setContent: (content: OutputData) => void;
}

const NoteEditorContent = ({ content, setContent }: NoteEditorContentProps) => {
    return (
        <main className="max-w-4xl mx-auto px-6 py-8">
            <div className="ai-card rounded-2xl p-8 min-h-[600px]">
                <Editor
                    data={content}
                    onChange={setContent}
                    editorblock='editorjs-container'
                />
            </div>
        </main>
    );
};
