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


import { adminaccess, protectRoute } from '../middleWare/authMiddleWare/protectRoute.js';
import { otpRequestLimiter, loginRequestLimiter } from '../middleWare/authMiddleWare/rateLimit.js';

import nosqlSanitizer from '../middleWare/authMiddleWare/injectionProtect.js';
router.use(nosqlSanitizer);

//general routes to signin and signout 
router.post('/signup', register);
router.post('/verifyEmail', verifyEmail);
router.post('/login', login);
router.post('/logout', logout);
router.post('/sendOtp', otpRequestLimiter, sendOtp);
router.post('/changePassword', resetPassword);



// Instructor routes
router.post('/instructorRegister', RegisterInstructor);
router.post('/verifyInstructor', protectRoute, adminaccess, verifyInstructor);
router.post('/rejectInstructor', protectRoute, adminaccess, rejectInstructor);


//admin routes 
router.post('/createAdmin', protectRoute, adminaccess, createAdmin);

//google Oauth routes 
router.post('/googleLogin', googleLogin);



router.get('/me', protectRoute, async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;
