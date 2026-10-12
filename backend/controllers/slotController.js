const PickupSlot = require('../models/PickupSlot');
const Booking = require('../models/Booking');

// @desc    Get all available pickup slots (upcoming & not fully booked)
// @route   GET /api/slots/available
// @access  Public or Authenticated
const getAvailableSlots = async (req, res, next) => {
  try {
    const { zone, date } = req.query;
    const query = {
      isActive: true,
      status: { $in: ['available', 'open'] },
      $expr: { $lt: ['$bookedCount', '$maxCapacity'] },
    };

    if (zone) {
      query.zone = zone;
    }

    if (date) {
      query.date = date;
    }

    const slots = await PickupSlot.find(query)
      .sort({ date: 1, startTime: 1 })
      .lean();

    // Attach remaining capacity helper
    const formatted = slots.map((slot) => ({
      ...slot,
      remainingCapacity: Math.max(0, slot.maxCapacity - slot.bookedCount),
    }));

    res.json({
      success: true,
      count: formatted.length,
      slots: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pickup slots (Admin)
// @route   GET /api/slots
// @access  Private/Admin
const getAllSlots = async (req, res, next) => {
  try {
    const { date, status, zone } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (status) filter.status = status;
    if (zone) filter.zone = zone;

    const slots = await PickupSlot.find(filter).sort({ date: 1, startTime: 1 });

    const formatted = slots.map((s) => ({
      ...s.toObject(),
      remainingCapacity: Math.max(0, s.maxCapacity - s.bookedCount),
    }));

    res.json({
      success: true,
      count: formatted.length,
      slots: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new pickup slot (Admin)
// @route   POST /api/slots
// @access  Private/Admin
const createSlot = async (req, res, next) => {
  try {
    const { date, startTime, endTime, label, maxCapacity, zone, isActive } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide date, start time, and end time.',
      });
    }

    const generatedLabel = label || `${startTime} - ${endTime}`;

    // Check if slot already exists for that day, time, and zone
    const existingSlot = await PickupSlot.findOne({
      date,
      startTime,
      endTime,
      zone: zone || 'Central Metro Zone',
    });

    if (existingSlot) {
      return res.status(400).json({
        success: false,
        message: 'A pickup slot for this date, time window, and zone already exists.',
      });
    }

    const slot = await PickupSlot.create({
      date,
      startTime,
      endTime,
      label: generatedLabel,
      zone: zone || 'Central Metro Zone',
      maxCapacity: Number(maxCapacity) || 5,
      bookedCount: 0,
      status: 'available',
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: 'Pickup slot created successfully.',
      slot,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a pickup slot (Admin)
// @route   PUT /api/slots/:id
// @access  Private/Admin
const updateSlot = async (req, res, next) => {
  try {
    const { maxCapacity, status, isActive, zone, label } = req.body;
    const slot = await PickupSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Pickup slot not found.',
      });
    }

    if (maxCapacity !== undefined) {
      const cap = Number(maxCapacity);
      if (cap < slot.bookedCount) {
        return res.status(400).json({
          success: false,
          message: `Cannot set capacity to ${cap} because ${slot.bookedCount} bookings already exist for this slot.`,
        });
      }
      slot.maxCapacity = cap;
      if (slot.bookedCount >= cap) {
        slot.status = 'full';
      } else if (slot.status === 'full') {
        slot.status = 'available';
      }
    }

    if (status !== undefined) slot.status = status;
    if (isActive !== undefined) slot.isActive = isActive;
    if (zone !== undefined) slot.zone = zone;
    if (label !== undefined) slot.label = label;

    await slot.save();

    res.json({
      success: true,
      message: 'Pickup slot updated successfully.',
      slot,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a pickup slot (Admin)
// @route   DELETE /api/slots/:id
// @access  Private/Admin
const deleteSlot = async (req, res, next) => {
  try {
    const slot = await PickupSlot.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({
        success: false,
        message: 'Pickup slot not found.',
      });
    }

    // Check if slot has active bookings
    const activeBookings = await Booking.countDocuments({
      slot: slot._id,
      status: { $in: ['Pending', 'Confirmed', 'In Progress'] },
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete slot because it has ${activeBookings} active booking(s). Cancel them first or mark the slot as disabled.`,
      });
    }

    await slot.deleteOne();

    res.json({
      success: true,
      message: 'Pickup slot deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableSlots,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
};
