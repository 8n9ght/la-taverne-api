const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');

exports.createUser = async (req, res) => {
  try {
    const { name } = req.body;

    const uuid = uuidv4();

    const newUser = new User({
      name,
      uuid,
    });
    await newUser.save();

    return res.status(201).json({ uuid });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
