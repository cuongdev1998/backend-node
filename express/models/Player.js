const mongoose = require("mongoose")


const PlayerSchema = new mongoose.Schema({
    clubId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Club'
    },
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    number: {
        type: Number,
        min: 1,
        max: 99
    },
    birthDate: {
        type: Date,
        default: Date.now
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

PlayerSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'clubId',
        select: '-__v -createdDate -playerQty -leagueIds'
    })
    next();
})

module.exports = mongoose.model('Player', PlayerSchema)