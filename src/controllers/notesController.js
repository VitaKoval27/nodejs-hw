import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// all notes
export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find({ userId: req.user._id });

  if (tag) {
    notesQuery.where('tag').equals(tag);
  }

  if (search) {
    notesQuery.where({ $text: { $search: search } });
  }

  const [totalNotes, notes] = await Promise.all([
    notesQuery.clone().countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);
  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

// get one note by Id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};

// create new note
export const createNote = async (req, res) => {
  const newNote = await Note.create({ ...req.body, userId: req.user._id });
  res.status(201).json(newNote);
};

// delete note
export const deleteNote = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
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
  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!note) {
    next(createHttpError(404, 'Note not found'));
    return;
  }
  res.status(200).json(note);
};
