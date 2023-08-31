const jwt = require('jsonwebtoken');// For Create Token 
const {promisify} = require('util');// For Make Functions Async
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');


// Crate Token...
const signToken = id=>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next)=>{

    // Get User Info From Client Side...
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // Create Token For The curent User...
    const token = signToken(newUser._id)

    // Send Response To The Client...
    res.status(201).json({
        status: 'success',
        token: `Bearer ${token}`,
        user: {
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            photo: newUser.photo,
            role: newUser.role
        }
    });
});

exports.login = catchAsync(async(req, res, next)=>{
    const {email, password} = req.body;

    //  Check If Email And Password Exist
    if(!email || !password){
        return next(new AppError('Please Provide Email and Password', 400));
    };

    /* Check If User Exist And Password Is Correct,
        Note: we use .select('+password') to can acces to password of curent user and 
        check if it correct or not*/
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect Email or Password', 401));
    }
    
    const token = signToken(user._id);
    // If Everything Is Ok, Send token To Client...
    res.status(200).json({
        status: 'success',
        token: `Bearer ${token}`,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            photo: user.photo,
            role: user.role
        }
    });
});

exports.protect_ = catchAsync(async(req, res, next)=>{
    // Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new AppError(' You are not logged in, please log in to get access.', 401));
    }

    // verification token
    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // decodedToken={id, iat,and one more}
    
    // Check if  user still exists  
    const curentUser = await User.findById(decodedToken.id);
    if(!curentUser){
        return next(new AppError('The user belonging to this token does not longer exist'));
    }

    // Check if the user changed password after the token was issued
    if(curentUser.changedPasswordAfter(decodedToken.iat)){
        return next(new AppError('The user recently changed password!,please log in again.', 401));
    }
    req.user = curentUser;
    next();
});

exports.restrictTo = (...roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}