import { Schema, model } from 'mongoose';

const userSchema = Schema(
  {
    userName: {
      type: String,
      required: [true, 'User name required'],
    },
    email: {
      type: String,
      required: [true, 'User name required'],
      unique: [true, 'Email  already in use'],
      lowercase: [true, 'Invalid email'],
      trim: [true, 'Space not allow'],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
      min: [8, 'Password should be at least 8 characters'],
      max: [16, 'Password should not upto 16 characters'],
    },
    orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
    favorite: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Favorite',
      },
    ],
    OTP: {
      type: String,
    },
    expireTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

export { User };
