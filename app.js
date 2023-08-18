const express = require('express');
const morgan = require('morgan');

// req from my modules
const userRouter = require('./routers/userRoutes');
const habitRouter = require('./routers/habitRoutes');
const AppError = require('./utils/appError');
const globalHandlingError = require('./controllers/errorController');

// Middleware Functions...
// For Accept Input From User And Formated It As JSON... 

const app = express();

app.use(express.json());
app.use(express.static(`{${__dirname}/public}`));
if (process.env.NODE_ENV === 'development') { app.use(morgan('dev')) };


app.use((req, res, next) => {
    console.log('Hello In Middlewear Functions... 👋');
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})

// Routers
app.use('/api/v1/users',userRouter)
app.use('/api/v1/habits', habitRouter)

app.all('*', (req, res, next) => {

    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalHandlingError)
module.exports = app;