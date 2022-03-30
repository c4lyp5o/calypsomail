// init express stuff
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// init routes
const calypsomail = require('./route');

// create express app
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// add other middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// add routes
app.use('/', calypsomail);

// // init DB
// const db = 'mongodb://localhost:27017/calypsodrop';
// mongoose
//   .connect(db, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log('Connected to Drops Database!');
//   })
//   .catch(err => {
//     console.error('Could not Connect to Database!', err);
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

module.exports = app;