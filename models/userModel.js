const mongoose = require('mongoose');
const validator = require('validator')

const bcrypt = require('bcryptjs'); // for encrypt passowrd from user and compare when login...


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        require:[true, 'Enter Your Name']
    },

    email: {
        type: String,
        unique: true,
        require: [true,'Enter Your Email'],
        lowercase:true,
        validate: [validator.isEmail, 'Enter Your Valid Email']
    },

    photo:{
        type: String,
        default: 'default.jpg'
    },

    password:{
        type: String,
        require: [true,'Enter Your Password'],
        minlength:8,
        select:false
    },
    role:{
        type: String,
        enum:['user', 'guest', 'admin'],
        default: 'user'
    },

});
// Middleware Functions(document) For Encrypt Passowrd...
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    next();
});

// Instance Method For Curent Document(user)...

// Use it for login ot check if input password is same password stored in DB
userSchema.methods.correctPassword = async function( candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
};

// Use it for protect_ to check if user change password after token is created
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedPasswordTime = parseInt(this.passwordChangedAt.getTime()/1000, 10);
        return JWTTimestamp<changedPasswordTime
    }
    return false;
}

// For create randome text snd send it to user to reset token
// userSchema.methods.createPasswordResetToken = function() {
//     const randomToken = crypto.randomBytes(32).toString('hex');

//     this.passwordResetToken = crypto.createHash('sha256').update(randomToken).digest('hex');
//     this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

//     const resetToken = {
//         randomToken,
//         passwordResetToken:this.passwordResetToken,
//         passwordResetExpires:this.passwordResetExpires
//     }
//     console.log(resetToken,this.passwordResetToken )
//     return randomToken;
// };

// For change passwordChangedAt from reset token
// userSchema.pre('save', function(next){
//     if(this.isModified('password')|| this.isNew)return next();
//     this.passwordChangedAt = Date.now()-1000;
//     next();
// })

const User = mongoose.model('User',userSchema);
module.exports = User;