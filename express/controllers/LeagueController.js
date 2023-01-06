const League = require("../models/League");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync =require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createLeague = catchAsync(async (req, res, next) => {
    const newLeague = new League({
        name: req.body.name,
    })
    const createdLeague = await newLeague.save();
    res.status(201).json({
        status: 'success',
        data: createdLeague

    })
})


exports.getAllLeagues = catchAsync(async (req, res) => {
    const features = new APIFeatures(League.find(), req.query)
        .filter()
        .sort()
        .paginate();
    const allLeagues = await features.query;

    res.status(200).json({
        status: 'success',
        count: allLeagues.length,
        data: allLeagues
    })
})
exports.getLeague = catchAsync(async (req, res, next) => {
    const league = await League.findById(req.params.id);
    if (!league) {
        return next(new AppError('No league found', 404))
    }
    res.status(200).json({
        status: 'success',
        data: league

    })
})
exports.updateLeague = catchAsync(async (req, res) => {
    const league = await League.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: league

    })
})
exports.removeLeague = catchAsync(async (req, res) => {
    await League.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'success'
    })
})
