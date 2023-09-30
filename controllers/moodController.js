const Mood = require('../models/moodModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerController');

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
    
    let mood = await Mood.find({ user: req.user.id });
    const userDate = req.params.moodDate.split('-')
    limitDate = parseInt(userDate[2]) + 7
    console.log(userDate)

    console.log(limitDate)
    mood.forEach(ele => {

        findElement = false
        moodDate = ele.date.split('T')[0].split('-')
        console.log(moodDate)
        if ((moodDate[0] === userDate[0] && moodDate[1] === userDate[1]) &&(parseInt(moodDate[2]) >= parseInt(userDate[2]) && moodDate[2]< limitDate)) {
            findElement = true
        }
        if (!findElement) {
            console.log('ggg')
            mood = mood.filter(e =>e._id !=ele._id)
        }
    })

    res.status(200).json({
        status: 'success',
        requestTime: req.requestTime,
        moodsCounter:mood.length,
        data: {
            mood
        }
    });
});

