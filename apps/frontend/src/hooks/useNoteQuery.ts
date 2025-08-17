import { apiClient } from "../data/api";
import { notesQueryKeys } from "../data/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useNoteQuery = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: notesQueryKeys.detail(id),
    queryFn: async () => {
      const response = await apiClient.getNoteById(id);
      return response.data;
    },
    enabled: enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};