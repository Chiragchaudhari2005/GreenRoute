const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    slot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PickupSlot',
      required: true,
      index: true,
    },
    wasteType: {
      type: String,
      enum: [
        'General Waste',
        'Recyclables',
        'Organic / Compost',
        'Electronic Waste',
        'Hazardous Waste',
        'Bulk / Furniture',
      ],
      required: [true, 'Waste type is required'],
    },
    estimatedWeightKg: {
      type: Number,
      default: 5,
      min: [1, 'Estimated weight must be at least 1 kg'],
      max: [500, 'Weight cannot exceed 500 kg per booking'],
    },
    address: {
      street: { type: String, required: [true, 'Street address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      zipCode: { type: String, required: [true, 'Zip code is required'] },
      landmark: { type: String, default: '' },
      specialInstructions: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    assignedCollector: {
      type: String,
      default: 'GreenRoute Eco-Truck #4',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    carbonSavedKg: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
