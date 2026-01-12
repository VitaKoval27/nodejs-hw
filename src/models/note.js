import { model, Schema } from 'mongoose';

const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      default: 'Todo',
      enum: [
        'Todo',
        'Work',
        'Shopping',
        'Personal',
        'Meeting',
        'Ideas',
        'Travel',
        'Finance',
        'Health',
        'Important',
      ],
    },
  },
  {
    timestamps: true,
  },
);

export const Note = model('Note', noteSchema);
