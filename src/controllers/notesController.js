import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// all notes
export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({ $text: { $search: search } });
  }

  const [totalItems, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);
  const totalPages = Math.ceil(totalItems / perPage);
  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    notes,
  });
};

// get one note by Id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

// create new note
export const createNote = async (req, res) => {
  const newNote = await Note.create(req.body);
  res.status(201).json(newNote);
};

// delete note
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

// PATCH /notes/:noteId

export const updateNote = async (req, res, next) => {
  const { noteId } = req.params;
  const updateData = req.body;
  const note = await Note.findOneAndUpdate({ _id: noteId }, updateData, {
    new: true,
    runValidators: true,
  });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
