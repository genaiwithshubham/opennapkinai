import { apiClient } from "../data/api";
import { notesQueryKeys } from "../data/queryKeys";
import { Note } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

export const useDeleteNoteMutation = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.deleteNote(id);
      return id;
    },
    onSuccess: (deletedId) => {
      // Remove from notes list cache
      queryClient.setQueryData(
        notesQueryKeys.lists(),
        (oldNotes: Note[] | undefined) => {
          if (!oldNotes) return [];
          return oldNotes.filter((note) => note.id !== deletedId);
        }
      );
      
      // Remove the specific note from cache
      queryClient.removeQueries({ queryKey: notesQueryKeys.detail(deletedId) });
      
      // Navigate back to notes list
      navigate('/');
    },
    onError: (error) => {
      console.error('Failed to delete note:', error);
    },
  });
};
