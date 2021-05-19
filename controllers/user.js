const bcrypt = require('bcrypt');
const rn = require('node-random-name');
/* *********** CREATE AND MODIFY *********** */
/*

creates and signsup a user and return the newly created
user object
 */

const usersPost = async (req, res, next, pool) => {
  try {
    let username;
    let password;
    if (!req.body || (!req.body.username && !req.body.password)) {
      username = rn();
      password = rn();
    } else {
      username = req.body.username;
      password = req.body.password;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // creating a user and posting them in the database
    await pool.query(
      'INSERT INTO Users(username,password) VALUES ($1,$2)',
      [username, hashedPassword],
    );

    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

/*
fetches all existing users and returns an array of  user objects
*/

const usersGet = async (req, res, pool) => {
  try {
    const { query } = req;

    const selectors = Object.keys(query);

    let queryString = 'SELECT * FROM Users';

    if (selectors.length > 0) queryString += '\tWHERE\t';

    selectors.forEach((selector, i) => {
      queryString += `\t${selector}=$${i + 1}\t`;

      if (i < selectors.length - 1) queryString += '\tAND\t';
    });

    const r = await pool.query(queryString, Object.values(query));
    res.json(r.rows);
  } catch (err) {
    res.status(400).send(err);
  }
};

/*
fetch a user by id and returns a user object
*/

const usersIdGet = async (req, res, pool) => {
  try {
    const { id } = req.params;

    const r = await pool.query(`SELECT * FROM Users WHERE uid = $1`, [
      id,
    ]);

    if (r.rows.length === 0)
      res.status(400).send('A user with that Id does not exist');
    res.json(r.rows[0]);
  } catch (err) {
    res.status(400).send(err);
  }
};

/*
updates a user object and returns the updated user object
*/

const usersIdPut = async (req, res, pool) => {
  try {
    const { id } = req.params;

    const newValues = Object.keys(req.body);

    let queryString = 'UPDATE Users SET ';

    newValues.forEach((field, i) => {
      queryString += `${field}=$${i + 1}`;
      if (i !== newValues.length - 1) queryString += ',';
    });

    queryString += ` WHERE uid=$${newValues.length + 1}`;

    await pool.query(queryString, [...Object.values(req.body), id]);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

/*
deletes a user's account and return a HTTP code 200
*/

const usersIdDelete = async (req, res, pool) => {
  try {
    const { id } = req.params;

    /* delete user */
    await pool.query('DELETE FROM Users WHERE uid = $1', [id]);
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** FOLLOWING *********** */

// Follow a user

const usersFollowPost = async (req, res, pool) => {
  try {
    // id of the user who is going to be followed
    const { RegisteredUser } = req.body;
    const { id } = req.params;

    await pool.query(
      'INSERT INTO Follows (follower_id, followee_id) VALUES ($1,$2)',
      [RegisteredUser, id],
    );
    res.status(201).end();

    // The id of the follower needs to be passed through the body
  } catch (err) {
    res.status(400).send(err);
  }
};

// See all users followed By someone

const usersFollowedByGet = async (req, res, pool) => {
  try {
    // id of the target user
    const { id } = req.params;

    const r = await pool.query(
      'SELECT U.uid, U.username, U.password FROM Follows as F, Users as U WHERE F.followee_id = U.uid AND follower_id=$1',
      [id],
    );
    res.json(r.rows);
  } catch (err) {
    res.status(400).send(err);
  }
};

// See all the users following someone

const usersFollowsGet = async (req, res, pool) => {
  try {
    // id of the target user
    const { id } = req.params;

    const r = await pool.query(
      'SELECT U.uid,U.username,U.password FROM Follows as F, Users as U WHERE F.follower_id = U.uid AND F.followee_id=$1',
      [id],
    );
    res.json(r.rows);
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** UNFOLLOWING *********** */

// unfollow a specific user

const usersUnfollowPost = async (req, res, pool) => {
  try {
    // user to be unfollowed
    const { id } = req.params;

    const { RegisteredUser } = req.body;

    await pool.query(
      'DELETE FROM Follows WHERE follower_id=$1 AND followee_id=$2',
      [RegisteredUser, id],
    );
    res.status(200).end();
  } catch (err) {
    res.satus(400).send(err);
  }

  // body must include the id of the user who is going to do the unfollowing
};

/* *********** Blocking *********** */

// block specific user

const usersBlockPost = async (req, res, pool) => {
  try {
    // id of the user that is going to be blocked

    const { id } = req.params;
    const { RegisteredUser } = req.body;

    await pool.query(
      'INSERT INTO Blocks (blocker_id,blockee_id) VALUES($1,$2)',
      [RegisteredUser, id],
    );
    res.status(201).end();
  } catch (err) {
    res.status(400).send(err);
  }
  // body must include the id of the user who is going to do the blocking
};

// See all the users blocked by someone

const usersBlockedByGet = async (req, res, pool) => {
  try {
    // id of the user that has blocked
    const { id } = req.params;

    const r = await pool.query(
      'SELECT U.uid, U.username, U.password FROM Blocks as B, Users U WHERE B.blockee_id = U.uid AND B.blocker_id = $1',
      [id],
    );
    res.json(r.rows);
  } catch (err) {
    res.status(400).send(err);
  }
};

// See all users blocking someone

const usersBlockGet = async (req, res, pool) => {
  try {
    // id of the user who is blocked
    const { id } = req.params;

    const r = await pool.query(
      'SELECT U.uid, U.username, U.password FROM Blocks as B, Users U WHERE B.blocker_id = U.uid AND B.blockee_id = $1',
      [id],
    );
    res.json(r.rows);
  } catch (err) {
    res.status(400).send(err);
  }
};

/* *********** Unblock *********** */

// Unblock a specfic user

const usersUnblockPost = async (req, res, pool) => {
  try {
    // person to be unblocked
    const { id } = req.params;
    const { RegisteredUser } = req.body;

    await pool.query(
      'DELETE FROM Blocks WHERE blocker_id = $1 AND blockee_id = $2',
      [RegisteredUser, id],
    );
    res.status(200).end();
  } catch (err) {
    res.status(400).send(err);
  }

  // body should include the id of the person who is going to unblock
};

module.exports = {
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
};
