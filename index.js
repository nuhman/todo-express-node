var express = require('express');
var session = require('cookie-session');
var bodyParser = require('body-parser');

var urlEncodedParser = bodyParser.urlencoded({extended: false});
var app = express();

app.use(session({secret : 'therootpass'}))

.use(function(req, res, next){
    if(typeof(req.session.todolist) == 'undefined'){
      req.session.todolist = [];
    }
    next();
})

.get('/todo', function(req, res){
    res.render('home.ejs',{tasks : req.session.todolist });
})

.post('/todo/add/', urlEncodedParser, function(req, res){
    if(req.body.newtodo != ''){
      req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todo');
})

.get('/todo/delete/:id', function(req, res){
    if(req.params.id != ''){
      req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

.use(function(req, res){
   res.redirect('/todo');
})

.listen(8080);
