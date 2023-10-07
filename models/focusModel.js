const mongoose = require('mongoose');

const focusSchema = new mongoose.Schema({
    
    name: {
        type: String,
        require: [true, 'missing name of habit...']
    },

    duration: {
        type: Number,
        require: [true, 'missing focus Duration of focus...']
    },

    date: {
        type: String,
        require: [true, 'missing date of focus...']
    },


    hour: {
        type: String,
        require: [true, 'missing date of focus...']
    },

    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: [true, 'missing userID of focus...']
    }

}
);

focusSchema.pre(/^find/, function(next){
    this.find().select('-__v')
    next();
})

const Focus = mongoose.model('Focus', focusSchema);
module.exports = Focus;