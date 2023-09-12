const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'missing name of habit...']
    },

    discription: {
        type: String,
        require: [true,'missing discription of habit...'],
    },
    icon: {
        type: String,
        require: [true,'missing icon of habit...'],
    },

    color: {
        type: String,
        require: [true,'missing color of habit...'],
    },

    counter: {
        type: Number,
        require: [true,'missing counter of habit...'],
        defult: 0,
    },

    active: {
        type: Boolean,
        require: [true,'missing active of habit...'],
        defult: false
    },
    date: Array,

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
    var activeHabits = await Habit.find({ active: true, user:id});
    var notActiveHabits = await Habit.find({ active: false, user:id});
    result = []

    if (req.params.specialTime && req.params.specialTime!=='empty') {
        currentTime = req.params.specialTime
    }
    else {

        currentTime = new Date().toISOString().split('T')[0];    
    }

    activeHabits.forEach(obj => {
        activeHabitsNotToday = false
        
        obj.date.forEach(date => {
            if (date.split('T')[0] === currentTime) {
                activeHabitsNotToday=true
            }
        })
        if (activeHabitsNotToday) {
            notActiveHabits = notActiveHabits.filter(e=> e.name!=obj.name)
        }
        else {
            activeHabits = activeHabits.filter(e=> e.name!=obj.name)
        }
    })

    if (req.params.specialTime!=='empty') {
        notActiveHabits.forEach(obj => {
            notToday=false
            obj.date.forEach(date => {
                if (date.split('T')[0] === currentTime) {
                    notToday=true
                }
            })
            if (!notToday) {
                notActiveHabits = notActiveHabits.filter(e=> e.name!=obj.name)
            }
        })
    }

    var fakeObj = {
        _id: "111111111111111",
        name: "empty",
        icon: "empty",
        color: "empty",
        counter: 1,
        active: true,
        date: ["0000-00-00T22:29:34.390Z"],
        user: "111"
    }
    if (!activeHabits[0]) 
        activeHabits.push(fakeObj )
    if (!notActiveHabits[0]) 
    notActiveHabits.push(fakeObj)

    result[0] = notActiveHabits
    result[1] = activeHabits

    return await result
}

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;