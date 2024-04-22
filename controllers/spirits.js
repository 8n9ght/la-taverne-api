const Spirit = require('../models/drink');

exports.getAllSpirits = (req, res) => {
    Spirit.find({category: 'spirits'})
        .then((bucket) => res.status(200).json(bucket))
        .catch((err) => res.status(500).json({ error: err }))
}

exports.getOneSpirit = (req, res) => {
    Spirit.findOne({_id: req.params.id})
    .then((spirit) => res.status(200).json(spirit))
    .catch((err) => res.status(404).json(err))
}