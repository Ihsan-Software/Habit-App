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

// exports.forgetPassword = catchAsync(async(req,res,next) => {
//     //1) Chech email from user  
//     const user = await User.findOne({ email: req.body.email });
//     if(!user){
//         return next(new AppError('there is no user with that email!!',404));
//     }
//     //  Get random token to send it to user
//     const restToken = user.createPasswordResetToken();
//     await user.save({validateBeforeSave:false});

//     // Send email
//     const resetURL =`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${restToken}`;

//     const message = `Forget your passwoed? Submit a Patch requset with your new password and password confirm to ${resetURL}.\nIf you did not forget your password, please ignore this email!;`
//     try{
//         await sendEmail({
//             email: user.email,
//             subject:'Your password reset token(valid for 10 min)',
//             message
//         })
    
//         res.status(200).json({
//             status:'success',
//             message:'Token send successfully to this email address'
//         });
//     }catch(err){
//         user.passwordResetToken = undefined;
//         user.passwordResetExpires = undefined;
//         await user.save({validateBeforeSave:false});
//         return next(new AppError('maybe you late,try again',500));

//     }
    

// });


// exports.resetPassword = catchAsync(async(req,res,next) => {

//     //1) get user based on token

//     const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//     const user = await User.findOne({passwordResetToken:hashToken,passwordResetExpires: {$gt:Date.now()}
//     })

//     //2) if token has not expired,and user then set new password
//     console.log(`in reset${user}`)

//     if(!user){
//         return next(new AppError('Token is invalid or expired',400));
//     }
//     user.password = req.body.password;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();
//     //3) update changedPassowrdAt for the user

//     //4) log the user in ,send JWT
//     const token = signToken(user._id);
//     // If Everything Is Ok, Send token To Client...
//     res.status(200).json({
//         status: 'success',
//         token
//     });
// });