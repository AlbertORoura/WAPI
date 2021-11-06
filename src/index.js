const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './.env') })
require('./mongo')

const morgan = require('morgan');
const express = require('express');
const app = express();
const routes = require('./routes/routes');


// settings
const PORT = process.env.PORT
app.set('json spaces', 2);

// middleware
app.use(morgan('dev'));
app.use(express.json());

// routes
app.use('./routes', routes);
app.use(require('./routes/routes'))

// static files

// error handlers

// start the server

app.listen(PORT, function () {
    console.log(`server on port ${PORT}`);
});