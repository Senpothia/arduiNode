var usbserial = 'COM4';
//var usbserial = '/dev/cu.usbserial-AL02VFGY';

var http = require('http');
var fs = require('fs');
var path = require("path");
var url = require("url");

// Gestion des pages HTML
function sendError(errCode, errString, response) {
  response.writeHead(errCode, {"Content-Type": "text/plain"});
  response.write(errString + "\n");
  response.end();
  return;
}

function sendFile(err, file, response) {
  if(err) return sendError(500, err, response);
  response.writeHead(200);
  response.write(file, "binary");
  response.end();
}

function getFile(exists, response, localpath) {
  if(!exists) return sendError(404, '404 Not Found', response);
  fs.readFile(localpath, "binary",
   function(err, file){ sendFile(err, file, response);});
}

function getFilename(request, response) {
  var urlpath = url.parse(request.url).pathname; 
  var localpath = path.join(process.cwd(), urlpath); 
  fs.exists(localpath, function(result) { getFile(result, response, localpath)});
}

var server = http.createServer(getFilename);

// -- socket.io --
// Chargement
var io = require('socket.io')(server);

// -- SerialPort --
// Chargement
var SerialPort = require('serialport');
var arduino = new SerialPort(usbserial, { autoOpen: false });


// Overture du port serie
arduino.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  else {
    console.log ("Communication serie Arduino 9600 bauds : Ok")
  }
});


// Requetes: traitement communication entre HTML et Server

io.sockets.on('connection', function (socket) {
	// Message à la connection
  console.log('Connexion socket : Ok');
  socket.emit('message', 'Connexion : Ok\n');   // envoi vers html
    // Le serveur reçoit un message du navigateur    
    socket.on('message', function (msg) {
      console.log('reçu de html: ' + msg);        // impression message reçu de html
      socket.emit('message', 'commande envoyé au serveur: ' + msg);
	  
      arduino.write(msg, function (err) {   // envoi vers arduino
		  if (err) {
		  	io.sockets.emit('message', err.message);
		  	return console.log('Error: ', err.message);
		  }
		});
	});
});

// Communication entre Arduino et Serveur

arduino.on('data', function (data) {
//const firstBuf = Buffer.alloc(1024);
  console.log(data.toString('utf8'));
   io.sockets.emit('message', data.toString('utf8'));   // transmet une string pure vers HTML
  /**
  //data="bonjour";   // string pure à transmettre
	let buf = new Buffer(data);
  //let buf = Buffer.from(data);
  io.sockets.emit('message', buf.toString('utf8'));   // transmet une string pure vers HTML
   //io.sockets.emit('message', data);
  console.log(buf.toString('utf8'));
  //console.log(buf);
  **/
  
});

server.listen(8081);
console.log("Serveur : Ok");