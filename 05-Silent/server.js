const express = require('express');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const staticFile = require('connect-static-file');
require('dotenv').config();

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(cors());
app.use('/silent', staticFile(`${__dirname}/silent.html`));

app.listen(3001);
console.log('Listening on http://localhost:3001');
