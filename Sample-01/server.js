const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const { join } = require('path');
const authConfig = require('./auth_config.json');

const app = express();

const port = process.env.SERVER_PORT || 4200;

app.use(morgan('dev'));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(express.static(join(__dirname, 'dist')));

app.listen(port, () => console.log(`App server listening on port ${port}`));
