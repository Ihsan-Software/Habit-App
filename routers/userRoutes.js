const express = require('express');
userController = require('../controllers/userController')
authController = require('../controllers/authController')

const router = express.Router();

// AuthRouter

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//User Routers RESF
router.use(authController.protect_)
router.get('/myInformations', userController.getME, userController.getUser)
router.post('/updateMyPassword', authController.updateMyPassword)

router.use(authController.restrictTo('admin'))
router.route('/').get(userController.getUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;