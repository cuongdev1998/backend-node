const router = require('express').Router();
// const League = require('../models/League');
// const verify = require('./verifyToken');
// const mongoose = require("mongoose");
// const { ObjectId } = require("mongodb")
const leagueController = require("../controllers/LeagueController");

router
    .route('/')
    .get(leagueController.getAllLeagues)
    .post(leagueController.createLeague)
router
    .route('/:id')
    .get(leagueController.getLeague)
    .patch(leagueController.updateLeague)
    .delete(leagueController.removeLeague)
// router.get('/', verify, async (req, res) => {
//     try {
//         const result = await League.find()
//         res.status(200).json(result)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })
//
// router.post('/', verify, async (req, res) => {
//     //checking if exist league in the db
//     const leagueExist = await League.findOne({name: req.body.name})
//     if (leagueExist) return res.status(400).send('League already exists');
//     //create a new league
//     const newLeague = new League({
//         name: req.body.name,
//     })
//     try {
//         const savedLeague = await newLeague.save();
//         res.json(savedLeague)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })
// router.put('/', verify, async (req, res) => {
//     //checking if exist league in the db
//     const leagueExist = await League.findOne({_id: new ObjectId(req.body.id)})
//     if (leagueExist) {
//         const updatedLeague = await League.update({_id: new ObjectId(req.body.id)}, req.body)
//         res.status(200).send("Updated league successfully!");
//     }
// })
// router.delete('/', verify, async (req, res) => {
//     //checking if exist league in the db
//     const leagueExist = await League.findOne({_id: new ObjectId(req.body.id)})
//     if (leagueExist) {
//         await League.deleteOne({_id: new ObjectId(req.body.id)})
//         res.status(200).send("Remove league successfully!");
//     }
//
// })

module.exports = router