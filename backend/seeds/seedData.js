require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const PickupSlot = require('../models/PickupSlot');
const Booking = require('../models/Booking');

const seedData = async (shouldExit = true) => {
  try {
    console.log('[GreenRoute Seed] Connecting to database...');
    await connectDB();

    console.log('[GreenRoute Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      PickupSlot.deleteMany({}),
      Booking.deleteMany({}),
    ]);

    console.log('[GreenRoute Seed] Creating default users...');
    const adminUser = await User.create({
      name: 'Elena Rostova (Lead Coordinator)',
      email: 'admin@greenroute.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1 (555) 019-2834',
      address: {
        street: '100 Municipal Eco Way',
        city: 'Greenville',
        state: 'CA',
        zipCode: '94016',
        landmark: 'GreenRoute Central Operations Depot',
      },
    });

    const residentUser1 = await User.create({
      name: 'Marcus Vance',
      email: 'resident@greenroute.com',
      password: 'resident123',
      role: 'resident',
      phone: '+1 (555) 742-8819',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Greenville',
        state: 'CA',
        zipCode: '94016',
        landmark: 'Near Oak Park Community Center',
      },
    });

    const residentUser2 = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@greenroute.com',
      password: 'password123',
      role: 'resident',
      phone: '+1 (555) 381-9921',
      address: {
        street: '124 Conch Street',
        city: 'Greenville',
        state: 'CA',
        zipCode: '94016',
        landmark: 'Blue Horizon Apartments, Apt 4B',
      },
    });

    console.log('[GreenRoute Seed] Generating upcoming pickup slots...');
    const baseDate = new Date();
    const createdSlots = [];

    // Create slots for the next 7 days
    const slotTimes = [
      { start: '08:00 AM', end: '10:00 AM', label: 'Morning Slot (08:00 AM - 10:00 AM)' },
      { start: '10:30 AM', end: '12:30 PM', label: 'Midday Slot (10:30 AM - 12:30 PM)' },
      { start: '01:30 PM', end: '03:30 PM', label: 'Afternoon Slot (01:30 PM - 03:30 PM)' },
      { start: '04:00 PM', end: '06:00 PM', label: 'Evening Slot (04:00 PM - 06:00 PM)' },
    ];

    for (let dayOffset = 0; dayOffset <= 6; dayOffset++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + dayOffset);
      const dateString = d.toISOString().split('T')[0];

      for (const time of slotTimes) {
        const slot = await PickupSlot.create({
          date: dateString,
          startTime: time.start,
          endTime: time.end,
          label: time.label,
          zone: dayOffset % 2 === 0 ? 'Central Metro Zone' : 'North Hills District',
          maxCapacity: 6,
          bookedCount: 0,
          status: 'available',
          isActive: true,
        });
        createdSlots.push(slot);
      }
    }

    console.log(`[GreenRoute Seed] Created ${createdSlots.length} pickup slots.`);

    console.log('[GreenRoute Seed] Seeding sample bookings...');
    const sampleBookings = [
      {
        bookingId: 'GR-202610-1011',
        user: residentUser1._id,
        slot: createdSlots[0]._id,
        wasteType: 'Recyclables',
        estimatedWeightKg: 12,
        address: {
          street: residentUser1.address.street,
          city: residentUser1.address.city,
          zipCode: residentUser1.address.zipCode,
          landmark: residentUser1.address.landmark,
          specialInstructions: 'Bins placed beside front porch gate.',
        },
        status: 'Confirmed',
        assignedCollector: 'GreenRoute Eco-Truck #4',
        carbonSavedKg: 21.6,
      },
      {
        bookingId: 'GR-202610-1012',
        user: residentUser1._id,
        slot: createdSlots[2]._id,
        wasteType: 'Organic / Compost',
        estimatedWeightKg: 8,
        address: {
          street: residentUser1.address.street,
          city: residentUser1.address.city,
          zipCode: residentUser1.address.zipCode,
          landmark: residentUser1.address.landmark,
          specialInstructions: 'Compost pail is sealed with green biodegradable liner.',
        },
        status: 'In Progress',
        assignedCollector: 'GreenRoute Bio-Unit #2',
        carbonSavedKg: 9.6,
      },
      {
        bookingId: 'GR-202610-1013',
        user: residentUser2._id,
        slot: createdSlots[1]._id,
        wasteType: 'Electronic Waste',
        estimatedWeightKg: 15,
        address: {
          street: residentUser2.address.street,
          city: residentUser2.address.city,
          zipCode: residentUser2.address.zipCode,
          landmark: residentUser2.address.landmark,
          specialInstructions: 'Two broken CRT monitors and old desktop tower.',
        },
        status: 'Confirmed',
        assignedCollector: 'GreenRoute Tech-Recovery #1',
        carbonSavedKg: 37.5,
      },
      {
        bookingId: 'GR-202610-1008',
        user: residentUser1._id,
        slot: createdSlots[4]._id,
        wasteType: 'Bulk / Furniture',
        estimatedWeightKg: 35,
        address: {
          street: residentUser1.address.street,
          city: residentUser1.address.city,
          zipCode: residentUser1.address.zipCode,
          landmark: residentUser1.address.landmark,
          specialInstructions: 'Dismantled wooden dining table and two chairs.',
        },
        status: 'Completed',
        assignedCollector: 'GreenRoute Heavy-Haul #7',
        carbonSavedKg: 35.0,
      },
    ];

    for (const b of sampleBookings) {
      await Booking.create(b);
      // Increment bookedCount on the corresponding slot
      await PickupSlot.findByIdAndUpdate(b.slot, { $inc: { bookedCount: 1 } });
    }

    console.log('[GreenRoute Seed] Database seeded successfully!');
    console.log('---------------------------------------------------------');
    console.log('Sample Accounts:');
    console.log('Admin:    admin@greenroute.com    / admin123');
    console.log('Resident: resident@greenroute.com / resident123');
    console.log('Resident: sarah@greenroute.com    / password123');
    console.log('---------------------------------------------------------');

    if (shouldExit) {
      await disconnectDB();
      process.exit(0);
    }
  } catch (err) {
    console.error('[GreenRoute Seed Error]:', err);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
