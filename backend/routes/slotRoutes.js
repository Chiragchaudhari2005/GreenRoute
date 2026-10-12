const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  getAllSlots,
  createSlot,
  updateSlot,
  deleteSlot,
} = require('../controllers/slotController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public or Authenticated can view available slots
router.get('/available', getAvailableSlots);

// Admin routes
router.get('/', protect, authorize('admin'), getAllSlots);
router.post('/', protect, authorize('admin'), createSlot);
router.put('/:id', protect, authorize('admin'), updateSlot);
router.delete('/:id', protect, authorize('admin'), deleteSlot);

module.exports = router;
