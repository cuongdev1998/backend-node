const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

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
    createdDate: {
        type: Date,
        default: Date.now
    }
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);

}

module.exports = mongoose.model('User', userSchema)