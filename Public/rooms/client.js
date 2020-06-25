// var tag = document.createElement('script');
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName('script')[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
// var player = null;

var userData = {
    mod: false, 
    socketID: null,
    roomNum: null,
    url: null,
    videoID: null,
    timestamp: null,
    playerState: null,
    roomUsers: 0
};
// var player = window.frames[0].player;

document.getElementById("getContent").addEventListener("click", function(event) {
    console.log("Sumbission");
    event.preventDefault();
    // if (document.getElementById("content-url").value) {
    //     embedYoutube(document.getElementById("content-url").value);
    // }
    userData.videoID = getVideoID(document.getElementById("content-url").value);
    userData.timestamp = 0.0;
    socket.emit('changingVideo', {
        videoID: userData.videoID,
        roomNum: userData.roomNum
    });
});

//For reference video data template
// var userData = {
//     mod: false, 
//     socketID: null,
//     roomNum: null,
//     url: null,
//     videoID: null,
//     timestamp: null,
//     playerState: null,
//     roomUsers = 0
// };
var interval = null;
socket = io();
function playerReady() {
    socket.emit('room', userData.roomNum)
}; 
socket.on('connect', function() {
    console.log("Connected to room.");
    socket.on('connectedToRoom', function(id) {
        userData.socketID = id;
        console.log(userData.socketID);
    });
    ;
    socket.on('videoStateChanged', function(state) {
        console.log(`New state ${state}`);
        if(state != userData.playerState) {
            userData.playerState = state;
            switch (state){
                case null:
                case -1:
                case 0:
                case 3:
                    break;
                case 1:
                        console.log('Setting interval and playing video.');
                        player.playVideo();
                        if(!interval) {
                            interval = setInterval(checkTime, 3000);
                        }
                        else {
                            clearInterval(interval);
                            interval = setInterval(checkTime, 3000);
                        }
                    break;
                case 5:
                case 2:
                        if(interval) {
                            console.log('Clearing interval');
                            clearInterval(interval);
                            interval = null;
                        }
                        player.pauseVideo();
                    break;
            }
        }
    });
    socket.on('videoChanged', function(videoID) {
        console.log(`New video ${videoID}`);
        userData.videoID = videoID;
        userData.playerState = -1;
        player.cueVideoById(videoID, 0.0);
    });
    socket.on('initPlayer', function(data) {
        userData.videoID = data.videoID;
        if(userData.videoID){  
            console.log(player);
            console.log(userData.videoID)
            userData.playerState = -1;      
            player.cueVideoById(userData.videoID, 0.0);
            userData.playerState = data.playerState;
            userData.timestamp = 0.0;
        }
        console.log("Adding event listners to player.");
        player.addEventListener('onStateChange', 'onPlayerStateChange');
    })
    socket.on('changeVideoTime', function(data) {
        console.log(`User changed video time tot ${data}.`);
        player.seekTo(data);

    })

});
function checkTime() {
    if(interval) {
        console.log('Checking time.');
        var currTime = player.getCurrentTime();
        console.log(`User time ${currTime} old time ${userData.timestamp}`);
        if((userData.timestamp + 5 <= currTime && userData.timestamp - 5 <= currTime) || (userData.timestamp + 5 >= currTime && userData.timestamp - 5 >= currTime)) {
            console.log("Times differ, emitting time change.");
            socket.emit('timeChanged', {
                roomNum: userData.roomNum,
                timestamp: currTime
            });
            userData.timestamp = currTime;
            return true;
        }
        else {
            userData.timestamp = currTime;
            return false;
        }
    }
    else{
        userData.timestamp = player.getCurrentTime();
        return false;
    }
}

function syncPlayerState(state) {
    switch (state){
        case null:
        case -1:
        case 0:
            break;
        case 1:
        case 3:
        case 5:
                player.playVideo();
            break;
        case 2:
                player.stopVideo();
            break;
    }
}

function getVideoState() {
    //Youtube iframe api for player state
        // -1 – unstarted
        // 0 – ended
        // 1 – playing
        // 2 – paused
        // 3 – buffering
        // 5 – video cued
    //template for data
    if(typeof player.getVideoUrl === "function")
    {
        userData.url = player.getVideoUrl();
    }
    else {
        userData.url = null;
    }
    if(userData.url)
    {
        userData.videoID = getVideoID(userData.url);
    }
    else {
        userData.videoID = null;
    }
    if(typeof player.getPlayerState === "function")
    {
        userData.playerState = player.getPlayerState();
    }
    else {
        userData.playerState = null;
    }
    if(typeof player.getCurrentTime === "function")
    {
        userData.timestamp = player.getCurrentTime();
    }
    else if (userData.url)
    {
        userData.timestamp = 0.0;
    }
    else {
        userData.timestamp = null;
    }
    return userData;
}
function delayedTime(timestamp) {
    var currentTime = getTimeStamp();
    if(currentTime + 5 <= timestamp && currentTime - 5 >= timestamp) {
        return true;
    }
    else {
        return false;
    }
}
function seek(sec){
    if(player){
        player.seekTo(sec, true);
    }
}

function getTimeStamp() {
    return player.getCurrentTime();
}

function getVideoID(url) {
    var video_id;
    if(!url) {
        return null
    }
    else if(url.includes("watch")) {
            video_id = url.split('v=')[1];
    }
    else {
        video_id = url.substring(url.lastIndexOf('/') + 1);
    }

    if(video_id.includes('?enablejsapi=1')) {
        video_id = video_id.replace('?enablejsapi=1', '');
    }
    return video_id;
}

function createEmbededURL(video_id) {
    return "https://www.youtube.com/embed/" + video_id + "?enablejsapi=1";
}

function embedYoutube(vid) {
    var video_id = getVideoID(vid);
    userData.videoID = video_id;
    userData.playerState = -1;
    player.cueVideoById({videoId: video_id});
}

//For reference video data template
// var data = {
//     room: roomNum,
//     url: null,
//     videoID: null,
//     timestamp: null,
//     playerState: null
// }
function synchronizeVideoData() {
    //Youtube iframe api for player state
        // -1 – unstarted
        // 0 – ended
        // 1 – playing
        // 2 – paused
        // 3 – buffering
        // 5 – video cued
        //Switch based on state of others videos in room
            //Player state -1 ==> unstarted
            //Player state 0 ==> ended
                //Create player and load video
                //Do not start video
            //Player state 1 ==> playing
            //Player state 3 ==> buffering
            //Player state 5 ==> video cued
                //Create player and load video
                //Start video and go to timestamp and continue playing
            //Player state 2 ==> paused
                //Create player and load video
                //Go to timestamp but do not play video
    var playVID;
    console.log(userData);
    console.log("Syncing video time.");
    switch (userData.playerState){
        case null:
        case -1:
        case 0:
        case 3:
            break;
        case 1:
        case 3:
        case 5:
            console.log("Syncing video time.");
            player.playVideo();
            seek(userData.timestamp);
            break;
        case 2:
            console.log("Playing video and changing time.");
            player.playVideo();
            seek(userData.timestamp);
            player.stopVideo();
            break;
    }
}
function onPlayerReady(event) {
    //synchronizeVideoData(event);
}

function changeBorderColor(playerStatus) {

}

function onPlayerStateChange(event) {
    if(event.data == 3)
    {
        console.log('Video is buffering.');
        return;
    }
    if(event.data != userData.playerState && event.data != -1) {
        userData.playerState = player.getPlayerState();
        if(!checkTime()) { 
            console.log(`Emitting a change of state to ${userData.playerState}.`);       
            socket.emit('changeVideoState', {
                    roomNum: userData.roomNum,
                    playerState: userData.playerState
            });
        }
        if(!interval && userData.playerState == 1){
            console.log('Setting interval.');
            userData.timestamp = player.getCurrentTime();
            if(!interval) {
                interval = setInterval(checkTime, 3000);
            }
            else {
                clearInterval(interval);
                interval = setInterval(checkTime, 3000);
            }
        }
        else if(interval && userData.playerState != 1) {
            console.log('Clearing interval');
            clearInterval(interval);
            interval = null;
        }
    }
    else if (event.data != userData.playerState){
        console.log('Change of state intiated by other user.');
        //userData.playerState = player.getPlayerState();
        if (!interval && userData.playerState == 1){
            console.log('Setting interval.');
            userData.timestamp = player.getCurrentTime();
            if(!interval) {
                interval = setInterval(checkTime, 3000);
            }
            else {
                clearInterval(interval);
                interval = setInterval(checkTime, 3000);
            }
        }
        else if(interval) {
            console.log('Clearing interval');
            clearInterval(interval);
            interval = null;
        }
    }
}

function GetRoomNumber() {
    var roomNumber = location.href.substring(location.href.lastIndexOf('/') + 1);
    return roomNumber;
}


$(document).ready(function() {
    userData.roomNum = GetRoomNumber();
    console.log(userData.roomNum);
});