import mongoose from 'mongoose';

export interface Lane {
  number: number;
}

const laneSchema = new mongoose.Schema<Lane>({
  number: { type: Number, required: true, unique: true },
});

export const laneModel = mongoose.model<Lane>('Lane', laneSchema);
