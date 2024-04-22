const Shot = require('../models/drink');

exports.getAllShots = (req, res) => {
    Shot.find({category: 'shots'})
        .then((bucket) => res.status(200).json(bucket))
        .catch((err) => res.status(500).json({ error: err }))
}

exports.getOneShot = (req, res) => {
    Shot.findOne({_id: req.params.id})
    .then((shot) => res.status(200).json(shot))
    .catch((err) => res.status(404).json(err))
}