const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('../controllers/handlerController');

//CURD FUNCTIONS
exports.getUsers = factory.getAll(User)

exports.getUser = factory.getOne(User,{path: 'Habits'})

exports.createUser = factory.createOne(User)

exports.updateUser = factory.updateOne(User)

exports.deleteUser = factory.deleteOne(User)

exports.getME = (req, res, next) => {
    req.params.id = req.user.id;
    next();
}