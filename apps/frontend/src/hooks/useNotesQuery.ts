import { apiClient } from '../data/api';
import { notesQueryKeys } from '../data/queryKeys';
import { useQuery } from '@tanstack/react-query';

// Get all notes
export const useNotesQuery = () => {
    return useQuery({
        queryKey: notesQueryKeys.lists(),
        queryFn: async () => {
            const response = await apiClient.getAllNotes();
            return response.data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
};