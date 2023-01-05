const Club = require("../models/Club");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync =require('../utils/catchAsync');
const AppError = require('../utils/appError');

//create a new league

exports.createClub = catchAsync(async (req, res, next) => {
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
})


exports.getAllClubs = catchAsync(async (req, res) => {
    const features = new APIFeatures(Club.find(), req.query)
        .filter()
        .sort()
        .paginate();
    const allClubs = await features.query;

    res.status(200).json({
        status: 'success',
        count: allClubs.length,
        data: {
            club: allClubs
        }
    })
})
exports.getClub = catchAsync(async (req, res, next) => {
    const club = await Club.findById(req.params.id);
    if (!club) {
        return next(new AppError('No club found', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            club: club
        }

    })
})
exports.updateClub = catchAsync(async (req, res) => {
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
})
exports.removeClub = catchAsync(async (req, res) => {
    await Club.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'success'
    })
})
exports.getClubStats = catchAsync(async (req, res) => {
    const stats = await Club.aggregate([
        {
            $match: { playerQty: { $gte: 20 } } // get all documents which have playerQty > 20
        },
        {
            $group: {
                _id: null,
                avgPlayer: { $avg: '$playerQty'}, // group above data to return

            }
        }
    ])
    res.status(200).json({
        status: 'success',
        data: {
            stats
        }
    })
})

exports.getTopClubs = catchAsync(async (req, res) => {
    const top = await Club.aggregate([
        {
            $unwind: '$playerQty'
        },
        {
            $match: {
                playerQty: {
                    $gte: 10,
                    $lte: 20
                }
            }
        },
    ])
    res.status(200).json({
        status: 'success',
        data: top
    })
})
