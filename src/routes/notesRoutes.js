import { Router } from 'express';
import {
  createNewNote,
  getAllNotes,
  getNoteById,
  deleteNote,
  updateNote,
} from '../controllers/notesControllers.js';

const router = Router();
router.get('/notes', getAllNotes);
router.get('/notes/:noteId', getNoteById);
router.post('/notes', createNewNote);
router.delete('/notes/:noteId', deleteNote);
router.patch('/notes/:noteId', updateNote);

export default router;
