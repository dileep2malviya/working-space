import mongoose, { Schema } from 'mongoose';

const maintenanceSchema = new Schema(
  {
    space: {
      type: Schema.Types.ObjectId,
      ref: 'Space',
      required: true,
      index: true,
    },

    maintenanceDate: {
      type: Date,
      required: true,
      index: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },
    
    note: {
      type: String,
    },

    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
      index: true,
    }
  },
  { timestamps: true }
);

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);