const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'missing name of habit...']
    },

    description: {
        type: String,
        require: [true, 'missing description of habit...'],
        default: ' ',
    },
    icon: {
        type: String,
        require: [true,'missing icon of habit...'],
    },

    counter: {
        type: Number,
        require: [true,'missing counter of habit...'],
        default: 0,
    },

    active: {
        type: Boolean,
        require: [true,'missing active of habit...'],
        default: false
    },
    date: Array,
    appearDays: Array,
    createdAt: 
        {
        type: Date,
        require: [true,'missing createdAt of habit...'],
        default: new Date().toISOString()
    },

    user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            require: [true,'missing userID of habit...']
        }
});
habitSchema.pre(/^find/, function(next){
    this.find().select('-__v')
    next();
})


habitSchema.methods.getTodayHabitsProcess = async function (req, id) {
    
    console.log('start getTodayHabitsProcess')
    result = []
    var currentTime, currentDay;
    if (req.query.specialTime && req.query.specialTime!==undefined) {
        currentTime = req.query.specialTime
        currentDay = req.query.specialDay;
    }
    else {
        currentTime = new Date().toISOString().split('T')[0];    
        var daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        var date = new Date();
        var dayIndex = date.getDay();
        var todayName = daysOfWeek[dayIndex];
        console.log(todayName);
        currentDay = todayName;
    }
    console.log(currentTime);
    console.log(currentDay);
    var activeHabits = await Habit.find({ $and: [{ date:currentTime}, { user: id }]});
    var notActiveHabits = await Habit.find({ $and: [{ date:{$not:{$eq:currentTime}}}, { appearDays: currentDay }, { user: id }]});


    result[0] = notActiveHabits
    result[1] = activeHabits

    return await result
}

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;