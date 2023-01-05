const mongoose = require("mongoose")
const {Schema} = require("mongoose");


const PlayerSchema = new mongoose.Schema({
    clubId: {
        type: String
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    birthDate: {
        type: Date,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
        min: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Player', PlayerSchema)