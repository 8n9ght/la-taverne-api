const Mocktail = require('../models/drink');

exports.getAllMocktails = (req, res) => {
    Mocktail.find({category: 'mocktails'})
        .then((bucket) => res.status(200).json(bucket))
        .catch((err) => res.status(500).json({ error: err }))
}

exports.getOneMocktail = (req, res) => {
    Mocktail.findOne({_id: req.params.id})
    .then((mocktail) => res.status(200).json(mocktail))
    .catch((err) => res.status(404).json(err))
}