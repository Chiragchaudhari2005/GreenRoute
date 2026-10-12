const mongoose = require('mongoose');

const pickupSlotSchema = new mongoose.Schema(
  {
    date: {
      type: String, // Stored as ISO YYYY-MM-DD for deterministic queries
      required: [true, 'Slot date is required'],
      index: true,
    },
    startTime: {
      type: String, // e.g. "08:00 AM"
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String, // e.g. "10:00 AM"
      required: [true, 'End time is required'],
    },
    label: {
      type: String, // e.g. "Morning Slot (08:00 AM - 10:00 AM)"
      required: true,
    },
    zone: {
      type: String,
      default: 'Central Metro Zone',
    },
    maxCapacity: {
      type: Number,
      required: true,
      default: 5,
      min: [1, 'Capacity must be at least 1'],
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'full', 'disabled'],
      default: 'available',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound index to avoid duplicate slot definitions on the same day & time
pickupSlotSchema.index({ date: 1, startTime: 1, endTime: 1, zone: 1 }, { unique: true });

module.exports = mongoose.model('PickupSlot', pickupSlotSchema);
