var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var five = require("johnny-five");
var board = new five.Board();
var led;

app.use('/public', express.static(__dirname + '/public'));

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



board.on("ready", function() {
	led = new five.Led(13);
  	led.blink(); 
});


io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('command', function(command) {
  	console.log(command);
  	switch(command) {
  		case 'turn on': 
  			led.on();
  			break;
  		case 'turn off':
  			led.stop().off();
  			break;
  		case 'blink':
  			led.blink();
  			break;
  	}
    
  });
});


server.listen(3000, function () {
    console.log('Server listening at port 3000');
});