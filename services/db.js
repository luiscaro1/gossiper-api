const { Pool } = require('pg');

const initializeDB = async () => {
  const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    database: 'gossiper:1.0-db',
    host:
      process.env.NODE_ENV === 'production'
        ? 'https://gossiper-db.herokuapp.com/'
        : 'db',
    port: 5432,
  });
  // adds the tables if they don't already exist
  try {
    await pool.query(
      `CREATE TABLE Users (
        uid SERIAL UNIQUE,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE Posts (
        pid SERIAL UNIQUE,
        uid INT,
        FOREIGN KEY (uid) REFERENCES Users(uid),
        content VARCHAR(255) NOT NULL UNIQUE,
        timestamp BIGINT NOT NULL
      );

      CREATE TABLE Follows (
        follower_id INT,
        followee_id INT,
        FOREIGN KEY (follower_id) REFERENCES Users(uid),
        FOREIGN KEY (followee_id) REFERENCES Users(uid),
        PRIMARY KEY(follower_id,followee_id)
      );

      CREATE TABLE Blocks (
        blocker_id INT,
        blockee_id INT,
        FOREIGN KEY (blocker_id) REFERENCES Users(uid),
        FOREIGN KEY (blockee_id) REFERENCES Users(uid),
        PRIMARY KEY(blocker_id,blockee_id)
      );

      CREATE TABLE Replies (
        rid SERIAL UNIQUE,
        uid INT,
        FOREIGN KEY (uid) REFERENCES Users(uid),
        content VARCHAR(255) NOT NULL UNIQUE,
        timestamp BIGINT NOT NUll
      );

      CREATE TABLE Shares (
        sid SERIAL UNIQUE,
        uid INT,
        pid INT,
        FOREIGN KEY (uid) REFERENCES Users(uid),
        FOREIGN KEY (pid) REFERENCES Posts(pid),
        timestamp BIGINT NOT NUll
      );

      CREATE TABLE Likes (
        uid INT,
        pid INT,
        FOREIGN KEY (uid) REFERENCES Users(uid),
        FOREIGN KEY (pid) REFERENCES Posts(pid),
        timestamp BIGINT NOT NUll,
        PRIMARY KEY(uid,pid)

      );

      CREATE TABLE Unlikes (
        uid INT,
        pid INT,
        FOREIGN KEY (uid) REFERENCES Users(uid),
        FOREIGN KEY (pid) REFERENCES Posts(pid),
        timestamp BIGINT NOT NULL,
        PRIMARY KEY(uid,pid)

      );
  `,
    );
  } catch (err) {
    console.log(err);
  }

  return pool;
};

module.exports = initializeDB;