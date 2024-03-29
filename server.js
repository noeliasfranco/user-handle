 
 var express = require('express'),
    path = require('path'),
    http = require('http'),
    users = require('./routes/users');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/', users.findAll);
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

server.listen(app.get('port'), function () {
     console.log("Express server escuchando en puerto" + app.get('port'));
 });

