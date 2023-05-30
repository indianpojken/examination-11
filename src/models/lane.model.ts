import mongoose from 'mongoose';

interface Lane {}

const laneSchema = new mongoose.Schema<Lane>({});

export const laneModel = mongoose.model<Lane>('Lane', laneSchema);
