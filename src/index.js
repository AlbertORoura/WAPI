const morgan = require('morgan');
// import morgan from 'morgan';
const express = require('express');
// import express from 'express';
const app = express();

const userRoutes = require('./routes/users');
// import userRoutes from './routes/users';

// settings
app.set('port', process.env.PORT || 3001);
app.set('json spaces', 2);

// middleware
app.use(morgan('dev'));
app.use(express.json());

// routes
app.use('./users', userRoutes);
app.use(require('./routes/users'))

// static files

// error handlers

// start the server
app.listen(app.get('port'), function () {
    console.log('server on port ', app.get('port'));
});