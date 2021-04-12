const { Router } = require('express');

const {
  postsPost,
  postsReplyPost,
  postsSharePost,
  postsGetById,
  postsGet,
  postsLikePost,
  postsLikeRemove,
  postsLikeGet,
  postsUnlikePost,
  postsUnlikeDelete,
  postsUnlikeGet,
} = require('../controllers/post');

const postRoutes = (pool) => {
  // initialize router
  const router = Router();

  /* *********** Message *********** */

  // Post a new message by a user

  router.post('/posts', (req, res) => postsPost(req, res, pool));

  // reply to a messge

  router.post('/reply', (req, res) => postsReplyPost(req, res, pool));

  // share message

  router.post('/share', (req, res) => postsSharePost(req, res, pool));

  // see message

  router.get('/msg/:id', (req, res) => postsGetById(req, res, pool));

  // see all messages

  router.get('/msg', (req, res) => postsGet(req, res, pool));

  /* *********** Like *********** */

  // like a specific post
  router.post('/like/:id', (req, res) =>
    postsLikePost(req, res, pool),
  );

  // remove like to a specific post

  router.delete('/like/remove/:id', (req, res) =>
    postsLikeRemove(req, res, pool),
  );

  // see all users that liked a msg

  router.get('/like/:id', (req, res) => postsLikeGet(req, res, pool));

  /* *********** Unlike *********** */

  // unlike a specific post

  router.post('/unlike/:id', (req, res) =>
    postsUnlikePost(req, res, pool),
  );

  // remove unlike to a specific msg

  router.delete('/unlike/remove/:id', (req, res) =>
    postsUnlikeDelete(req, res, pool),
  );

  // see all users that unliked a msg

  router.get('/unliked/:id', (req, res) =>
    postsUnlikeGet(req, res, pool),
  );

  return router;
};

module.exports = postRoutes;
