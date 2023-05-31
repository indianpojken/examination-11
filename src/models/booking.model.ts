import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';
import { Lane } from './lane.model';

export interface Booking {
  bookingNumber?: string;
  email: string;
  date: {
    from: Date;
    to: Date;
  };
  players: number;
  shoeSizes: number[];
  lanes: Lane[];
  total: number;
}

const bookingSchema = new mongoose.Schema<Booking>({
  bookingNumber: {
    type: String,
    default: customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6)(),
  },
  email: { type: String, required: true },
  date: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },
  players: { type: Number, min: 1, required: true },
  shoeSizes: [{ type: Number, required: true }],
  lanes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lane',
      required: true,
    },
  ],
  total: { type: Number, required: true },
});

export const bookingModel = mongoose.model<Booking>('Booking', bookingSchema);
