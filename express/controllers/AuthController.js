const {registerValidation, loginValidation} = require("../validation");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require('../utils/appError');
const { promisify } = require('util');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    })
    const token = signToken(newUser._id)
    //create a new user

    const savedUser = await newUser.save();
    res.status(201).json({
        status: 'success',
        token: token,
        data: savedUser
    })
})

exports.signIn = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1) Check if email and password exist
    if(!email || !password) {
        next(new AppError('Please provide email and password!', 400))
    }
    //2) Check if exist && password is correct
    const user  = await User.findOne({ email }).select('+password')
    console.log(user)
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
        return next(new AppError('Incorrect email or password', 401))
    }
    //3 ok
    const token = signToken(user._id)
    res.status(201).json({
        status: 'success',
        token: token,
        data: ''
    })
})

exports.protect = (catchAsync(async (req, res, next) => {
    //1 getting and check token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Your are not log In', 401));
    }

    //2 verification token

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    console.log(decoded, "decode")
    next();
}))
