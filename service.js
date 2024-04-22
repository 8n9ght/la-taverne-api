import { initializeApp, credential as _credential } from "firebase-admin";

import serviceAccount from "la-taverne-b5b1e-firebase-adminsdk-6jolv-08c27ee0f9.json";

initializeApp({
  credential: _credential.cert(serviceAccount)
});

const sendOrderUpdateNotification = (token, orderStatus) => {
  const message = {
    notification: {
      title: 'Mise à jour de la commande',
      body: `Votre commande est maintenant ${orderStatus}.`
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
}
