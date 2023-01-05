const mongoose = require("mongoose")


const LeagueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('League', LeagueSchema)