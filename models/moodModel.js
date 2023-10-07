const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'missing name of mood...']
    },

    title: {
        type: String,
        require: [true,'missing title of mood...']
    },
    
    description: {
        type: String,
        require: [true,'missing description of mood...'],
    },

    date: {
        type: String,
        require: [true, 'missing date of mood...']
    },

    photo:{
        type: String,
        default: 'default.jpg'
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true,'missing userID of mood...']
    }

    }
);


moodSchema.pre(/^find/, function(next){
    this.find().select('-__v')
    next();
})
// res as week

const Mood = mongoose.model('Mood', moodSchema);
module.exports = Mood;