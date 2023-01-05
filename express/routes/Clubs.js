const router = require('express').Router();
const clubController = require('../controllers/ClubController');
const Club = require('../models/Club');
const League = require('../models/League');
const verify = require('./verifyToken');
const { ObjectId } = require("mongodb");
const { updateClubValidation } = require("../validation");

router
    .route('/')
    .get(clubController.getAllClubs)
    .post(clubController.createClub)
router
    .route('/:id')
    .get(clubController.getClub)
    .patch(clubController.updateClub)
    .delete(clubController.removeClub)
router.get('/', verify, async (req, res) => {
    try {
        const result =  await Club.find();
        const newList = result.map(club => {
            let leagueList = [];
            club.leagueIds.map(async id => {
                const rs = await League.findOne({_id: ObjectId(id)});

                leagueList = [...leagueList, rs]
                console.log("leagueList 1", leagueList) // co result
            })
            const list = leagueList;
            return {
                _id: club._id,
                name: club.name,
                createdDate: club.createdDate,
                leagues: list
            }
        })

        res.status(200).json(newList);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/', verify, async (req, res) => {
    //checking if exist club in the db
    const clubExist = await Club.findOne({name: req.body.name})
    if (clubExist) return res.status(400).send('Club already exists');
    //create a new league
    const newClub = new Club({
        leagueIds: req.body.leagueIds,
        name: req.body.name,
    })
    try {
        const createdClub= await newClub.save();
        res.json(createdClub)
    } catch (error) {
        res.status(400).send(error)
    }
})
router.put('/', verify, async (req, res) => {
    const {error} = updateClubValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    //checking if exist club in the db
    const clubExist = await Club.findOne({_id: new ObjectId(req.body.id)})
    if (!clubExist) res.status(400).send("Club is not exist");

    try {
        await Club.update({_id: new ObjectId(req.body.id)}, req.body)
        res.status(200).send("Updated club successfully!");
    } catch (error) {
        res.status(400).send(error)
    }

})
router.delete('/', verify, async (req, res) => {
    //checking if exist league in the db
    const leagueExist = await Club.findOne({_id: new ObjectId(req.body.id)})
    if (leagueExist) {
        await Club.deleteOne({_id: new ObjectId(req.body.id)})
        res.status(200).send("Remove club successfully!");
    }

})

module.exports = router