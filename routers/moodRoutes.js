const express = require('express');
const moodController = require('../controllers/moodController')
const authController = require('../controllers/authController')

const router = express.Router();

router.use(authController.protect_)

router.route('/getMyMoods/').get(moodController.getMyMoods);
router.route('/createMood').post(moodController.createMood);
router.route('/getWeeklyMoods/:moodDate').get(moodController.getWeeklyMoods);
router.route('/deleteMyMood/:moodID').delete(moodController.deleteMood);
router.use(authController.restrictTo('admin'))

router.route('/getAllMood').get(moodController.getMoods);
router.route('/getMood/:id').get(moodController.getMood)
router.route('/deleteMood/:id').delete(moodController.deleteMood);
router.route('/updateMood/:id').patch(moodController.updateMood);



module.exports = router;