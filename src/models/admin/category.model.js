import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: [true, 'Category name should be unique'],
  },
  size: {
    type: Boolean,
  },
  isPrimary: {
    type: String,
    enum: ['sm', 'md', 'lg', 'xl', 'xxl'],
  },
  isDrink: {
    type: String,
    enum: ['0.5 Lt', '1 Lt', '1.5 Lt', '2.5 Lt'],
  },
});

const Category = model('Category', categorySchema);

export { Category };
