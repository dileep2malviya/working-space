import mongoose, { Schema } from 'mongoose';

const spaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    type: {
      type: String,
      required: true,
      enum: ["Desk", "Meeting Room"],
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

spaceSchema.index(
  { name: 1, type: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } }
);

export const Space = mongoose.model("Space", spaceSchema)
