const router = require('express').Router();
const Player = require('../models/Player');
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.send(req.user);
})
router.post('/', verify, (req, res) => {
    res.send(req.user);
})
router.put('/', verify, (req, res) => {
    res.send(req.user);
})
router.delete('/', verify, (req, res) => {
    res.send(req.user);
})

module.exports = router