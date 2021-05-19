/* *********** Creation *********** */

// post a new message by a user

const postsPost = async (req, res, pool) => {
  try {
    /* body should include the id of the user that is posting
   and the text that he/she is posting */
    const { RegisteredUser, Text } = req.body;

    await pool.query(
      'INSERT INTO Posts (uid, content) VALUES ($1, $2)',
      [RegisteredUser, Text],
    );
    res.status(201).end();
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
    const { RegisteredUser, replyingto, Text } = req.body;

    // await postExists(pid, res, pool);

    await pool.query(
      'INSERT INTO Replies (uid, pid, content) VALUES ($1, $2, $3)',
      [RegisteredUser, replyingto, Text],
    );
    res.status(201).end();
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
    const { RegisteredUser, sharing } = req.body;

    await pool.query(
      'INSERT INTO Shares (uid, pid) VALUES ($1, $2)',
      [RegisteredUser, sharing],
    );
    res.status(201).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** GET *********** */

// See message by id

const postsGetById = async (req, res, pool) => {
  try {
    const { id } = req.params;

    const r = await pool.query('SELECT * FROM Posts WHERE pid = $1', [
      id,
    ]);
    const { pid, uid, content, timestamp } = r.rows[0];
    res.json({
      ID: pid,
      RegisterdUser: uid,
      Text: content,
      Date: timestamp,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

// see all messages

const postsGet = async (req, res, pool) => {
  try {
    const r = await pool.query('SELECT * FROM Posts');
    const temp = [];

    r.rows.forEach((element) => {
      const { pid, uid, content, timestamp } = element;

      temp.push({
        ID: pid,
        RegisterdUser: uid,
        Text: content,
        Date: timestamp,
      });
    });
    res.json(temp);
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** Like *********** */

// like a specific post

const postsLikePost = async (req, res, pool) => {
  try {
    const { RegisteredUser } = req.body;
    const { id } = req.params;

    await pool.query(
      'DELETE FROM Unlikes WHERE uid = $1 AND pid = $2',
      [RegisteredUser, id],
    );

    await pool.query('INSERT INTO Likes (uid,pid) VALUES ($1, $2)', [
      RegisteredUser,
      id,
    ]);

    res.status(201).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

// remove like to a specific message

const postsLikeRemove = async (req, res, pool) => {
  try {
    // target post
    const { RegisteredUser } = req.body;
    const { id } = req.params;

    await pool.query(
      'DELETE FROM Likes WHERE uid = $1 AND pid = $2',
      [RegisteredUser, id],
    );
    res.status(200).end();
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

    const r = await pool.query(
      'SELECT uid, username, password FROM Likes natural inner join Users WHERE pid = $1',
      [id],
    );
    res.json(r.rows);
  } catch (err) {
    res.status(400).send(err);
  }
};

/* ********** Unlike *********** */

// unlike a specific message

const postsUnlikePost = async (req, res, pool) => {
  try {
    // id for the target post
    const { RegisteredUser } = req.body;
    const { id } = req.params;

    await pool.query(
      'DELETE FROM Likes WHERE uid = $1 AND pid = $2',
      [RegisteredUser, id],
    );
    await pool.query(
      'INSERT INTO Unlikes (uid,pid) VALUES ($1, $2)',
      [RegisteredUser, id],
    );
    res.status(201).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

// remove unlike to a specific post

const postsUnlikeDelete = async (req, res, pool) => {
  try {
    // id of the target post
    const { id } = req.params;
    const { RegisteredUser } = req.body;

    await pool.query(
      'DELETE FROM Unlikes WHERE uid = $1 AND pid = $2',
      [RegisteredUser, id],
    );
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

// see all users that unliked msg

const postsUnlikeGet = async (req, res, pool) => {
  try {
    // id of the target post
    const { id } = req.params;

    const r = await pool.query(
      'SELECT uid,username,password FROM Unlikes natural inner join Users WHERE pid = $1',
      [id],
    );

    res.json(r.rows);
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
