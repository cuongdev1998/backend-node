const mongoose = require("mongoose")


const ClubSchema = new mongoose.Schema({
    leagueIds: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'League'
        }
    ],
    name: {
        type: String,
        required: [true, 'Club is already exist'],
        min: 6,
        max: 255,
        unique: true
    },
    playerQty: {
        type: Number,
        default: 0
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

ClubSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'leagueIds',
        select: '-__v -createdDate'
    });
    next();
})

module.exports = mongoose.model('Club', ClubSchema)