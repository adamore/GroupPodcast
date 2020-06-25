var roomNumber;
document.getElementById("create-room").addEventListener("click", function(event) {
    console.log("Creating Room");
    event.preventDefault();
    $.ajax({
    	url: '/createRoom',
    	type: 'GET',
    	async: true,
    	success: function(response) {
    	   //createNewRoom(response);
           roomNumber = response;
           console.log(roomNumber)
           location.href = window.location.href + 'rooms/' + roomNumber;
    	}
    });
    // $.ajax({
    //     url: '/rooms/' + roomNumber,
    //     type: 'GET',
    //     async: true,
    //     success: function(response) {
    //         console.log("Room created");
    //     }
    // });
});


// function createNewRoom(roomNum) {
//     $.ajax({
//         url: '/rooms/' + roomNum +,
//         type: 'GET',
//         async: true,
//         success: function(response) {
//             room = roomNum;
//             console.log("Created new html.")
//         }
//     })
// 	//location.href = (window.location.href + "rooms/" + roomNum);
// }