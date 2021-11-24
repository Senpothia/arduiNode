var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200);
  res.end('Salut Locoduino !');
});
server.listen(8081);
console.log("Server Ok");