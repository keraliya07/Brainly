import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  type: "document" | "tweet" | "youtube" | "link";
  link: string;
  title: string;
  details?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["document", "tweet", "youtube", "link"],
      required: [true, "Content type is required"],
    },
    link: {
      type: String,
      required: [true, "Link is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [50, "Title cannot exceed 50 characters"],
    },
    details: {
      type: String,
      trim: true,
      maxlength: [2000, "Details cannot exceed 2000 characters"],
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Index for faster queries
ContentSchema.index({ userId: 1, createdAt: -1 });
ContentSchema.index({ tags: 1 });

export default mongoose.model<IContent>("Content", ContentSchema);

