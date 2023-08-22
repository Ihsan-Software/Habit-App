const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'missing name of habit...']
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
    date: []
});

habitSchema.methods.getTodayHabitsProcess = async function () {
    
    console.log('start getTodayHabitsProcess')
    var activeHabits = await Habit.find({ active: true });
    var notActiveHabits = await Habit.find({ active: false });
    result=[]

    currentTime = new Date().toISOString();

    activeHabits.forEach(obj => {
        if (obj.date[obj.date.length - 1].split('T')[0] === currentTime.split('T')[0] ||obj.date[0].split('T')[0] === currentTime.split('T')[0]) {
                notActiveHabits = notActiveHabits.filter(e=> e.name!=obj.name)
        }
        else {
            activeHabits = activeHabits.filter(e=> e.name!=obj.name)
        }
    })

    var fakeObj = {
        _id: "111111111111111",
        name: "empty",
        icon: "empty",
        color: "empty",
        counter: 1,
        active: true,
        date: [
            "0000-00-00T22:29:34.390Z"],
        __v: 1
    }
    if (!activeHabits[0]) 
        activeHabits.push(fakeObj )
    else if (!notActiveHabits[0]) 
    notActiveHabits.push(fakeObj)

    result[0] = notActiveHabits
    result[1] = activeHabits

    return await result
}

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;