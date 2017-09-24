var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded({extended: false});
var app = express();

app.use(session({secret : 'therrootpass'}))

.use(express.static(__dirname + '/public'))

.use(function(req, res, next){
    if(typeof(req.session.todolist) == 'undefined' || typeof(req.session.completed) == 'undefined'){
      req.session.todolist = [];
      req.session.completed = [];
      req.session.detailed = 0; //false
      console.log('initialized');
    }
    next();
})

.get('/todo', function(req, res){
    res.render('index.ejs',
    {
      tasks : req.session.todolist,
      completed : req.session.completed,
      detailed : req.session.detailed
    });
})

.post('/todo/add/', urlEncodedParser, function(req, res){
    if(req.body.todosent != ''){
      //var text =
      var obj = [req.body.todosent,req.body.startdate,req.body.location,req.body.attendees,req.body.comments];
      req.session.todolist.push(obj);
      console.log(req.session.todolist);
      req.session.completed.push(0);
    }
    res.redirect('/todo');
})

.get('/todo/delete/:id', function(req, res){
    if(req.params.id != ''){
      req.session.todolist.splice(req.params.id, 1);
      req.session.completed[req.params.id] = 0;
      req.session.completed.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

.get('/todo/deleteAll', function(req, res){
    req.session.todolist = [];
    req.session.completed = [];
    res.redirect('/todo');
})


.get('/todo/okay/:id', function(req, res){
  if(req.params.id != ''){
    if(req.session.completed[req.params.id] === 0)
      req.session.completed[req.params.id] = 1;
    else
      req.session.completed[req.params.id] = 0;
  }
  res.redirect('/todo');
})

.get('/todo/edit/:id', function(req, res){
  if(req.params.id != ''){
    var text = req.session.todolist[req.params.id];
    //document.getElementById("todosent").value = text;
  }
  res.redirect('/todo');
})

.get('/todo/detailed', function(req, res){
  if(req.session.detailed === 0)
    req.session.detailed = 1;
  else
    req.session.detailed = 0;
  res.redirect('/todo');
})

.use(function(req, res){
   res.redirect('/todo');
})

.listen(8080);
