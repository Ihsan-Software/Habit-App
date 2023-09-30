const Focus = require('../models/focusModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

//CURD FUNCTIONS
exports.getFocuss = factory.getAll(Focus)

exports.getFocus = factory.getOne(Focus)

exports.createFocus = factory.createOne(Focus)

exports.updateFocus = factory.updateOne(Focus)

exports.deleteFocus = factory.deleteOne(Focus)


exports.getMyFocus = catchAsync(async (req, res, next) => {
    
    const focus = await Focus.find({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        focusCounter:focus.length,
        focus
    });
});