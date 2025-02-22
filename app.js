var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var hbs=require('express-handlebars').engine
var db = require('./config/connecion_db')
var session=require('express-session')
var nocache=require('nocache')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
app.engine('hbs',hbs({extname:'hbs',defaultLayout:'layout',layoutDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/',helpers:{math:function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
  return {  
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
  }[operator];
}}}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())
app.use(session({secret:'key',cookie:{maxAge:1800000}}))
app.use(nocache())

db.connect(function(err){
  if(err){
    console.log('connection error')
  }else{
    console.log('database connected to port 27017')
  }
})
app.use('/', userRouter);
app.use('/admin', adminRouter);

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
