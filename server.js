const path = require("path");
const express = require("express");
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const drone = require('ar-drone').createClient({ip: "192.168.1.222"});
const MAX_SPEED = 2;

// serve client files
app.use("/client", express.static(path.join(__dirname + '/client')))

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/client/index.html'))
});


drone.on('navdata', function (navdata) {
    io.sockets.emit("navdata", navdata)
});

io.on('connection', function (socket) {
    console.log('a user connected');

    socket.on('keyMove', function (move) {
        if(move.speed > MAX_SPEED) {
            move.speed = MAX_SPEED;
        }
        console.log(`${move.direction} at speed of ${move.speed}`);
        drone[move.direction](move.speed);
    });

    socket.on('takeoff', function () {
        console.log("takeoff");

        drone.takeoff(function(){
            socket.emit("takingOff");
            console.log("airbone");
        });
    });

    socket.on('land', function () {
        console.log("land");
        drone.stop();
        drone.land(function(){
            console.log("landed");
            socket.emit("landed")
        })
    })
});


server.listen(3000, function(){
    console.log("Client is available at http://localhost:3000");
});
require("dronestream").listen(server, {ip: "192.168.1.222"});
