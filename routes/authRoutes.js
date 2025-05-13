const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verify-token');

router.post('/signup', authController.signup);
router.post('/signin', authController.signin);
router.post('/refresh-token', authController.refreshToken);
router.post('/signout', authController.signout);
router.put('/update', verifyToken, authController.updateUser);

module.exports = router;