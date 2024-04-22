const express = require('express');
const router = express.Router();
const mocktailsCtrl = require('../controllers/mocktails');

router.get('/', mocktailsCtrl.getAllMocktails);
router.get('/:id', mocktailsCtrl.getOneMocktail);

module.exports = router;