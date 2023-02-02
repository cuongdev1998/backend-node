const router = require('express').Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getAllUsers
    )
router
    .route('/:id')
    .get( authController.protect, userController.getUser)
    .patch(authController.protect, userController.updateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.removeUser
    );


module.exports = router