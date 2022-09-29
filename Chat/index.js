var express = require('express');
const app = express();
var server = require('http').createServer(app);
var url = require('url');
var io = require('socket.io')(server);
var fs = require('fs')
// io.eio.pingInterval = 5000;
// io.eio.pingTimeout = 60000;
var morgan = require('morgan')
app.use(morgan(':date[iso] :method :url', {
    stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));

server.listen(3000);
app.get('/', function(request, respons){
    respons.sendFile(__dirname + '/index.html')
});
app.post('/',morgan(':date[iso] :method :url') ,function(req, res){
	return res.end("This is Chat" ) 
})


var users = new Map();
connections = [];


io.sockets.on('connection', function(socket){
    // console.log("connect");
    connections.push(socket);
    let id = socket.id;



    socket.on('login', function (nickname) {
    	io.sockets.emit('login_notification', {nickname:nickname})
    	users.set(id, nickname);
    })

	socket.on('send_message', function(data){
		io.sockets.emit('add_message', {mess: data.mess, name: data.name});
	})
  
    socket.on('disconnect', function(socket){
    	io.sockets.emit('logout', {text:users.get(id)});
        connections.splice(connections.indexOf(socket), 1);
        // console.log("disconnect");
    });

});

	