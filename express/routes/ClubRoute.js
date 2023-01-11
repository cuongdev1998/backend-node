const router = require('express').Router();
const clubController = require('../controllers/ClubController');
const authController = require('../controllers/AuthController');

router
    .route('/stats')
    .get(clubController.getClubStats)
router
    .route('/getTopClubs')
    .get(clubController.getTopClubs)
router
    .route('/')
    .get(authController.protect, clubController.getAllClubs)
    .post(clubController.createClub)
router
    .route('/:id')
    .get(clubController.getClub)
    .patch(clubController.updateClub)
    .delete(clubController.removeClub)

module.exports = router