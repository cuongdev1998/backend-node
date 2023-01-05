const Club = require("../models/Club");
const {updateClubValidation} = require("../validation");
const {ObjectId} = require("mongodb");

//create a new league

exports.createClub = async (req, res) => {
    try {
        const newClub = new Club({
            leagueIds: req.body.leagueIds,
            name: req.body.name,
        })
        const createdClub = await newClub.save();
        res.status(201).json({
            status: 'success',
            data: {
                club: createdClub
            }

        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error

        })
    }
}


exports.getAllClubs = async (req, res) => {
    try {
        const queryObj = {...req.query};
        const excludeFields = ['playerQty', 'page', 'limit', 'sort'];

        excludeFields.forEach(el => delete queryObj[el]);
        const allClubs = await Club.find(queryObj);
        res.status(200).json({
            status: 'success',
            count: allClubs.length,
            data: {
                club: allClubs
            }

        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error

        })
    }
}
exports.getClub = async (req, res) => {
    try {
        const allClubs = await Club.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                club: allClubs
            }

        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error

        })
    }
}
exports.updateClub = async (req, res) => {
    //checking if exist club in the db
    // const clubExist = await Club.findOne({_id: new ObjectId(req.body.id)})
    // if (!clubExist) res.status(400).send("Club is not exist");

    try {
        const club = await Club.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: {
                club: club
            }

        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error

        })
    }
}
exports.removeClub = async (req, res) => {
    try {
        await Club.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: 'success'
        })
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error

        })
    }
}