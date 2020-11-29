const  { Pool } = require('pg');

let pool;
const connection = (connectionString, models=[]) => {
  if (!connectionString) return 'No connection string provided! Please provide database connection string to connect.';
  try {
    pool = new Pool({
      connectionString,
    });
  } catch (err) {
    console.log(err)
    throw 'Could not connect to database! Please check you connection string and confirm the database is running';
  }

  if (models.length) {
    models.forEach(model => model.db_connection = pool);
  }
  return pool;
}

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

function createTable(db_connection) {
  db_connection.query(tableQuery).then(result => {
    console.log('TABLE CREATED OR IT ALREADY EXIST');
  })
  .catch(err => {
    console.log(err);
  });
};

// export default pool;
module.exports.connection = connection
module.exports.createTable = createTable;
