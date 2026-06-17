import express from 'express';
import { registerUser, loginUser, getUserProfile, googleLogin, demoGoogleLogin } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/demo-google', demoGoogleLogin);
router.get('/profile', protect, getUserProfile);

export default router;
