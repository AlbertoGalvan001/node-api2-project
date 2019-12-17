const express = require('express');
const hubsRouter = require('../posts/db-router.js');

const server = express();

server.use('/api/posts', hubsRouter);

server.get('/', (req, res) => {
    res.send(`
    <h2>Lambda API2 Project</h>
    <p>Welcome to the Lambda API2 Project</p>
  `);
});

module.exports = server;