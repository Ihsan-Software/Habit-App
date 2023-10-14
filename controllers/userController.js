const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerController');

//CURD FUNCTIONS
exports.getUsers = factory.getAll(User)

//exports.getUser = factory.getOne(User,{path: 'Habits Moods Focus'})
exports.getUser = factory.getOne(User)

exports.createUser = factory.createOne(User)

exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)

exports.getME = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}