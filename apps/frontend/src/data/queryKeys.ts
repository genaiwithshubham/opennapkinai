export const notesQueryKeys = {
    all: ['notes'] as const,
    lists: () => [...notesQueryKeys.all, 'list'] as const,
    list: (filters: string) => [...notesQueryKeys.lists(), { filters }] as const,
    details: () => [...notesQueryKeys.all, 'detail'] as const,
    detail: (id: string) => [...notesQueryKeys.details(), id] as const,
};