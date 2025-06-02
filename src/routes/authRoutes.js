import express from 'express';
const router = express.Router();

import {
  register,
  login,
  logout,
  verifyEmail,
  sendOtp,
  resetPassword,
  RegisterInstructor,
  verifyInstructor,
  createAdmin,
  rejectInstructor,
  googleLogin
} from '../controllers/authController.js';


import { adminaccess, protectRoute } from '../authMiddleWare/protectRoute.js';
import { otpRequestLimiter, loginRequestLimiter } from '../authMiddleWare/rateLimit.js';


//general routes to signin and signout 
router.post('/signup', register);
router.post('/verifyEmail', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sendotp', otpRequestLimiter, sendOtp);
router.post('/changepassword', resetPassword);



// Instructor routes
router.post('/instructor-register', RegisterInstructor);
router.post('/verify-instructor', protectRoute, adminaccess, verifyInstructor);
router.post('/reject-instructor', protectRoute, adminaccess, rejectInstructor);


//admin routes 
router.post('/create-admin', protectRoute, adminaccess, createAdmin);

//google Oauth routes 
router.post('/googleLogin', googleLogin);



router.get('/me', protectRoute, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;
