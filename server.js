var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app).listen(3000);
var SerialPort = require('serialport').SerialPort;
var twitter = require('ntwitter');
var sentiment = require('sentiment');

/*
 * Twitter configs
 */
var twit = new twitter({
  consumer_key: 'fntGjoIFh43OOARjCy5t9l4cm',
  consumer_secret: 'bEylHfjrxDK4CzYGguxF1F0lCRqFl1w92tW0OdsPfM8VvDJiuO',
  access_token_key: '61876585-773CaAgTosXC0Ss5UUpJ4vHjtOxu3NjLHKa7g3PPt',
  access_token_secret: 'eLjTEXI6Wof6liyE9ygZGE55r5ZW7kH1bT7qR72kpp8qC'
});

/*
 * Serial port configs
 */
var serialport = new SerialPort(
    '/dev/tty.usbmodem1421', {
    baudrate: 9600,
    parity: 'none',
    dataBits: 8,
    stopBits: 1
    }, false);

/*
 * Define global vars
 */
var HASHTAG = '';
var tweetCount = 0;
var tweetTotalPolarity = 0;
var tweetPolarity = 0;

/*
 * Init twitter stream and sentiment analysis.
 */
var init = function () {
    if ( !HASHTAG ) return console.error('No hashtag assigned');
    twit.verifyCredentials(function (err, data) {
        if ( err ) return console.error('Error connecting to Twitter: ' + err);
        stream = twit.stream('statuses/filter', {
            'track': HASHTAG
        }, function (stream) {
            console.log('Monitoring Twitter for \'' + HASHTAG + '\'...  Logging Twitter traffic.');
            stream.on('data', function (data) {
                if (data.lang === 'en') {
                    sentiment(data.text, function (err, result) {
                        tweetCount++;
                        tweetTotalPolarity += result.score;
                        tweetPolarity = tweetTotalPolarity / tweetCount;
                        tweet = data.text.replace(/(\r\n|\n|\r)/gm,'');
                        console.log('Tweet count: ' + tweetCount + '; polarity: ' + tweetPolarity + '; tweet: ' + tweet);
                        if ( tweetCount % 10 === 0 ) {
                            sendData(tweetCount + ';' + tweetPolarity);
                        }
                    });
                }
            });
        });
    });
};

/*
 * Send data to the usb port
 */
var sendData = function(data){
    serialport.open( function(err) {
        if ( err ) return console.error('Could not open Serial Port...');
        console.log('\n ---> Sending to serial port: ' + data + ' <---\n');
        serialport.write(data);
        serialport.close();
    });
};

/*
 * Present user with a welcome message, let them enter search term.
 */
console.log('Welcome to Twitter Windmills\n');
console.log('Enter search term: \n');
process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdin.on('data', function (input) {
    input = input.replace(/(\r\n|\n|\r)/gm,'');
    if ( !input ) {
        console.log('Got no keywords, shutting down. :(\n');
        return process.exit(1);
    }
    console.log('Initializing sentiment analysis for \"' + input + '\", hold on.....\n\n\n');
    HASHTAG = input;
    init();
});
