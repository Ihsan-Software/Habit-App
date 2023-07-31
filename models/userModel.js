const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        require: [true,'missing name of user...'],
    },
    age: {
        type: Number,
        require: [true,'missing age of user...'],
    }
});


const User = mongoose.model('User', userSchema);
module.exports = User;