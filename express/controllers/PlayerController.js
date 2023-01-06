const Player = require('../models/Player');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require("../utils/appError");

exports.createPlayer = catchAsync(async (req, res, next) => {
    const newPlayer = new Player(req.body);
    const createdPlayer = await newPlayer.save();
    res.status(201).json({
        status: 'success',
        data: createdPlayer
    })
})

exports.getAllPlayer = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Player.find(), req.query)
        .filter()
        .sort()
        .paginate()
    const allPlayers = await features.query;
    res.status(200).json({
        status: 'success',
        count: allPlayers.length,
        data: allPlayers
    })
})

exports.updatePlayer = catchAsync(async (req, res, next) => {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: player
    })
})

exports.getPlayer = catchAsync(async (req, res, next) => {
    const player = await Player.findById(req.params.id)
    if (!player) {
        return next(new AppError('No league found', 404))
    }
    res.status(200).json({
        status: 'success',
        data: player
    })
})

exports.removePlayer = catchAsync(async (req, res, next) => {
    await Player.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'success',
    })
})