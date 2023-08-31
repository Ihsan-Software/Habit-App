const express = require('express');
userController = require('../controllers/userController')
authController = require('../controllers/authController')

const router = express.Router();

// AuthRouter

router.post('/signup', authController.signup);
router.post('/login', authController.login);


//User Routers RESF
router.route('/').get(authController.protect_, userController.getUsers).post(authController.protect_, authController.restrictTo('admin'), userController.createUser);
router.route('/:id').get(authController.protect_, authController.restrictTo('admin'),  userController.getUser).patch(authController.protect_, authController.restrictTo('admin'),  userController.updateUser)
.delete(authController.protect_, authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;