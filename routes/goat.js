const express = require('express');
const router = express.Router();
const goatCtrl = require('../controllers/goat');
const auth = require('../controllers/authenticate');
const multer = require('multer');
const { check } = require('express-validator');

// Utiliser MemoryStorage pour stocker les fichiers en mémoire
const upload = multer({ storage: multer.memoryStorage() });

router.post('/login', [
    check('username', 'Please include a valid username').not().isEmpty(),
    check('password', 'Password is required').exists()
], goatCtrl.login);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.sendStatus(200);
});

router.post('/register',[
    check('username', 'Please include a valid username').not().isEmpty(),
    check('password', 'Password is required').exists(),
    check('secretCode', 'Secret code is required').exists()
], goatCtrl.register);

if (process.env.NODE_ENV === 'development') {
    router.get('/getall', goatCtrl.getAllDrinks);
    router.post('/new', upload.single('image'), goatCtrl.createDrink);
    router.put('/update/:id', goatCtrl.updateDrink);
    router.delete('/delete/:id', goatCtrl.deleteDrink);
} else {
    router.get('/getall', auth, goatCtrl.getAllDrinks);
    router.post('/new', upload.single('image'), auth, goatCtrl.createDrink);
    router.put('/update/:id', auth, goatCtrl.updateDrink);
    router.delete('/delete/:id', auth, goatCtrl.deleteDrink);
}

module.exports = router;
