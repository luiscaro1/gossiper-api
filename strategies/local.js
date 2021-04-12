const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

// use local authentication
const useLocalStrategy = (passport, pool) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password',
      },
      async (username, password, done) => {
        // fetch user from db
        const user = (
          await pool.query(
            'SELECT * FROM Users WHERE username = $1',
            [username],
          )
        ).rows[0];

        if (!user) {
          return done(null, false, {
            message: 'No user with that name!',
          });
        }

        try {
          if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
          }
          return done(null, false, {
            message: 'password is incorrect!',
          });
        } catch (err) {
          return done(err);
        }
      },
    ),
  );
  // store uid in session
  passport.serializeUser((user, done) => done(null, user.uid));

  // retrieve user by the provided uid in the serializeUser function
  passport.deserializeUser(async (id, done) =>
    done(
      null,
      (await pool.query('SELECT * FROM Users WHERE uid = $1', [id]))
        .rows[0],
    ),
  );
};

module.exports = useLocalStrategy;
