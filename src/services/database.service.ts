import mongoose from 'mongoose';

mongoose.connect(process.env.DATABASE as string);

export const database = mongoose.connection;
