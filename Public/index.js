document.getElementById("getContent").addEventListener("click", function(event) {
    console.log("Sumbission");
    event.preventDefault();
    if (document.getElementById("content-url").value) {
        embedYoutube();
    }
});
//document.getElementById("getContent").addEventListener("click", embedYoutube(), false);

function embedYoutube() {
    var vid = document.getElementById("content-url").value;
    console.log(`Checking video ${vid}`);
    var video_id = vid.split('v=')[1];
    var isVid = validVideoId(video_id);
    if (document.getElementById("youtubeVideo") && isVid) {
        document.getElementById("youtubeVideo").setAttribute('src', "https://www.youtube.com/embed/" + video_id);
    } else if (validVideoId(video_id)) {
        console.log("Video exists.");
        var ifrm = document.createElement("iframe");
        var videoContainer = document.getElementById("videoContainer");
        videoContainer.appendChild(ifrm);
        ifrm.setAttribute('src', "https://www.youtube.com/embed/" + video_id);
        ifrm.setAttribute('id', "youtubeVideo");
        ifrm.setAttribute('enablejsapi', "true");
        ifrm.style.width = "100%";
        ifrm.style.height = "100%";
        ifrm.style.border = "0";
        ifrm.display = "block";
        player = new YT.Player('youtubeVideo', {
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    };
}

function onPlayerReady(event) {
    document.getElementById('youtubeVideo').style.borderColor = '#FF6D00';
}

function changeBorderColor(playerStatus) {
    var color;
    if (playerStatus == -1) {
        color = "#37474F"; // unstarted = gray
    } else if (playerStatus == 0) {
        color = "#FFFF00"; // ended = yellow
    } else if (playerStatus == 1) {
        color = "#33691E"; // playing = green
    } else if (playerStatus == 2) {
        color = "#DD2C00"; // paused = red
    } else if (playerStatus == 3) {
        color = "#AA00FF"; // buffering = purple
    } else if (playerStatus == 5) {
        color = "#FF6DOO"; // video cued = orange
    }
    if (color) {
        document.getElementById('youtubeVideo').style.borderColor = color;
    }
}

function onPlayerStateChange(event) {
    changeBorderColor(event.data);
}

function checkThumbnail(width) {
    if (width === 120) {
        alert("Error: Invalid video id");
        return false;
    } else {
        return true;
    }
};

function validVideoId(id) {
    console.log("Checking video.");
    var img = new Image();
    img.src = "http://img.youtube.com/vi/" + id + "/mqdefault.jpg";
    img.onload = function() {
        checkThumbnail(this.width);
    }
    if (img) {
        return true;
    } else {
        return false;
    };
};

$(document).ready(function() {});