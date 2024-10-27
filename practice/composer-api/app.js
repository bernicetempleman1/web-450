const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

var path = require('path');
var indexRouter = require('./routes/index');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);


app.use((req, res, next) => {
   next(createError(404));
  })

  app.use((err, req, res, next) => {
    res.status(err.status || 500);

  res.json({
    type: 'error',
    status: res.status,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined
   })
 });

module.exports = app;
