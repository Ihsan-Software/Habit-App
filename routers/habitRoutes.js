const express = require('express');
const habitController = require('../controllers/habitController')
const authController = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect_)

router.route('/createHabit').post(habitController.createHabit);
// router.route('/getMyHabits/:specialTime').get(habitController.getTodayHabits);
router.route('/checkHabit/:checkHabitID').post(habitController.check);
router.route('/unCheckHabit/:uncheckHabitID').post(habitController.unCheck);
router.route('/getTodayHabits').get(habitController.getTodayHabits);
router.route("/getDetail").get(habitController.getDetail);
router.route('/deleteMyHabit/:habitID').delete(habitController.deleteHabit);

router.use(authController.restrictTo('admin'))

router.route('/getAllHabit').get(habitController.getHabits);
router.route('/getHabit/:id').get(habitController.getHabit)
router.route('/deleteHabit/:id').delete(habitController.deleteHabit);
router.route('/updateHapit/:id').patch(habitController.updateHabit);



module.exports = router;