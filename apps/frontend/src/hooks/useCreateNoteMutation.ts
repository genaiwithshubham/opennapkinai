import { apiClient } from "../data/api";
import { notesQueryKeys } from "../data/queryKeys";
import { Note } from "@repo/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateNoteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (note: Note) => {
      const response = await apiClient.createNote(note);
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: notesQueryKeys.lists() });
      
      // Add the new note to the cache
      if (data) {
        queryClient.setQueryData(notesQueryKeys.detail(data.id), data);
      }
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });
};