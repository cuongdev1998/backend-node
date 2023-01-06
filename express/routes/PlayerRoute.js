const router = require('express').Router();
const playerController = require('../controllers/PlayerController')

router
    .route('/')
    .get(playerController.getAllPlayer)
    .post(playerController.createPlayer);
router
    .route('/:id')
    .get(playerController.getPlayer)
    .patch(playerController.updatePlayer)
    .delete(playerController.removePlayer);

module.exports = router