const express = require('express');
const userController = require('../controllers/userController')
const route = express.Router();

route.route('/').get(userController.getUsers).post(userController.createUser);
route.route('/:id').get(userController.getUser).delete(userController.deleteUser);
route.route('/createHabits/:id').post(userController.createHabits);
route.route('/date/:id').get(userController.getHabits);



module.exports = route;