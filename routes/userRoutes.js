const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/auth'); 

// Apply verifyToken middleware to all routes in this router
router.use(verifyToken);

// Route to get all users - only accessible by admin
router.get('/', verifyAdmin, userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

// Update user by ID
router.put('/:id', userController.updateUser);

// Delete user by ID
router.delete('/:id', userController.deleteUser);

// Verify OTP
// router.post('/verify-otp', userController.verifyOtp);

module.exports = router;
