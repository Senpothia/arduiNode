const { parse } = require('path')
const serialPort = require('serialport')
const WebSocketServer = require('ws').Server;



const SERVER_PORT = 8081;               // port number for the webSocket server
let wss = new WebSocketServer({ port: SERVER_PORT }); // the webSocket server
let connections = new Array;          // list of connections to the server

const port = new serialPort(
    'COM4',
    { baudRate: 9600 }
)

const parser = new serialPort.parsers.Readline()

port.pipe(parser)

parser.on('data', (line) => {
    console.log('Arduino dit: ' + line)
    port.write('envoi vers arduino: bien lu:')
})