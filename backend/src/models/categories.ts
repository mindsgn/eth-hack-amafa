import mongoose, { Document, Model, Schema } from 'mongoose';

interface InterfaceCategory {
  name: string;
  description: string | null;
  color: string,
  owner: string,
}

interface InterfaceCategoryDocument extends InterfaceCategory, Document {
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<InterfaceCategoryDocument>(
  {
    name: { 
      type: String, 
      required: true,
      default: "Other",
    },
    description: { 
      type: String, 
      required: false,
      default: null
    },
    color: { 
      type: String, 
      required: false,
      default: "#0dec5d"
    },
    owner: {
      type: String, 
      required: true,
    }
  },
  {
    timestamps: true
  }
);

const CategorySchema: Model<InterfaceCategoryDocument> =
  mongoose.models?.categories || mongoose.model<InterfaceCategoryDocument>('categories', categorySchema);


export {
  CategorySchema,
  categorySchema
};

export type {
  InterfaceCategory,
};