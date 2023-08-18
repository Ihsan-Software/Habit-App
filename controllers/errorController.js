const AppError = require('../utils/appError');

/* Error Function From Mongoose...
    1) Invalid ID Format like rrrrrrr or fffffffff */
const handleCastErrorDB = err =>{

    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}

//  2) Douplicate Fields Like Same Name
const handleDuplicateFieldErrorDB = err =>{
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate Fields Value: ${value}, please use other value.`;
    return new AppError(message, 400);
}

//  3) Validation Error Like Short Name 
const handleValidationErrorDB = err =>{
    const errors = Object.values(err.errors).map(err =>err.message);

    const message = `Invalid Input Data In: ${errors.join('. ')}`;
    return new AppError(message, 400);
}
// End Error Function From Mongoose... 

/* Error From JWT
    1) Invaed Token */

    const handleJWTError = err=> new AppError('Invalid token, please log in again!',401)

    // Expires Token
    const handleTokenExpiredError = err=> new AppError('Expire token, please log in again!',401)
// Error message To  Development Enviroment
const sendErrorDev = (err, res)=>{
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack:err.stack
    });
}

// Error message To  Production Enviroment
const sendErrorProd = (err, res)=>{
    // Operations Error
    if(err.isOperational){
        
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    // Programing Error
    else{
        console.error('Error...🧨:', err)
        res.status(500).json({
            status: 'error',
            message: 'Something is wrong...🧨'
        });
    }
}


/* About This Functions:
    this functions take all error requirement(from AppError class, aysnc functions, DB)
    and show the error for the user in nice format
*/

module.exports = (err, req, res, next) => {
    console.log('Welcome In Global Error Handling Middleware Function...💥');
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error💥';

    if(process.env.NODE_ENV === 'development'){
        sendErrorDev(err, res);
    }
    
    else if(process.env.NODE_ENV === 'production'){

        // DB Error
        if(err.name === 'CastError')
            err = handleCastErrorDB(err);
        if(err.code === 11000)
            err = handleDuplicateFieldErrorDB(err);
        if(err.name === 'ValidationError')
            err = handleValidationErrorDB(err);
        // JWT Error
        if(err.name === 'JsonWebTokenError')
            err = handleJWTError(err);
        if(err.name === 'TokenExpiredError')
            err = handleTokenExpiredError(err);
        sendErrorProd(err, res);
    }
};

