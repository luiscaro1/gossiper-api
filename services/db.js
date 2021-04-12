const { Pool } = require('pg');

const config =
  process.env.NODE_ENV === 'production'
    ? {
        user: 'maowirxtskyrlg',
        password:
          '79ee56f51477b3b086001ddf50991c38512481a09118ed5cd903ec5723befe7c',
        database: 'd6sv9kgmerqsqu',
        host:
          process.env.NODE_ENV === 'production'
            ? 'ec2-52-21-153-207.compute-1.amazonaws.com'
            : 'db',
        port: 5432,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        user: 'postgres',
        password: 'postgres',
        database: 'gossiper:1.0-db',
        host: 'db',
        port: 5432,
      };

const initializeDB = async () => {
  const pool = new Pool(config);
  // adds the tables if they don't already exist
  try {
    await pool.query(
      `CREATE TABLE Users (
        uid SERIAL UNIQUE PRIMARY KEY ,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );

      CREATE TABLE Posts (
        pid SERIAL UNIQUE PRIMARY KEY,
        uid INT REFERENCES Users ON DELETE CASCADE,
        content VARCHAR(255) NOT NULL UNIQUE,
        timestamp BIGINT NOT NULL
      );

      CREATE TABLE Follows (
        follower_id INT REFERENCES Users (uid) ON DELETE CASCADE,
        followee_id INT REFERENCES Users (uid) ON DELETE CASCADE ,
        PRIMARY KEY(follower_id,followee_id)
      );

      CREATE TABLE Blocks (
        blocker_id INT REFERENCES Users (uid) ON DELETE CASCADE,
        blockee_id INT REFERENCES Users (uid) ON DELETE CASCADE,
        PRIMARY KEY(blocker_id,blockee_id)
      );

      CREATE TABLE Replies (
        uid INT REFERENCES Users (uid) ON DELETE CASCADE,
        pid INT REFERENCES Posts (pid) ON DELETE CASCADE,
        content VARCHAR(255) NOT NULL UNIQUE,
        PRIMARY KEY(uid,pid),
        timestamp BIGINT NOT NUll
      );

      CREATE TABLE Shares (
        uid INT REFERENCES Users (uid) ON DELETE CASCADE,
        pid INT REFERENCES Posts (pid) ON DELETE CASCADE,
        PRIMARY KEY(uid,pid),
        timestamp BIGINT NOT NUll
      );

      CREATE TABLE Likes (
        uid INT REFERENCES Users (uid) ON DELETE CASCADE,
        pid INT REFERENCES Posts (pid) ON DELETE CASCADE,
        timestamp BIGINT NOT NUll,
        PRIMARY KEY(uid,pid)
      );

      CREATE TABLE Unlikes (
        uid INT REFERENCES Users (uid) ON DELETE CASCADE,
        pid INT REFERENCES Posts (pid) ON DELETE CASCADE,
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
