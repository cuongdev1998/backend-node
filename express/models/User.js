const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        max: 255,
        min: 6,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        max: 1024,
        min: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    passwordResetToken: String,
    passwordResetTokenExpired: Date,
    createdDate: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', async function(next){
    this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);

}

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken)
    this.passwordResetTokenExpired = Date.now() + 600000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema)