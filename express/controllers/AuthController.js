const {registerValidation, loginValidation} = require("../validation");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const AppError = require('../utils/appError');
const SendMail = require('../utils/email');
const { promisify } = require('util');
const crypto = require('crypto');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}
exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
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
    console.log(password, user.password)
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
        return next(new AppError('Incorrect email or password', 401))
    }
    //3 ok
    const token = signToken(user._id)
    res.status(200).json({
        status: 'success',
        token: token,
        data: ''
    })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await  user.save({validateBeforeSave: false});

    // send mail
    const resetURL= `${req.protocol}://${req.get('host')}/api/user/reset-password/${resetToken}`;

    const message = `Forgot your password? submit a PATCH request to : ${resetURL} `;
    try {
        await  SendMail({
            email: user.email,
            subject: 'Password reset token, It expired in 10 mins',
            message: message
        })
        res.status(200).json({
            status: 'success',
            message: 'sent email',
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpired = undefined;
        await  user.save({validateBeforeSave: false});
        console.log(err)
        return next(new AppError('there was an error sending the email!', 500))
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now()}});
    if (!user) {
        return next(new AppError('Token is invalid', 400))
    }

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
    })
})


exports.changePassword = (catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;
    //1 Get user from collection
    const user = await User.findOne({_id: req.user._id});
    const isCorrect = await user.correctPassword(currentPassword, user.password)

    //2 Check if posted current password is correct
    if (!currentPassword) {
        return next(new AppError('Current password must be not empty', 400))
    }
    if (!isCorrect) {
        return next(new AppError('password is wrong', 401))
    }

    //3 update password
    user.password = newPassword;
    await user.save();

    //4 log user in , send jwt
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token: token,
    })
}))

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

    //3 check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
        return next(new AppError('The user belong to this token', 401))
    }

    req.user = currentUser;
    next();
}));

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles
        console.log("================", roles, req.user)

        if(!roles.includes(req.user.role)) {
            return next(new AppError("You don't have permission", 403))
        }

        next();
    }

}
