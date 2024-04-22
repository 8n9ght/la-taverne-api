const express = require('express');
const router = express.Router();
const shotsCtrl = require('../controllers/shots');

router.get('/', shotsCtrl.getAllShots);
router.get('/:id', shotsCtrl.getOneShot);

module.exports = router;