const express = require('express');
const habitController = require('../controllers/habitController')
const authController = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect_)

router.route('/createHabit').post(habitController.createMeHabit, habitController.createHabit);
router.route('/getTodayHabits').get(habitController.getTodayHabits);
router.route('/checkHabit').post(habitController.check);
router.route('/unCheckHabit').post(habitController.unCheck);
router.route('/deleteHabit/:id').delete(habitController.deleteHabit);

router.use(authController.restrictTo('admin'))

router.route('/getAllHabit').get(habitController.getHabits);
router.route('/getHabit/:id').get(habitController.getHabit)
router.route('/updateHapit/:id').patch(habitController.updateHabit);
router.route('/habitDate/:id').get(habitController.getActiveHabits);



module.exports = router;