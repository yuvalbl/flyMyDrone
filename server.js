const path = require('path');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const drone = require('ar-drone').createClient({ip: '1.1.1.222'});

const SPEED = .1;

// serve client files
app.use('/', express.static(path.join(__dirname + '/client')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'))
});

// client - server socket communication
io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('move', function (move) {
        if(move === 'up' ||
            move === 'down' ||
            move === 'counterClockwise' ||
            move === 'clockwise') {
            drone[move](SPEED * 2);
            drone.after(800, drone.stop);
        } else {
            drone[move](SPEED);
            drone.after(200, drone.stop);
        }
        console.log(`${move} at speed of ${SPEED}`);
    });

    socket.on('takeoff', function () {
        console.log('takeoff');

        drone.takeoff(function(){
            console.log('airbone');
        });
    });

    socket.on('land', function () {
        console.log('land');
        drone.stop();
        drone.land(function(){
            console.log('landed');
        })
    })
});

app.get('/stop', function () {
    console.log('emergency landing');
    drone.stop();
    drone.land(function(){
        console.log('emergency landed');
    })
});


server.listen(3001, function(){
    console.log('Client is available at http://localhost:3001');
});
