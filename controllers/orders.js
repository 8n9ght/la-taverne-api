const Order = require("../models/order");
const admin = require("firebase-admin");

exports.getAllOrders = (req, res) => {
  Order.find({ status: { $ne: "prêt" } })
    .then((orders) => res.status(200).json(orders))
    .catch((err) => res.status(500).json({ error: err }));
};

exports.createOrder = (req, res) => {
  const { name, ingredients, user, token } = req.body;

  if (!token) {
    console.error("Token manquant:", req.body);
    return res
      .status(400)
      .json({ error: "Le token de notifications est requis" });
  }

  let order;

  order = new Order({
    name,
    ingredients,
    status: "créée",
    user,
    token,
  });

  order
    .save()
    .then((savedOrder) => {
      req.io.emit("orderCreated", savedOrder);
      res.status(201).json({ msg: `Commande créée`, order: savedOrder });

      const message = {
        notification: {
          title: `👋 Hello ${user} !`,
          body: `Ta commande pour un ${name} a bien été créée.`,
        },
        token: token,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Notification envoyée avec succès:", response);
        })
        .catch((error) => {
          console.log('Erreur lors de l\'envoi de la notification:', error);
          if (error.errorInfo.code === 'messaging/registration-token-not-registered') {
            console.log(`Le token ${token} n'est plus valide, il sera supprimé.`);

            Order.updateOne({ _id: savedOrder._id }, { $unset: { token: "" } })
              .then(() => {
                console.log(`Token supprimé de la commande ${savedOrder._id}`);
              })
              .catch((updateError) => {
                console.error('Erreur lors de la suppression du token:', updateError);
              });
          }
        });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .json({
          error:
            "Une erreur est survenue lors de la création de la commande, vérifier la console.",
        });
    });
};

exports.beginOrder = (req, res) => {
  const { id } = req.params;
  const { name, user, token } = req.body;

  if (!token) {
    console.error("Token manquant:", req.body);
    return res
      .status(400)
      .json({ error: "Le token de notifications est requis" });
  }

  Order.findByIdAndUpdate(
    id,
    { name, status: "en cours de préparation", user, token },
    { new: true }
  )
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Commande inconnue" });
      }

      req.io.emit("orderUpdated", order);

      const message = {
        notification: {
          title: `🍹 Shake, shake, shake ! 🍸`,
          body: `${user}, ton ${name} est ${order.status} !`,
        },
        token: token,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Notification envoyée avec succès:", response);
        })
        .catch((error) => {
          console.log("Erreur lors de l'envoi de la notification:", error);
        });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({
          error: "Problème avec le serveur, vérifier la console serveur.",
        });
    });
};

exports.readyOrder = (req, res) => {
  const { id } = req.params;
  const { name, user, token } = req.body;

  if (!token) {
    console.error("Token manquant:", req.body);
    return res
      .status(400)
      .json({ error: "Le token de notifications est requis" });
  }

  Order.findByIdAndUpdate(
    id,
    { name, status: "prêt", user, token },
    { new: true }
  )
    .then((order) => {
      if (!order) {
        return res.status(404).json({ error: "Commande inconnue" });
      }

      req.io.emit("orderReady", order);

      const message = {
        notification: {
          title: `Bonne dégustation ${order.user} ! 😉`,
          body: `Ton ${name} est ${order.status} viens le récupérer au bar ! 🤗`,
        },
        token: token,
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Notification envoyée avec succès:", response);
        })
        .catch((error) => {
          console.log("Erreur lors de l'envoi de la notification:", error);
        });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({
          error: "Problème avec le serveur, vérifier la console serveur.",
        });
    });
};

exports.deleteOrder = (req, res) => {
  const { id } = req.params;

  Order.deleteOne({ _id: id })
    .then((order) => {
      if (order.deletedCount === 0) {
        return res.status(404).json({ error: "Commande inconnue" });
      }
      res.status(202).json({ message: "Commande supprimée" });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({
          error: "Problème avec le serveur, vérifier la console serveur.",
        });
    });
};
