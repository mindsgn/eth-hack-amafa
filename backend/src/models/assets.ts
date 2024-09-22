import mongoose, { Document, Model, Schema } from 'mongoose';
// import { InterfaceCategory, CategorySchema, } from './categories';
import { tagSchema, InterfaceTag } from './tags';
import { categorySchema, InterfaceCategory } from './categories';

export interface InterfaceAssets {
  name: string;
  description: string | null;
  images: string[];
  currency: 'ZAR';
  value: number;
  category:  InterfaceCategory | null;
  receipt: string[] | null;
  tags: InterfaceTag[] | null,
  custodian: string,
  owner: string;
  locations: string[] | null;
}

export interface InterfaceAssetsDocument extends InterfaceAssets, Document {
  createdAt: Date;
  updatedAt: Date;
}

const assetsSchema = new Schema<InterfaceAssetsDocument>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false,
      default: null
    },
    images: {
      type: [String],
      required: true,
      default: null
    },
    currency: {
      type: String,
      required: true,
      enum: ['ZAR'],
      default: 'ZAR'
    },
    value: {
      type: Number,
      default: 0,
      required: true
    },
    category: {
      type: categorySchema,
      required: true,
      default: null
    },
    tags: {
      type: [tagSchema],
      required: true,
      default: null
    },
    receipt: {
      type: [String],
      required: false,
      default: null
    },
    owner: {
      type: String,
      required: true
    },
    custodian: {
      type: String,
      required: false,
      default: null
    },
    locations: [String]
  },
  {
    timestamps: true
  }
);

const Assets: Model<InterfaceAssetsDocument> =
  mongoose.models?.assets || mongoose.model<InterfaceAssetsDocument>('asset', assetsSchema);

export default Assets;
