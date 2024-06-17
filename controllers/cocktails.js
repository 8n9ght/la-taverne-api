const Cocktail = require('../models/drink');

exports.getAllCocktails = (req, res) => {
    Cocktail.find({category: 'cocktails'}).sort({ name: 1 })
        .then((bucket) => res.status(200).json(bucket))
        .catch((err) => res.status(500).json({ error: err }))
}

exports.getOneCocktail = (req, res) => {
    Cocktail.findOne({_id: req.params.id})
    .then((cocktail) => res.status(200).json(cocktail))
    .catch((err) => res.status(404).json(err))
}