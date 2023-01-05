const router = require('express').Router();

const User = require('../models/User');
const { registerValidation, loginValidation } = require('../validation')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {

    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if exist user in the db
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send('Email already exists');


    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(req.body.password, salt);
    //create a new user
    const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPwd,
    })
    try {
        const savedUser = await newUser.save();
        res.json(savedUser)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login',  async (req, res) => {
    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if exist user in the db
    const user = await User.findOne({email: req.body.email})
    if (!user) return res.status(400).send('Email is wrong');

    //password is correct
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if (!validPwd) return res.status(400).send('Invalid Password');
    //create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('Authorization', token).send({access_token: token});
    // res.send('Logged in')
})

module.exports = router;