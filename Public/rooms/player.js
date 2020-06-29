var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubeIframeAPIReady() {
    console.log("Youtube API ready.");
    player = new YT.Player('youtubeVideo', {
        height: '100%',
        width: '100%',
        events: {
            'onReady': playerReady
        }
    });
}