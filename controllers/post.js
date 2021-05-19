/* *********** Creation *********** */

// post a new message by a user

const postsPost = async (req, res, pool) => {
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
};

// reply to message

const postsReplyPost = async (req, res, pool) => {
  /* body should include the id of the user replying, id of the user
  and the reply (reply message)
   */
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** Share *********** */

// share message

const postsSharePost = async (req, res, pool) => {
  /* The body includes the id of the user who is sharing
  and the message id
   */

  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** GET *********** */

// See message by id

const postsGetById = async (req, res, pool) => {
  try {
    const { id } = req.params;

    await pool.query(
      'SELECT * FROM Posts WHERE pid = $1',
      [id],
      (err, r) => {
        if (err) res.json(err);
        res.json(r.rows[0] || {});
      },
    );
  } catch (err) {
    res.status(400).send(err);
  }
};

// see all messages

const postsGet = async (req, res, pool) => {
  try {
    await pool.query('SELECT * FROM Posts', (err, r) => {
      if (err) res.json(err);
      res.json(r.rows);
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** Like *********** */

// like a specific post

const postsLikePost = async (req, res, pool) => {
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
};

// remove like to a specific message

const postsLikeRemove = async (req, res, pool) => {
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }

  // body should include the id of the user who is unliking
};

// see all the users that liked a post

const postsLikeGet = async (req, res, pool) => {
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
};

/* ********** Unlike *********** */

// unlike a specific message

const postsUnlikePost = async (req, res, pool) => {
  try {
    // id for the target post
    const { uid } = req.body;
    const { id } = req.params;

    await pool.query(
      'DELETE FROM Likes WHERE uid = $1 AND pid = $2',
      [uid, id],
    );
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
  } catch (err) {
    res.status(400).send(err);
  }
};

// remove unlike to a specific post

const postsUnlikeDelete = async (req, res, pool) => {
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
};

// see all users that unliked msg

const postsUnlikeGet = async (req, res, pool) => {
  try {
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
  } catch (err) {
    res.status(400).send(err);
  }
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
