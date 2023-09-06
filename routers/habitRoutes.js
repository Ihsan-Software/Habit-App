const express = require('express');
const habitController = require('../controllers/habitController')
const authController = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect_)

router.route('/createHabit').post(habitController.createMyHabit, habitController.createHabit);
router.route('/getMyHabits').post(habitController.getMyHabits, habitController.getTodayHabits);
router.route('/deleteMyHabit').post(habitController.deleteMyHabit);
router.route('/checkHabit').post(habitController.check);
router.route('/unCheckHabit').post(habitController.unCheck);
router.route('/getTodayHabits').get(habitController.getTodayHabits);

router.use(authController.restrictTo('admin'))

router.route('/getAllHabit').get(habitController.getHabits);
router.route('/getHabit/:id').get(habitController.getHabit)
router.route('/deleteHabit/:id').delete(habitController.deleteHabit);
router.route('/updateHapit/:id').patch(habitController.updateHabit);



module.exports = router;