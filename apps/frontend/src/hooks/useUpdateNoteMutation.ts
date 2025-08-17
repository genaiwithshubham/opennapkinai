import { apiClient } from "../data/api";
import { notesQueryKeys } from "../data/queryKeys";
import { Note } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, note }: { id: string; note: Partial<Note> }) => {
      const response = await apiClient.updateNote(id, note);
      return response.data;
    },
    onSuccess: (data, variables) => {
      if (data) {
        // Update the specific note in cache
        queryClient.setQueryData(notesQueryKeys.detail(variables.id), data);
        
        // Update the note in the list cache
        queryClient.setQueryData(
          notesQueryKeys.lists(),
          (oldNotes: Note[] | undefined) => {
            if (!oldNotes) return [data];
            return oldNotes.map((note) => 
              note.id === variables.id ? data : note
            );
          }
        );
      }
    },
    onError: (error) => {
      console.error('Failed to update note:', error);
    },
  });
};
