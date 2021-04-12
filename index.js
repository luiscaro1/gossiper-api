const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const cors = require('cors');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const initializeDB = require('./services/db');
const useLocalStrategy = require('./strategies/local');

// routes

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
const PORT = process.env.PORT || '5000';

const init = async () => {
  app.use(bodyparser.urlencoded({ extended: false }));
  app.use(bodyparser.json());
  app.use(cookieparser());
  app.use(cors());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
  app.use(
    session({
      secret: 'medallalight',
      resave: false,
      saveUnitialized: true,
      cookie: { secure: true },
    }),
  );
  // initialize db and get a request pool
  const pool = await initializeDB();

  // set local strategy as the authentication method
  useLocalStrategy(passport, pool);

  // enable the users routes
  app.use('/gossiper', userRoutes(pool));
  app.use('/gossiper', postRoutes(pool));

  app.use('/', (req, res) => {
    res.json('Gossiper API');
  });
};

init();

app.listen(PORT, () => {
  console.log(`Your server is running on http://localhost:${PORT}`);
});
