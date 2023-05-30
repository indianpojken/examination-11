import mongoose from 'mongoose';

interface Booking {
  email: string;
  dateTime: Date;
  participants: number;
  shoes: number[];
  lanes: mongoose.Types.ObjectId[];
}

const bookingSchema = new mongoose.Schema<Booking>({
  email: { type: String, required: true },
  dateTime: { type: Date, required: true },
  participants: { type: Number, required: true },
  shoes: [{ type: Number, required: true }],
  lanes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lane',
      required: true,
      unique: true,
    },
  ],
});

export const bookingModel = mongoose.model<Booking>('Booking', bookingSchema);
