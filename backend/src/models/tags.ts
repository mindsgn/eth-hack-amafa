import mongoose, { Document, Model, Schema } from 'mongoose';

interface InterfaceTag {
  name: string,
  description: string,
  color: string,
  owner: string,
}

interface InterfaceTagDocument extends InterfaceTag, Document {
  createdAt: Date,
  updatedAt: Date,
}

const tagSchema = new Schema<InterfaceTagDocument>(
  {
    name: { 
      type: String, 
      required: true,
      default: null
    },
    description: { 
      type: String, 
      required: false,
      default: null
    },
    owner: { 
      type: String, 
      required: true,
      default: null
    },
    color: { 
      type: String, 
      required: false,
      default: "#0dec5d",
    },
  },
  {
    timestamps: true
  }
);

const TagSchema: Model<InterfaceTagDocument> =
  mongoose.models?.tags || mongoose.model<InterfaceTagDocument>('tags', tagSchema);

export {
  TagSchema,
  tagSchema
};

export type {
  InterfaceTag,
  InterfaceTagDocument
};