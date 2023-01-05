const mongoose = require("mongoose")


const ClubSchema = new mongoose.Schema({
    leagueIds: [],
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

module.exports = mongoose.model('Club', ClubSchema)