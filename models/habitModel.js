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
    
    if (req.query.specialTime && req.query.specialTime!==undefined) {
        currentTime = req.query.specialTime
    }
    else {
        currentTime = new Date().toISOString().split('T')[0];    
    }
    console.log(currentTime)
    var activeHabits = await Habit.find({ $and: [{ date:currentTime}, { user: id }]});
    var notActiveHabits = await Habit.find({ $and: [{ date:{$not:{$eq:currentTime}}}, { user: id }]});


    result[0] = notActiveHabits
    result[1] = activeHabits

    return await result
}

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;