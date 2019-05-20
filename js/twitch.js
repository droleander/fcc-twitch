/**
 * Pseudocode
 * 
 * - After loading the page...
 * 
 * - Check each username in users[] if it exists or not in Twitch.tv via usersAPI
 * - If username exists, push to usersFound[]
 * - If username does not exist, push to usersNotFound[]
 * 
 * - Check each username in usersFound[] if it is streaming or not via streamsAPI
 * - If username is streaming, push to usersStreaming[]
 * - If username is not streaming, push to usersNotStreaming[]
 * 
 * - For each username in usersStreaming[], get its logo, game, status via streamsAPI
 *   then push to usersOnline[] and usersAll[]
 *   
 * - For each username in usersNotStreaming[], get its logo, game via channelsAPI and
 *   set the status to 'Offline' then push to usersOffline[] and usersAll[]
 * 
 * - Display ALL / ONLINE / OFFLINE users
 * - Display ALL users found in usersAll[]
 * - Display ONLINE users found in usersOnline[]
 * - Display OFFLINE users found in usersOffline[]
 */


/* Variables */

var baseAPI = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api';
var usersAPI = baseAPI + "/users/";
var streamsAPI = baseAPI + "/streams/";
var channelsAPI = baseAPI + "/channels/";

var users = [
  "ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck",
  "habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"
];

var usersAll = [];
var usersFound = [];
var usersNotFound = [];
var usersStreaming = [];
var usersNotStreaming = [];
var usersOnline = [];
var usersOffline = [];

var strLogo = '';
var strGame = '';
var strStatus = '';
var strHTML = '';

/* Functions */

function getUsers() {
	checkUsers();
	checkStreamers();
	getOnlineStreamerInfo();
	getOfflineStreamerInfo();
}

async function ajaxCall(strAPI) {
	let ajaxData;
	
	try {
		ajaxData = await $.ajax({
			url: strAPI
		});
		
		return ajaxData;
	} catch (e) {
		console.error(e);
	}
}

function checkUsers() {
	// - Check each username in users[] if it exists or not in Twitch.tv via usersAPI
	// - If username exists, push to usersFound[]
	// - If username does not exist, push to usersNotFound[]
	
	usersFound = [];
	usersNotFound = [];
	
	let checkedUser;
	
	user.forEach(function(user) {
		checkedUser = await ajaxCall(usersAPI + user);
		
		console.log(checkedUser);
	});
	
	/* WORKING BUT VERY SLOW
	for (var counter = 0; counter < users.length; counter++) {
		$.ajax({
			url: usersAPI + users[counter],
			async: false,
			cache: false,
			success: function (checkedUser) {
				if (checkedUser.error) {
					usersNotFound.push(users[counter]);
				} else {
					usersFound.push(users[counter]);
				}
			},
			error: function (checkedUser) {
				usersNotFound.push(users[counter]);
			}
		});
	}
	*/
}

function checkStreamers() {
	// - Check each username in usersFound[] if it is streaming or not via streamsAPI
	// - If username is streaming, push to usersStreaming[]
	// - If username is not streaming, push to usersNotStreaming[]
	
	usersStreaming = [];
	usersNotStreaming = [];
	
	/* WORKING BUT VERY SLOW
	for (var counter = 0; counter < usersFound.length; counter++) {
		$.ajax({
			url: streamsAPI + usersFound[counter],
			async: false,
			cache: false,
			success: function (checkedStreamer) {
				var strStreams = JSON.stringify(checkedStreamer.stream);
				if (strStreams != "null") {
					usersStreaming.push(usersFound[counter]);
				} else {
					usersNotStreaming.push(usersFound[counter]);
				}
			},
			error: function (checkedStreamer) {
				usersNotStreaming.push(usersFound[counter]);
			}
		});
	}
	*/
}

function getOnlineStreamerInfo() {
	// - For each username in usersStreaming[], get its logo, game, status via streamsAPI
	//   then push to usersOnline[] and usersAll[]
	
	usersOnline = [];
	
	/* WORKING BUT VERY SLOW
	for (var counter = 0; counter < usersStreaming.length; counter++) {
		$.ajax({
			url: streamsAPI + usersStreaming[counter],
			async: false,
			cache: false,
			success: function (onlineStreamerData) {
				strLogo = onlineStreamerData.stream.channel.logo;
				strGame = onlineStreamerData.stream.channel.game;
				strStatus = onlineStreamerData.stream.channel.status;
				usersOnline.push([strLogo, usersStreaming[counter], strGame, strStatus]);
				usersAll.push([strLogo, usersStreaming[counter], strGame, strStatus]);
			}
		});
	}
	*/
}

function getOfflineStreamerInfo() {
	// - For each username in usersNotStreaming[], get its logo, game via channelsAPI and
	//   set the status to 'Offline' then push to usersOffline[] and usersAll[]
	
	usersOffline = [];
	
	/* WORKING BUT VERY SLOW
	for (var counter = 0; counter < usersNotStreaming.length; counter++) {
		$.ajax({
			url: channelsAPI + usersNotStreaming[counter],
			async: false,
			cache: false,
			success: function (offlineStreamerData) {
				strLogo = offlineStreamerData.logo;
				strGame = offlineStreamerData.game;
				strStatus = 'offline';
				usersOffline.push([strLogo, usersNotStreaming[counter], strGame, strStatus]);
				usersAll.push([strLogo, usersNotStreaming[counter], strGame, strStatus]);
			}
		});
	}
	*/
}

function displayList(arr) {
	// - Display ALL | ONLINE | OFFLINE users
	// - Display ALL users found in usersAll[]
	// - Display ONLINE users found in usersOnline[]
	// - Display OFFLINE users found in usersOffline[]
	
	$(".section-content").empty();
	for (var counter = 0; counter < arr.length; counter++) {
		if (arr[counter][3] != "offline") {
			strHTML = '<div class="row content user-online">';
		} else {
			strHTML = '<div class="row content user-' + arr[counter][3] + '">';
		}
		strHTML += '<div class="col-xs-2">';
		strHTML += '<img src="' + arr[counter][0] + '" alt="logo">'; // logo
		strHTML += '</div>';
		strHTML += '<div class="col-xs-10 content-detail">';
		strHTML += '<p><a href="https://www.twitch.tv/' + arr[counter][1] + '" target="_blank">' + arr[counter][1] + '</a></p>'; // username
		if (arr[counter][3] != "offline") {
			strHTML += '<p>' + arr[counter][2] + '</p>'; // game  
		}
		strHTML += '<p>' + arr[counter][3] + '</p>'; // status
		strHTML += '</div>';
		strHTML += '</div>';
		$(".section-content").append(strHTML);
	}
}

$(document).ready(function () {
	getUsers();
	displayList(usersAll);
});