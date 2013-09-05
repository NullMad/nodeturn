//setup Dependencies
var connect = require('connect')
    , http = require('http')
    , express = require('express')
    , routes = require('./routes')
    , lobby = require('./routes/lobby')
    , port = (process.env.PORT || 8081)
    , path = require('path');

//Setup Express
var app = express();
var server = app.listen(port);
var io = require('socket.io').listen(server);

//app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(connect.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: "shhhhhhhhh!"}));
app.use(connect.static(path.join(__dirname + '/static')));
app.use(app.router);
app.use(function(err, req, res, next){
    console.log("Error " + err);
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: {
            title : '404 - Not Found'
            ,description: ''
            ,author: ''
            ,analyticssiteid: 'XXXXXXX'
        },status: 404 });
    } else {
        res.render('500.jade', { locals: {
            title : 'The Server Encountered an Error'
            ,description: ''
            ,author: ''
            ,analyticssiteid: 'XXXXXXX'
            ,error: err
        },status: 500 });
    }
});

var sockconns=0;
io.sockets.on('connection', function(socket){
    sockconns++;
    socket.on('set nickname', function (name) {
        socket.set('nickname', name, function () {
            console.log("NICK SET");
            socket.emit('ready');
        });
    });
    socket.on('ping clients',function(name){
       //console.log(io.sockets.clients());
    });
    //console.log(socket);
  socket.on('message', function(data){
      socket.get('nickname', function (err, name) {
          console.log('Chat message by ', name);
      });
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});


///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

app.get('/', routes.index);
app.get('/lobby', lobby.list);

//A Route for Creating a 500 Error (Useful to keep around)
app.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


