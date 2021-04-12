/* *********** Creation *********** */

// post a new message by a user

const postsPost = async (req, res, pool) => {
  /* body should include the id of the user that is posting
   and the text that he/she is posting */
  const { uid, content } = req.body;
  await pool.query(
    'INSERT INTO Posts (uid, content, timestamp) VALUES ($1, $2, $3)',
    [uid, content, Date.now()],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(201).end();
    },
  );
};

// reply to message

const postsReplyPost = async (req, res, pool) => {
  /* body should include the id of the user replying, id of the user
  and the reply (reply message)
   */
  const { uid, pid, content } = req.body;
  await pool.query(
    'INSERT INTO Replies (uid, pid, content, timestamp) VALUES ($1, $2, $3, $4)',
    [uid, pid, content, Date.now()],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(201).end();
    },
  );
};

/* *********** Share *********** */

// share message

const postsSharePost = async (req, res, pool) => {
  /* The body includes the id of the user who is sharing
  and the message id
   */
  const { uid, pid } = req.body;
  await pool.query(
    'INSERT INTO Shares (uid, pid, timestamp) VALUES ($1, $2, $3)',
    [uid, pid, Date.now()],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(201).end();
    },
  );
};

/* *********** GET *********** */

// See message by id

const postsGetById = async (req, res, pool) => {
  const { id } = req.params;

  await pool.query(
    'SELECT * FROM Posts WHERE pid = $1',
    [id],
    (err, r) => {
      if (err) res.json(err);
      res.json(r.rows[0] || {});
    },
  );
};

// see all messages

const postsGet = async (req, res, pool) => {
  await pool.query('SELECT * FROM Posts', (err, r) => {
    if (err) res.json(err);
    res.json(r.rows);
  });
};

/* *********** Like *********** */

// like a specific post

const postsLikePost = async (req, res, pool) => {
  const { uid } = req.body;
  const { id } = req.params;

  await pool.query(
    'DELETE FROM Unlikes WHERE uid = $1 AND pid = $2',
    [uid, id],
  );

  await pool.query(
    'INSERT INTO Likes (uid,pid,timestamp) VALUES ($1, $2, $3)',
    [uid, id, Date.now()],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(201).end();
    },
  );
};

// remove like to a specific message

const postsLikeRemove = async (req, res, pool) => {
  // target post
  const { uid } = req.body;
  const { id } = req.params;
  await pool.query(
    'DELETE FROM Likes WHERE uid = $1 AND pid = $2',
    [uid, id],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(200).end();
    },
  );

  // body should include the id of the user who is unliking
};

// see all the users that liked a post

const postsLikeGet = async (req, res, pool) => {
  // id of the target post
  const { id } = req.params;

  await pool.query(
    'SELECT uid, username, password FROM Likes natural inner join Users WHERE pid = $1',
    [id],
    (err, r) => {
      if (err) res.json(err);

      res.json(r.rows);
    },
  );
};

/* ********** Unlike *********** */

// unlike a specific message

const postsUnlikePost = async (req, res, pool) => {
  // id for the target post
  const { uid } = req.body;
  const { id } = req.params;
  await pool.query('DELETE FROM Likes WHERE uid = $1 AND pid = $2', [
    uid,
    id,
  ]);
  await pool.query(
    'INSERT INTO Unlikes (uid,pid,timestamp) VALUES ($1, $2, $3)',
    [uid, id, Date.now()],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(201).end();
    },
  );
};

// remove unlike to a specific post

const postsUnlikeDelete = async (req, res, pool) => {
  // id of the target post
  const { id } = req.params;
  const { uid } = req.body;

  await pool.query(
    'DELETE FROM Unlikes WHERE uid = $1 AND pid = $2',
    [uid, id],
    (err) => {
      if (err) {
        res.json(err);
      }
      res.status(200).end();
    },
  );
};

// see all users that unliked msg

const postsUnlikeGet = async (req, res, pool) => {
  // id of the target post
  const { id } = req.params;

  await pool.query(
    'SELECT uid,username,password FROM Unlikes natural inner join Users WHERE pid = $1',
    [id],
    (err, r) => {
      if (err) {
        res.json(err);
      }
      res.json(r.rows);
    },
  );
};

module.exports = {
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
};
