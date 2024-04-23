const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./la-taverne-b5b1e-firebase-adminsdk-6jolv-08c27ee0f9.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = ['https://www.la-taverne-de-ja.fr', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST"]
};

const io = socketIo(server, corsOptions);

require('dotenv').config()

const uri = process.env.DATABASE_URL

const cocktailsRouter = require('./routes/cocktails')
const mocktailsRouter = require('./routes/mocktails')
const shotsRouter = require('./routes/shots')
const spiritsRouter = require('./routes/spirits')
const goatRouter = require('./routes/goat')
const orderRouter = require('./routes/orders')
const userRouter = require('./routes/user')




app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json())


app.use('/cocktails', cocktailsRouter)
app.use('/mocktails', mocktailsRouter)
app.use('/shots', shotsRouter)
app.use('/spirits', spiritsRouter)
app.use('/orders', orderRouter)
app.use('/admin', goatRouter)
app.use('/users', userRouter)

const mongoose = require('mongoose');

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connecté à la DB des boissons 🍸'))
server.listen(5000, () => console.log('Hourray 💪 ! Le serveur a démarré sur le port 5000 !'))