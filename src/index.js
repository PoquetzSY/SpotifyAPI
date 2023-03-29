const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);


const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI;

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});

app.use(session({
  resave: false,
  saveUninitialized: false,
  store: store
}));

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Database connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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

const { getTopTracks } = require('./controllers/topController'); // Import the getTopTracks function

app.get('/', async (req, res) => {
  const topTracks = await getTopTracks();
  const trackList = topTracks
    .map(({ name, artists }) => `${name} by ${artists.map((artist) => artist.name).join(', ')}`)
    .join('\n');

  res.send(`Top Tracks:\n${trackList}`);
});

app.listen(3000, () => console.log('Server started on port 3000'));