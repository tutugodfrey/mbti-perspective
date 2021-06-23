const dotenv = require('dotenv');
const { connection } = require('./connection');
const dbConfig = require('./dbConfig');

dotenv.config();
const env = process.env.NODE_ENV || 'dev';
const dbUrl = process.env[dbConfig[env]];
const Connection = connection(dbUrl);

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

createTable(Connection);
module.exports.createTable = createTable;
