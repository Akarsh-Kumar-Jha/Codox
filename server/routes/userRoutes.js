const express = require('express');
const { sendOtp, verifyOtp, signupWithGoogle, googleLogin, getUserDet, login } = require('../controllers/auth');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/send-otp',sendOtp);
router.post('/verify-otp',verifyOtp);
router.post('/signup/google',signupWithGoogle);
router.post('/login/google',googleLogin);
router.post('/login',login);
router.post('/get-user',authMiddleware,getUserDet);

module.exports = router