
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  user = require('./routes/user'),
  http = require('http'),
  redis = require('redis'),
 multer  = require('multer'),
  path = require('path');

var app = express();
var client = redis.createClient(6379, '127.0.0.1', {})
client.set("devOpsKey", "false");
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
  res.render('index', {
    title: 'Home'
  });
});

app.get('/about', function(req, res){
  client.get("devOpsKey", function(err,value){ 
    if (err) throw err
    console.log("listening at port 3000 "+value);
    //console.log(value);
    //res.send(value);
    if(value=="true"){
       res.render('aboutFeature', {
        title: 'AboutFeature'
      });
     }else{
        res.render('about', {
        title: 'About'
      });
     }
  });
  
});

app.get('/contact', function(req, res){
  res.render('contact', {
    title: 'Contact'
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

