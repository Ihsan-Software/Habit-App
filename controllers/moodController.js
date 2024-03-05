const Mood = require('../models/moodModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId; 
//CURD FUNCTIONS
exports.getMoods = factory.getAll(Mood)

exports.getMood = factory.getOne(Mood)

exports.createMood = factory.createOne(Mood)

exports.updateMood = factory.updateOne(Mood)

exports.deleteMood = factory.deleteOne(Mood)


exports.getMyMoods = catchAsync(async (req, res, next) => {
    
    const moods = await Mood.find({ user: req.user.id });

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        moodsCounter:moods.length,
        moods
    });
});


exports.getWeeklyMoods = catchAsync(async (req, res, next) => {
    const year = req.params.moodDate.split('-')[0]
    const month = req.params.moodDate.split('-')[1] 
    const day = req.params.moodDate.split('-')[2] * 1 + 6
    let end = ''
    if (day <= 9){
        end= `0${day}`
    }
    else{
        end= `${day}`
    }
    
    console.log(end)
    const mood = await Mood.aggregate([
        {
            $match: {
                
                $and: [{user: new ObjectId(`${req.user.id}`)},{date: { $gte: req.params.moodDate }}, {date: { $lte: `${year}-${month}-${end}` }}]
            }
        },
        {
            $project:{
                __v:0
                }
        }
    ])

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        moodsCounter:mood.length,
        mood
        
    });
});