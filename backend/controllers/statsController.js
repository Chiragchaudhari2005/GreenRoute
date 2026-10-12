const Booking = require('../models/Booking');
const PickupSlot = require('../models/PickupSlot');
const User = require('../models/User');

// @desc    Get dashboard metrics and impact stats
// @route   GET /api/stats/summary
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalUsers,
        totalSlots,
        aggregateData,
      ] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'Pending' }),
        Booking.countDocuments({ status: 'Confirmed' }),
        Booking.countDocuments({ status: 'Completed' }),
        User.countDocuments({ role: 'resident' }),
        PickupSlot.countDocuments(),
        Booking.aggregate([
          { $match: { status: { $ne: 'Cancelled' } } },
          {
            $group: {
              _id: null,
              totalWeight: { $sum: '$estimatedWeightKg' },
              totalCarbonSaved: { $sum: '$carbonSavedKg' },
            },
          },
        ]),
      ]);

      const wasteBreakdown = await Booking.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: '$wasteType',
            count: { $sum: 1 },
            weight: { $sum: '$estimatedWeightKg' },
          },
        },
      ]);

      const totals = aggregateData[0] || { totalWeight: 0, totalCarbonSaved: 0 };

      return res.json({
        success: true,
        stats: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          totalUsers,
          totalSlots,
          totalWasteCollectedKg: totals.totalWeight,
          totalCarbonSavedKg: totals.totalCarbonSaved,
          wasteBreakdown,
        },
      });
    }

    // Resident stats
    const residentId = req.user._id;
    const [
      myTotalBookings,
      myUpcomingBookings,
      myCompletedBookings,
      residentAggregate,
    ] = await Promise.all([
      Booking.countDocuments({ user: residentId }),
      Booking.countDocuments({
        user: residentId,
        status: { $in: ['Pending', 'Confirmed', 'In Progress'] },
      }),
      Booking.countDocuments({ user: residentId, status: 'Completed' }),
      Booking.aggregate([
        { $match: { user: residentId, status: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: null,
            totalWeight: { $sum: '$estimatedWeightKg' },
            totalCarbonSaved: { $sum: '$carbonSavedKg' },
          },
        },
      ]),
    ]);

    const resTotals = residentAggregate[0] || { totalWeight: 0, totalCarbonSaved: 0 };

    res.json({
      success: true,
      stats: {
        totalBookings: myTotalBookings,
        upcomingPickups: myUpcomingBookings,
        completedPickups: myCompletedBookings,
        totalRecycledKg: resTotals.totalWeight,
        totalCarbonSavedKg: resTotals.totalCarbonSaved,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
