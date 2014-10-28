var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app).listen(3000);
var SerialPort = require('serialport').SerialPort;

var serialport = new SerialPort(
    '/dev/tty.usbmodem1421', {
    baudrate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1
    }, false);

console.log('Enter tweets;polarity..\n');

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (input) {
    if ( !input ) return;
    sendData(input.replace(/(\r\n|\n|\r)/gm,''));
});

var sendData = function(data){
    serialport.open( function(err) {
        if ( err ) return console.error('Could not open Serial Port...');
        console.log('Sending to port: ' + data);
        serialport.write(data);
        serialport.close();
    });
};
