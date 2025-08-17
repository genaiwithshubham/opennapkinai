import { Router, Request, Response } from 'express';
import { createNote, deleteNoteById, getAllNotes, getNoteById, updateNote } from '../data/notes';
import { Note } from '@repo/types/dist/note';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const notes = getAllNotes();

    res.json({
      success: true,
      data: notes,
      count: notes.length
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notes'
    });
  }
});

router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    const note: Note | undefined = getNoteById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch note'
    });
  }
});

router.post('/', (req: Request, res: Response) => {
  try {
    const newNote: Note = req.body;

    if (!newNote || !newNote.id) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    createNote(newNote);

    res.status(201).json({
      success: true,
      data: newNote
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create note'
    });
  }
});

router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    const deleted = deleteNoteById(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: `Note with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      message: `Note with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete note'
    });
  }
});

router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedNote: Partial<Note> = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Note ID is required'
      });
    }

    const note = updateNote(id, updatedNote);

    if (!note) {
      return res.status(404).json({
        success: false,
        error: `Note with ID ${id} not found`
      });
    }

    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update note'
    });
  }
});

export default router;