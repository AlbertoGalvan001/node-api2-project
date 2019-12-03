const express = require('express');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda API2 Project</h>
    <p>Welcome to the Lambda API2 Project</p>
  `);
});

module.exports = server;