import mongoose, { Document, Model, Schema } from 'mongoose';

interface InterfaceLocation {
  latitude: number;
  longitude: number;
  date: Date;
}

interface InterfaceLocationDocument extends Document, InterfaceLocation {}

const locationSchema = new Schema<InterfaceLocationDocument>(
  {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists before defining it
const Location: Model<InterfaceLocationDocument> =
  mongoose.models.Location || mongoose.model<InterfaceLocationDocument>('locations', locationSchema);

  export {
    locationSchema,
    Location,
  };
  
  export type {
    InterfaceLocation,
    InterfaceLocationDocument,
  };