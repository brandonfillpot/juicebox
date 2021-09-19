require('dotenv').config();
const PORT = 3000;
const express = require('express');
const apiRouter = require('./api');
const server = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { client } = require('./db');
server.use(morgan('dev'));
server.use(bodyParser.json());
client.connect();




server.use('/api', apiRouter);

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});





