const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const PORT = process.env.PORT || 3000;
//const formateMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'Public')));


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));