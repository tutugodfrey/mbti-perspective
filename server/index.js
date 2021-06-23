const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use(express.static('public'));
app.use(routes);
app.get('/*', (req, res) => res.status(200).sendFile('index.html',
  { root: path.resolve(__dirname, '../public') }));

module.exports = app;
