const express = require('express');
const app = express();
const cors = require('cors');
const staticFile = require('connect-static-file');

app.use(cors());
app.use('/silent', staticFile(`${__dirname}/silent.html`));

app.listen(3001);
console.log('Listening on http://localhost:3001');
