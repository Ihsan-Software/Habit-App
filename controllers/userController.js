const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//User
exports.getUsers = catchAsync(async(req, res, next) => {
    
    const users = await User.find();
    res.status(200).json({
        status: 'success',
        requestTime:req.requestTime,
        results:users.length,
        data:{
            users
        }
    });
});

exports.getUser = catchAsync(async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new AppError('No user found with that ID', 404));
    }
        res.status(200).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                user
            }
        });
});

exports.createUser = catchAsync(async(req, res, next) => {
    const newuser = await User.create(req.body);
        res.status(201).json({
            status: 'success',
            createTime:req.requestTime,
            data:{
                user: newuser
            }
        });
});

exports.updateUser =catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body,
        {
            new: true,
            runValidators:true
        });
        if(!user){
            return next(new AppError('No user found with that ID', 404));
        }
    res.status(201).json({
        status: 'success',
        requestTime:req.requestTime,
        results:Users.length,
        data:{
            user
        }
    });
});

exports.deleteUser = catchAsync(async(req, res, next) => {

    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new AppError('No user found with that ID', 404));
    }
        res.status(204).json({
            status: 'success',
            requestTime:req.requestTime,
            data:{
                user:null
            }
        });
});