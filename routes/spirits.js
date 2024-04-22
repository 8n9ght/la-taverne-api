const express = require('express');
const router = express.Router();
const spiritsCtrl = require('../controllers/spirits');

router.get('/', spiritsCtrl.getAllSpirits);
router.get('/:id', spiritsCtrl.getOneSpirit);

module.exports = router;