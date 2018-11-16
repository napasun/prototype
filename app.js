const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const coreRouter = require('./routes/core');
const usersRouter = require('./routes/users');
const packBookListRouter = require('./routes/packBook/pack');
const packkoListRouter = require('./routes/packBook/packko');
const mdRouter = require('./routes/md/md');
const wikiRouter = require('./routes/wiki/wiki');
const youtubeRouter = require('./routes/youtube/youtube');
const boardRouter = require('./routes/board/board');
const schedule = require('./routes/packBook/schedule');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/layout');
app.set("layout extractScripts", true);
app.use(expressLayouts);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/core', coreRouter);
app.use('/users', usersRouter);
app.use('/pack', packBookListRouter);
app.use('/packko', packkoListRouter);
app.use('/wiki', wikiRouter);
app.use('/youtube', youtubeRouter);
app.use('/md', mdRouter);
app.use('/board', boardRouter);

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
schedule.translateSchedules()
module.exports = app;
