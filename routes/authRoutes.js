const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

const verifyToken = require('../middleware/verify-token');
router.put('/update', verifyToken, authController.updateUser); // added this route for the profile update
router.put('change-password', verifyToken, authController.changePassword); // added this route for the profile update


module.exports = router;