const express = require('express');
const habitController = require('../controllers/habitController')
const route = express.Router();

route.route('/getAllHabit').get(habitController.getHabits);
route.route('/getTodayHabits').get(habitController.getTodayHabits);
route.route('/createHabit').post(habitController.createHabit);
route.route('/checkHabit').post(habitController.check);
route.route('/unCheckHabit').post(habitController.unCheck);
route.route('/getHabit/:id').get(habitController.getHabit)
route.route('/deleteHabit/:id').delete(habitController.deleteHabit);
route.route('/updateHapit/:id').patch(habitController.updateHabit);
route.route('/habitDate/:id').get(habitController.getActiveHabits);



module.exports = route;