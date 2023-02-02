const User = require("../models/User");
const APIFeatures = require('../utils/apiFeatures');
const catchAsync =require('../utils/catchAsync');
const AppError = require('../utils/appError');


exports.getAllUsers = catchAsync(async (req, res) => {
    const features = new APIFeatures(User.find(), req.query)
        .filter()
        .sort()
        .paginate();
    const allUsers = await features.query;

    res.status(200).json({
        status: 'success',
        count: allUsers.length,
        data: {
            user: allUsers
        }
    })
})
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new AppError('No user found', 404))
    }
    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }

    })
})
exports.updateUser = catchAsync(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true
    })
    res.status(200).json({
        status: 'success',
        data: {
            user: user
        }

    })
})
exports.removeUser = catchAsync(async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
    res.status(200).json({
        status: 'success'
    })
})
