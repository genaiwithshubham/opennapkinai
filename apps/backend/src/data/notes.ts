import { Note } from '@repo/types';

export const notes: Note[] = [
    {
        "id": "a44012ee-268c-4ff5-9a8e-59bcc092ae8b",
        "title": "I will delete this",
        "content": {
            "time": 1755441128048,
            "blocks": [
                {
                    "id": "0rBElN520u",
                    "type": "header",
                    "data": {
                        "text": "I will delete this",
                        "level": 1
                    }
                }
            ],
            "version": "2.31.0-rc.7"
        },
        "createdAt": new Date("2025-08-17T14:32:09.005Z"),
        "updatedAt": new Date("2025-08-17T14:32:09.005Z")
    },
    {
        "id": "419f6e8b-61bc-4f77-a4db-11c6fcadb2d6",
        "title": "Shubham",
        "content": {
            "time": 1755441094195,
            "blocks": [
                {
                    "id": "pxIik30dcF",
                    "type": "header",
                    "data": {
                        "text": "Shubham",
                        "level": 1
                    }
                },
                {
                    "id": "5BbR3YKe9d",
                    "type": "paragraph",
                    "data": {
                        "text": "This is my test note"
                    }
                },
                {
                    "id": "J_3SCii8tC",
                    "type": "paragraph",
                    "data": {
                        "text": "The tool should now appear in your inline toolbar and work correctly! The demo shows exactly how it functions with a clickable highlighted text example."
                    }
                },
                {
                    "id": "_dkMORJ9pS",
                    "type": "diagramBlock",
                    "data": {
                        "originalText": "The tool should now appear in your inline toolbar and work correctly! The demo shows exactly how it functions with a clickable highlighted text example.",
                        "sourceBlockIndex": 2
                    }
                }
            ],
            "version": "2.31.0-rc.7"
        },
        "createdAt": new Date("2025-08-17T14:29:26.057Z"),
        "updatedAt": new Date("2025-08-17T14:31:38.288Z")
    }
];

export const getNoteById = (id: string): Note | undefined => {
    return notes.find(note => note.id === id);
};

export const getAllNotes = (): Note[] => {
    return notes;
};

export const createNote = (note: Note): void => {
    notes.push(note);
};

export const deleteNoteById = (id: string): boolean => {
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
        notes.splice(index, 1);
        return true;
    }
    return false;
};

export const updateNote = (id: string, updatedNote: Partial<Note>): Note | undefined => {
    const note = getNoteById(id);
    if (note) {
        Object.assign(note, updatedNote);
        return note;
    }
    return undefined;
};
