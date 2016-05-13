/*var express = require('express');
var nunjucks = require('nunjucks');
var env = require('./env');
var Cloudant = require('cloudant');
var bodyParser = require('body-parser');

var app = express();
var cloudant = Cloudant(env.getDbUrl());
var db = cloudant.use(env.db.database);

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(__dirname + '/public'));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', function(req, res) {
  db.list({include_docs: true}, function(err, body) {
    if (!err) {
      var todos = [];
      body.rows.forEach(function(doc) {
        todos.push(doc.doc);
      });
      res.render('index.html', {todos: todos});
    } else {
      res.render('erro.html', {erro: err});
    }
  });
});

app.post('/', function(req, res) {
  var todo = { todo: req.body.todo};
  db.insert(todo);
  res.redirect('/');
});

app.get('/update/:id', function(req, res) {
  var id = req.params.id;
  db.get(id, {include_docs: true}, function(err, body){
    if(err) {
      res.render('erro.html', {erro: err});
    }
    res.render('update.html', {todo: body});
  });
});

app.put('/', function(req, res) {
  var todo = { _id: req.body.id, _rev: req.body.rev, todo: req.body.todo};
  db.insert(todo);
  res.send('ok');
});

app.delete('/:id/:rev', function(req, res) {
  var id = req.params.id;
  var rev = req.params.rev;
  db.destroy(id, rev);
  res.send('ok');
});

app.listen(env.port, function(){
  console.log('app escutando na porta %s', env.port);
});
*/