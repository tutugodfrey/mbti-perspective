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

const tableQuery = `CREATE TABLE IF NOT EXISTS mbti_result (
  id SERIAL NOT NULL PRIMARY KEY,
  answer1 INT NOT NULL,
  answer2 INT NOT NULL,
  answer3 INT NOT NULL,
  answer4 INT NOT NULL,
  answer5 INT NOT NULL,
  answer6 INT NOT NULL,
  answer7 INT NOT NULL,
  answer8 INT NOT NULL,
  answer9 INT NOT NULL,
  answer10 INT NOT NULL,
  mbtiscore VARCHAR(10) NOT NULL,
  email VARCHAR(30) NOT NULL UNIQUE
);`;

function createTable(dbConnection) {
  return dbConnection.query(tableQuery)
    .then(() => {
      console.log('TABLE CREATED OR IT ALREADY EXIST');
    })
    .catch((err) => console.log(err));
}

// export default pool;
module.exports.connection = connection;
module.exports.createTable = createTable;
