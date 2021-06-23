const { Pool } = require('pg');

let pool;
const connection = (connectionString) => {
  if (!connectionString) return 'No connection string provided! Please provide database connection string to connect.';
  try {
    pool = new Pool({
      connectionString,
    });
    return pool;
  } catch (err) {
    console.log(err);
    throw Error('Could not connect to database! Please check you connection string and confirm the database is running');
  }
};

module.exports.connection = connection;
