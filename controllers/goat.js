const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Goat = require('../models/goat');
const Drink = require('../models/drink');
require('dotenv').config();

exports.login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        let goat = await Goat.findOne( {username} );

        if (!goat) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, goat.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: goat.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {
                sameSite: 'None',
                secure: true
            });
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

exports.register = async (req, res) => {
    const { username, password, secretCode } = req.body;

    if (secretCode !== process.env.SECRET_CODE) {
        return res.status(401).json({ msg: 'Unauthorized. Invalid secret code.' });
    }

    try {
        let goat = await Goat.findOne( {username} );
        if (goat) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        goat = new Goat({
            username,
            password
        });

        const salt = await bcrypt.genSalt(10);
        goat.password = await bcrypt.hash(password, salt);

        await goat.save();

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getAllDrinks = async (req, res) => {
    try {
        const drinks = await Drink.find();
        res.json(drinks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.createDrink = (req, res) => {
    const { name, ingredients, category, available } = req.body;
  
    let drink;
  
      drink = new Drink({
        name: name,
        ingredients: ingredients,
        category: category,
        available: available,
      });
  
    drink
      .save()
      .then((savedDrink) => {
        res.status(201).json({msg : `Boisson ${savedDrink.name} créée`});
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'La boisson n\'a pas été créée' });
      });
  };
  
exports.updateDrink = (req, res) => {
    const { id } = req.params;
  
    const { name, ingredients, category, available } = req.body;
  
    Drink.findByIdAndUpdate(
      id,
      {
        name: name,
        ingredients: ingredients,
        category: category,
        available: available,
      },
      { new: true }
    )
      .then((updatedDrink) => {
        if (!updatedDrink) {
          return res.status(404).json({ error: 'Drink not found' });
        }
        res.json(updatedDrink);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
  
exports.deleteDrink = (req, res) => {
    const { id } = req.params;
  
    Drink.findByIdAndDelete(id)
      .then((deletedDrink) => {
        if (!deletedDrink) {
          return res.status(404).json({ error: 'Drink not found' });
        }
        res.json({ message: 'Drink deleted' });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
  