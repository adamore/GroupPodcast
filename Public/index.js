document.getElementById("getContent").addEventListener("click", function(event){
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
	var isVid  = validVideoId(video_id);
	if (document.getElementById("youtubeVideo") && isVid) {
		document.getElementById("youtubeVideo").setAttribute('src', "https://www.youtube.com/embed/" + video_id);
	}
	else if (validVideoId(video_id)) {
		console.log("Video exists.");
		var ifrm = document.createElement("iframe");
		var videoContainer = document.getElementById("videoContainer");
		videoContainer.appendChild(ifrm);
		ifrm.setAttribute('src', "https://www.youtube.com/embed/" + video_id);
		ifrm.setAttribute('id', "youtubeVideo");
		ifrm.style.width = "100%";
		ifrm.style.height = "100%";
		ifrm.style.border = "0";
		ifrm.display = "block";
	};
}
function checkThumbnail(width) {
	if (width === 120) {
		alert("Error: Invalid video id");
		return false;
	}
	else {
		return true;
	}
};

function validVideoId(id) {
	console.log("Checking video.");
	var img = new Image();
	img.src = "http://img.youtube.com/vi/" + id + "/mqdefault.jpg";
	img.onload = function () {
		checkThumbnail(this.width);
	}
	if (img) {
		return true;
	}
	else {
		return false;
	};
};

$(document).ready(function() {
});
