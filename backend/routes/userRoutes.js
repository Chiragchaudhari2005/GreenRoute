const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserRole } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.put('/:id/role', updateUserRole);

module.exports = router;
