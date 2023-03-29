const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const config = require('../config');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const MONGO_URI = config.MONGO_URI;
// const SECRET_KEY = config.SECRET_KEY;

const store = new MongoDBStore({
  uri: MONGO_URI,
  collection: 'sessions'
});

app.use(session({
  // secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  store: store,
  secret: 'mysecret'
}));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Database connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error(error);
  });

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

app.get('/search/:query', async (req, res) => {
  const query = req.params.query;

  const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
    headers: {
      'Authorization': `Bearer ${await getAccessToken()}`
    }
  });

  const data = await response.json();
  res.json(data.tracks.items);
});

async function getAccessToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  const data = await response.json();
  return data.access_token;
}

// Error middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Something went wrong');
});