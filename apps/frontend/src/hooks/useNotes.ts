import { Note } from "@repo/types";
import { useCreateNoteMutation } from "./useCreateNoteMutation";
import { useDeleteNoteMutation } from "./useDeleteNoteMutation";
import { useNotesQuery } from "./useNotesQuery";
import { useUpdateNoteMutation } from "./useUpdateNoteMutation";

export const useNotes = () => {
  const { data: notes = [], isLoading, error } = useNotesQuery();
  const createMutation = useCreateNoteMutation();
  const updateMutation = useUpdateNoteMutation();
  const deleteMutation = useDeleteNoteMutation();

  const saveNote = async (note: Note) => {
    // Check if note already exists
    const existingNoteIndex = notes.findIndex(n => n.id === note.id);
    
    if (existingNoteIndex >= 0) {
      // Update existing note
      await updateMutation.mutateAsync({ id: note.id, note });
    } else {
      // Create new note
      await createMutation.mutateAsync(note);
    }
  };

  const deleteNote = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return {
    notes,
    isLoading,
    error,
    saveNote,
    deleteNote,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSaving: createMutation.isPending || updateMutation.isPending,
  };
};

// import { useState, useEffect } from 'react';
// import { Note } from '@repo/types'

// const STORAGE_KEY = 'notes-app-data';

// export const useNotes = () => {
//   const [notes, setNotes] = useState<Note[]>([]);

//   // Load notes from localStorage on mount
//   useEffect(() => {
//     try {
//       const savedNotes = localStorage.getItem(STORAGE_KEY);
//       if (savedNotes) {
//         const parsedNotes = JSON.parse(savedNotes);
//         // Convert date strings back to Date objects
//         const notesWithDates = parsedNotes.map((note: Note) => ({
//           ...note,
//           createdAt: new Date(note.createdAt),
//           updatedAt: new Date(note.updatedAt),
//         }));
//         setNotes(notesWithDates);
//       }
//     } catch (error) {
//       console.error('Failed to load notes from localStorage:', error);
//     }
//   }, []);

//   // Save notes to localStorage whenever notes change
//   useEffect(() => {
//     try {
//       if(notes.length != 0) {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
//       } 
//     } catch (error) {
//       console.error('Failed to save notes to localStorage:', error);
//     }
//   }, [notes]);

//   const saveNote = (note: Note) => {
//     setNotes((prevNotes) => {
//       const existingIndex = prevNotes.findIndex((n) => n.id === note.id);
//       if (existingIndex >= 0) {
//         // Update existing note
//         const updated = [...prevNotes];
//         updated[existingIndex] = note;
//         return updated;
//       } else {
//         // Add new note
//         return [note, ...prevNotes];
//       }
//     });
//   };

//   const deleteNote = (noteId: string) => {
//     setNotes((prevNotes) => prevNotes.filter((n) => n.id !== noteId));
//   };

//   return {
//     notes,
//     saveNote,
//     deleteNote,
//   };
// };