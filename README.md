# Fly My Drone

### How it was build step by step
init package.json

`npm init`

install require dependencies

`npm i express ar-drone dronestream socket.io socket.io-client`

### How to use it
`npm i`
`node server.js

go to `localhost:3000`

### Drone ip configuration
connect by telnet to drone: `telnet 192.168.1.1`
change ip to `192.168.1.222`

`ifconfig ath0 192.168.1.222 netmask 255.255.255.0 up`


