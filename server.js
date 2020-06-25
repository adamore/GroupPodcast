const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');
const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socket(server);


// var roomData {
// 	roomUsers: [],
// 	roomID: null,
// 	videoID: null,
// 	timestamp: null,
// 	playerState: null,
// }
var roomsInUse = new Map();
app.use(express.static(path.join(__dirname + '/Public')));
app.use(bodyParser.urlencoded({
  extended: true
}));

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get('/', (req,res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
})
app.get('/createRoom', (req, res) => {
	var roomNum = (Math.random()*0xFFFFFF<<0).toString(16);
	console.log(`Creating room number ${roomNum}`);
	while (roomsInUse.has(roomNum)) {
		roomNum = Math.random().toString();
	}; 
	var roomData = {
		roomUsers: [],
		roomID: roomNum,
		videoID: null,
		timestamp: null,
		playerState: null,
	}
	roomsInUse.set(roomNum, roomData);
	res.send(roomNum);
});

app.get('/rooms/*', (req,res) => {
	console.log("Redirecting user to room.");
	console.log(path.join(__dirname + '/Public/rooms.html'));
	//return res.redirect('/rooms.html');
	res.sendFile(path.join(__dirname + '/Public/rooms/rooms.html'));	
});

io.on('connection', (socket) => {
	var roomData;
	console.log("User has connected.");
	io.to(socket.id).emit('connectedToRoom', socket.id)
	socket.on('room' , function(room) {
		socket.join(room);
		if(roomsInUse.has(room)) {
			roomData = roomsInUse.get(room);
			roomData.roomUsers.push(socket.id);
		}
		else
		{
			var roomData = {
				roomUsers: [],
				roomID: room,
				videoID: null,
				timestamp: null,
				playerState: null,
			};
			roomData.roomUsers.push(socket.id);
			roomsInUse.set(roomNum, roomData);
		}
		io.to(socket.id).emit('initPlayer', roomData)
		// console.log("User joined room.");
		// io.to(socket.id).emit('initVideoData', roomData);
		// socket.to(room).emit('userJoined');
	});
	socket.on('changeVideoState', function(data) {
		console.log(`Changing state of video to ${data.playerState}`);
		var roomNum = data.roomNum;
		if(roomsInUse.has(roomNum)){
			roomsInUse.get(roomNum).playerState = data.playerState;
		}
		io.in(roomNum).emit('videoStateChanged', data.playerState);
	})
	// socket.on('videoPlaying', function(data) {
	// 	io.sockets.in(data.roomNum).emit('currentVideoData', data);
	// })
	socket.on('changingVideo', function(data) {
		console.log("Changing video in room.");
		var roomNum = data.roomNum;
		if(roomsInUse.has(roomNum)){
			roomsInUse.get(roomNum).videoID = data.videoID;
			roomsInUse.get(roomNum).playerState = -1;
		}
		io.in(roomNum).emit('videoChanged', data.videoID);
	})
	socket.on('timeChanged', function(data) {
		console.log(`User changed time to ${data.timestamp}`);
		var roomNum = data.roomNum;
		if(roomsInUse.has(roomNum)){
			roomsInUse.get(roomNum).timestamp = data.timestamp;
		}
		io.in(roomNum).emit('changeVideoTime', data.timestamp);

	})
})