const router = require('express').Router();
const clubController = require('../controllers/ClubController');

router
    .route('/stats')
    .get(clubController.getClubStats)
router
    .route('/getTopClubs')
    .get(clubController.getTopClubs)
router
    .route('/')
    .get(clubController.getAllClubs)
    .post(clubController.createClub)
router
    .route('/:id')
    .get(clubController.getClub)
    .patch(clubController.updateClub)
    .delete(clubController.removeClub)

module.exports = router