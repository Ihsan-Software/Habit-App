const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'missing name of habit...'],
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


const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit;