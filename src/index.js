const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const config = require('../config');
const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

const app = express();

const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/authentication-app',
  collection: 'sessions'
});

app.use(session({
  secret: 'your secret key',
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
mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(config.port))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.use('/', indexRoutes);
app.use('/auth', authRoutes);

// Error middleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Something went wrong');
});