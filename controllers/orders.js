const Order = require('../models/order');
const admin = require('firebase-admin');

exports.getAllOrders = (req, res) => {
  Order.find({status : {$ne: 'prêt'}})
  .then((orders) => res.status(200).json(orders))
  .catch((err) => res.status(500).json({ error: err }))
}

exports.createOrder = (req, res) => {
    const { name, ingredients, client, token } = req.body;
    
    if(token === null){
        console.log(token)
    }

    let order;

    order = new Order({
        name,
        ingredients,
        status: "créée",
        client,
        token
    })

    order
        .save()
        .then((savedOrder) => {
            req.io.emit('orderCreated', savedOrder)
            res.status(201).json({msg: `Commande créée`, order: savedOrder});
        })
        .catch((err) => {
            console.error(err)
            res.status(500).json({error: 'Une erreur est survenue lors de la création de la commande, vérifier la console.'})
        })
};


exports.beginOrder = (req, res) => {
    const { id } = req.params;
    const { name, client, token } = req.body;

    if (!token) {
      console.error('Token manquant:', req.body)
      return res.status(400).json({ error: 'Le token de notifications est requis' });
    }

    Order
        .findByIdAndUpdate(
            id,
            { name, status: "en cours de préparation", client, token },
            { new: true }
        )
        .then((order) => {
            if (!order) {
              return res.status(404).json({ error: 'Commande inconnue' });
            }

            req.io.emit('orderUpdated', order);

            const message = {
              notification: {
                title: `🍹 Shake, shake, shake ! 🍸`,
                body: `${client}, ton ${name} est ${order.status} !`
              },
              token: token
            };

            admin.messaging().send(message)
              .then((response) => {
                console.log('Notification envoyée avec succès:', response);
              })
              .catch((error) => {
                console.log('Erreur lors de l\'envoi de la notification:', error);
              });
            })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Problème avec le serveur, vérifier la console serveur.' });
        });
};

exports.readyOrder = (req, res) => {
    const { id } = req.params;
    const { name, client, token } = req.body;

    if (!token) {
      console.error('Token manquant:', req.body)
      return res.status(400).json({ error: 'Le token de notifications est requis' });
    }

    Order
        .findByIdAndUpdate(
            id,
            { name, status: "prêt", client, token },
            { new: true }
        )
        .then((order) => {
            if (!order) {
              return res.status(404).json({ error: 'Commande inconnue' });
            }
            
            req.io.emit('orderReady', order);

            const message = {
              notification: {
                title: `Bonne dégustation ${order.client} ! 😉`,
                body: `Ton ${name} est ${order.status} viens le récupérer au bar ! 🤗`
              },
              token: token
            };

            admin.messaging().send(message)
              .then((response) => {
                console.log('Notification envoyée avec succès:', response);
              })
              .catch((error) => {
                console.log('Erreur lors de l\'envoi de la notification:', error);
              });
          })
          .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Problème avec le serveur, vérifier la console serveur.' });
          });
};

exports.deleteOrder = (req, res) => {
  const { id } = req.params;

  Order
      .deleteOne({_id: id})
      .then((order) => {
          if (order.deletedCount === 0) {
            return res.status(404).json({ error: 'Commande inconnue' });
          }
          res.status(202).json({message: 'Commande supprimée'});
        })
        .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Problème avec le serveur, vérifier la console serveur.' });
        });
};