const router = require('express').Router();
const authController = require('../controllers/AuthController');

router.post('/signup',  authController.signUp);
router.post('/login',  authController.signIn)
router.post('/forgot-password',  authController.forgotPassword)
router.patch('/reset-password/:token',  authController.resetPassword)
router.patch('/change-password', authController.protect, authController.changePassword)

module.exports = router;