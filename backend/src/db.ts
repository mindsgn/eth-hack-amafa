import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

mongoose.Promise = global.Promise;
dotenv.config();

const connectToDatabase = async (): Promise<void> => {
  const options: ConnectOptions = { };

  await mongoose.connect(`${process.env.MONGODB_URI}`, options);
};

export { connectToDatabase };
