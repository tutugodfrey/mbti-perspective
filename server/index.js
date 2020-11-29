const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { connection, createTable } = require('./connection');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));
app.get('/*', (req, res) => {
  return res.status(200).sendFile('index.html')
});

const dbUrl = process.env.DATABASE_URL;
const db_connection = connection(dbUrl);

// create database table, if not exists;
createTable(db_connection);
app.post('/result', async (req, res) =>  {
  const userData = req.body;
  const queryString = `INSERT INTO mbti_result (
                      answer1, answer2, answer3, answer4, answer5, answer6, answer7, answer8, answer9, answer10, mbtiscore, email)
                      VALUES ('${userData['0']}',
                              '${userData['1']}',
                              '${userData['2']}',
                              '${userData['3']}',
                              '${userData['4']}',
                              '${userData['5']}',
                              '${userData['6']}',
                              '${userData['7']}',
                              '${userData['8']}',
                              '${userData['9']}',
                              '${userData['mbtiScore']}',
                              '${userData['email']}')
                              returning *;`;
  return db_connection.query(queryString).then(result => {
    return res.status(200).json(result.rows[0]);
  })
  .catch(err => {
    return res.status(500).json({ message: err })
  });
});

const port = process.env.PORT || 3005;
app.listen(port, () => console.log(`express app listening on port ${port}`));
