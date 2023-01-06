const router = require('express').Router();
const authController = require('../controllers/AuthController');

router.post('/signup',  authController.signUp);
router.post('/login',  authController.signIn)

module.exports = router;