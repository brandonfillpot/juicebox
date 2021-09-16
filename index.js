const PORT = 3000;
const express = require('express');
const apiRouter = require('./api');
const server = express();
const { client } = require('./db');
client.connect();


server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});


server.use('/api', apiRouter);

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));
