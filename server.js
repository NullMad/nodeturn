//setup Dependencies
var connect = require('connect')
    , http = require('http')
    , express = require('express')
    , routes = require('./routes')
    , lobby = require('./routes/lobby')
    , port = (process.env.PORT || 8081)
    , _ = require('underscore')
    , path = require('path');

//Setup Express
var app = express();
var server = app.listen(port);
var io = require('socket.io').listen(server);

var cookieParser = express.cookieParser('tOp sEcReT!1!')
    , sessionStore = new connect.middleware.session.MemoryStore();

var SessionSockets = require('session.socket.io')
    , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

//app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(connect.bodyParser());
app.use(express.methodOverride());
app.use(cookieParser);
app.use(express.session({ store: sessionStore }));
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

var sockconns={};
sessionSockets.on('connection', function(err, socket, session){

    socket.on('set nickname', function (name) {
        socket.set('nickname', name, function () {
            if(!session) return;

            session.name = name;

            io.sockets.clients().forEach(function (ssocket) {
                // so far we have access only to client sockets
                sessionSockets.getSession(ssocket, function (err, ssession) {
                    // getSession gives you an error object or the session for a given socket
                    sockconns[ssocket.id] = ssession.name;
                });
            });
            console.log(sockconns);
            var names = [];

            session.players = sockconns;
            session.save();
            socket.emit('ready');
            socket.broadcast.emit('new player',{id: socket.id, nick: name});
        });
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


