const mongoose = require('mongoose');

const GoatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: true,
    }
});

module.exports = mongoose.model('GOAT', GoatSchema);
