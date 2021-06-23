const express = require('express');
const dotenv = require('dotenv');
const { connection } = require('../connection');
const dbConfig = require('../dbConfig');

dotenv.config();
const routes = express.Router();
const env = process.env.NODE_ENV || 'dev';
const dbUrl = process.env[dbConfig[env]];
const dbConnection = connection(dbUrl);

// create database table, if not exists;
routes.post('/result', async (req, res) => {
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
                              '${userData.mbtiScore}',
                              '${userData.email}')
                              returning *;`;
  return dbConnection.query(queryString).then((result) => res.status(201).json(result.rows[0]))
    .catch((err) => res.status(500).json({ message: err }));
});

module.exports = routes;
