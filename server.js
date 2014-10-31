var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app).listen(3000);
var SerialPort = require('serialport').SerialPort;
var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: 'fntGjoIFh43OOARjCy5t9l4cm',
  consumer_secret: 'bEylHfjrxDK4CzYGguxF1F0lCRqFl1w92tW0OdsPfM8VvDJiuO',
  access_token_key: '61876585-773CaAgTosXC0Ss5UUpJ4vHjtOxu3NjLHKa7g3PPt',
  access_token_secret: 'eLjTEXI6Wof6liyE9ygZGE55r5ZW7kH1bT7qR72kpp8qC'
});

var serialport = new SerialPort(
    '/dev/tty.usbmodem1421', {
    baudrate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1
    }, false);

var HASHTAG = 'Happy Halloween';
var tweetCount = 0;
var tweetPolarity = 0;

var sendData = function(data){
    serialport.open( function(err) {
        if ( err ) return console.error('Could not open Serial Port...');
        console.log('Sending to port: ' + data);
        serialport.write(data);
        serialport.close();
    });
};

twit.verifyCredentials(function (err, data) {
    if ( err ) return console.error("Error connecting to Twitter: " + err);
    stream = twit.stream('statuses/filter', {
        'track': HASHTAG
    }, function (stream) {
        console.log("Monitoring Twitter for \'" + HASHTAG + "\'...  Logging Twitter traffic.");
        stream.on('data', function (data) {
            tweetCount++;

            // Update the console every 10 analyzed tweets
            if (tweetCount % 10 === 0) {
                console.log("Tweet #" + tweetCount + ":  " + data.text);
            }
        });
    });
});
