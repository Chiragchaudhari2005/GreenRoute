const Booking = require('../models/Booking');
const PickupSlot = require('../models/PickupSlot');

// Calculate estimated CO2 saved per waste type
const calculateCarbonSaved = (wasteType, weightKg) => {
  const factors = {
    'Recyclables': 1.8,
    'Organic / Compost': 1.2,
    'Electronic Waste': 2.5,
    'General Waste': 0.3,
    'Hazardous Waste': 2.0,
    'Bulk / Furniture': 1.0,
  };
  const factor = factors[wasteType] || 1.0;
  return Math.round(weightKg * factor * 10) / 10;
};

// @desc    Create a new waste pickup booking
// @route   POST /api/bookings
// @access  Private (Resident)
const createBooking = async (req, res, next) => {
  try {
    const { slotId, wasteType, estimatedWeightKg, address } = req.body;

    if (!slotId || !wasteType || !address || !address.street || !address.city || !address.zipCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide slot ID, waste type, and a valid pickup address.',
      });
    }

    // Atomic overbooking prevention:
    // Update the slot only if bookedCount < maxCapacity and it's active and not disabled
    const updatedSlot = await PickupSlot.findOneAndUpdate(
      {
        _id: slotId,
        isActive: true,
        status: { $in: ['available', 'open'] },
        $expr: { $lt: ['$bookedCount', '$maxCapacity'] },
      },
      {
        $inc: { bookedCount: 1 },
      },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(400).json({
        success: false,
        message: 'The selected pickup slot is no longer available or already fully booked. Please choose another date or time slot.',
      });
    }

    // If slot has reached maxCapacity, mark status as 'full'
    if (updatedSlot.bookedCount >= updatedSlot.maxCapacity) {
      updatedSlot.status = 'full';
      await updatedSlot.save();
    }

    // Generate unique human-readable booking ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    const bookingId = `GR-${datePrefix}-${randomSuffix}`;

    const weight = Number(estimatedWeightKg) || 5;
    const carbonSavedKg = calculateCarbonSaved(wasteType, weight);

    const booking = await Booking.create({
      bookingId,
      user: req.user._id,
      slot: updatedSlot._id,
      wasteType,
      estimatedWeightKg: weight,
      address,
      status: 'Confirmed', // Automatically confirmed when successfully booked into a slot
      assignedCollector: 'GreenRoute Eco-Truck #4',
      carbonSavedKg,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('slot')
      .populate('user', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Waste pickup scheduled successfully! Confirmation ID: ' + bookingId,
      booking: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('slot')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('slot')
      .populate('user', 'name email phone address');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Ensure residents can only view their own booking
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking details.',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (Resident or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    // Role check
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    if (booking.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed pickups cannot be cancelled.',
      });
    }

    booking.status = 'Cancelled';
    booking.cancellationReason = reason || 'Cancelled by resident';
    await booking.save();

    // Release capacity on the slot
    if (booking.slot) {
      const slot = await PickupSlot.findById(booking.slot);
      if (slot) {
        slot.bookedCount = Math.max(0, slot.bookedCount - 1);
        if (slot.status === 'full' && slot.bookedCount < slot.maxCapacity) {
          slot.status = 'available';
        }
        await slot.save();
      }
    }

    const updatedBooking = await Booking.findById(booking._id).populate('slot');

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, wasteType, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (wasteType && wasteType !== 'all') {
      query.wasteType = wasteType;
    }

    if (search) {
      query.$or = [
        { bookingId: { $regex: search, $options: 'i' } },
        { 'address.street': { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('slot')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status & details (Admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, assignedCollector, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const oldStatus = booking.status;

    if (status) {
      booking.status = status;
      // If moving from active to Cancelled, release slot
      if (status === 'Cancelled' && oldStatus !== 'Cancelled') {
        const slot = await PickupSlot.findById(booking.slot);
        if (slot) {
          slot.bookedCount = Math.max(0, slot.bookedCount - 1);
          if (slot.status === 'full' && slot.bookedCount < slot.maxCapacity) {
            slot.status = 'available';
          }
          await slot.save();
        }
      }
      // If un-cancelling back to active, re-occupy slot if possible
      if (oldStatus === 'Cancelled' && status !== 'Cancelled') {
        const slot = await PickupSlot.findById(booking.slot);
        if (slot) {
          slot.bookedCount += 1;
          if (slot.bookedCount >= slot.maxCapacity) {
            slot.status = 'full';
          }
          await slot.save();
        }
      }
    }

    if (assignedCollector) {
      booking.assignedCollector = assignedCollector;
    }

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('slot')
      .populate('user', 'name email phone');

    res.json({
      success: true,
      message: `Booking status updated to ${booking.status}.`,
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};
