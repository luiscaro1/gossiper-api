const { Router } = require('express');
const passport = require('passport');
const {
  usersPost,
  usersGet,
  usersIdGet,
  usersIdPut,
  usersIdDelete,
  usersFollowPost,
  usersFollowedByGet,
  usersFollowsGet,
  usersUnfollowPost,
  usersBlockPost,
  usersBlockedByGet,
  usersBlockGet,
  usersUnblockPost,
} = require('../controllers/user');

const userRoutes = (pool) => {
  // initialize router
  const router = Router();

  // add a new user
  router.post(
    '/users',
    (req, res, next) => usersPost(req, res, next, pool),
    passport.authenticate('local'),
    (req, res) => {
      res.status(201).end();
    },
  );
  // additional route to login a user
  router.post(
    '/login',
    passport.authenticate('local'),
    (req, res) => {
      res.status(200).end();
    },
  );

  // see all users

  router.get('/users', (req, res) => usersGet(req, res, pool));

  // access specific user

  router.get('/users/:id', (req, res) => usersIdGet(req, res, pool));

  // update specific user

  router.put('/users/:id', (req, res) => usersIdPut(req, res, pool));

  // delete specific user

  router.delete('/users/:id', (req, res) =>
    usersIdDelete(req, res, pool),
  );

  /* *********** Follow *********** */

  // follow a specific user

  router.post('/follow/:id', (req, res) =>
    usersFollowPost(req, res, pool),
  );

  // see all the users followed by someone

  router.get('/followedby/:id', (req, res) =>
    usersFollowedByGet(req, res, pool),
  );

  // see all users following someone

  router.get('/follows/:id', (req, res) =>
    usersFollowsGet(req, res, pool),
  );

  /* *********** Unfollow *********** */

  // follow a specific user

  router.post('/unfollow/:id', (req, res) =>
    usersUnfollowPost(req, res, pool),
  );

  /* *********** Block *********** */

  // block a specific user

  router.post('/block/:id', (req, res) =>
    usersBlockPost(req, res, pool),
  );

  // see all users blocked by someone

  router.get('/blockedby/:id', (req, res) =>
    usersBlockedByGet(req, res, pool),
  );

  // see all users that block someone

  router.get('/blocking/:id', (req, res) =>
    usersBlockGet(req, res, pool),
  );

  /* ************* Unblock *********** */

  // unblock a specific user

  router.post('/unblock/:id', (req, res) =>
    usersUnblockPost(req, res, pool),
  );

  return router;
};

module.exports = userRoutes;
