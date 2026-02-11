const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verify-token');
const {asyncWrapper} = require('../utils/asyncWrapper')

router.post('/signup', asyncWrapper(authController.signup));
router.post('/signin', asyncWrapper(authController.signin));
router.post('/refresh-token', asyncWrapper(authController.refreshToken));
router.post('/signout', asyncWrapper(authController.signout));
router.put('/update', verifyToken, asyncWrapper(authController.updateUser));

module.exports = router;