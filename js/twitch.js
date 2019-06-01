// Pseudocode
// - After loading the page...
 
// Check each username in users[] if it exists or not in Twitch.tv via usersAPI
// - If username exists, push to usersFound[]
// - If username does not exist, push to usersNotFound[]

// Check each username in usersFound[] if it is streaming or not via streamsAPI
// - If username is streaming, push to usersStreaming[]
// - If username is not streaming, push to usersNotStreaming[]

// For each username in usersStreaming[], get its logo, game, status via streamsAPI
// then push to usersOnline[] and usersAll[]

// For each username in usersNotStreaming[], get its logo, game via channelsAPI and
// set the status to 'Offline' then push to usersOffline[] and usersAll[]

// Display ALL / ONLINE / OFFLINE users
// Display ALL users found in usersAll[]
// Display ONLINE users found in usersOnline[]
// Display OFFLINE users found in usersOffline[]


const BASE_API = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api';
const USERS_API = BASE_API + "/users/";
const STREAMS_API = BASE_API + "/streams/";
const CHANNELS_API = BASE_API + "/channels/";

let usersAll = [], 
	usersFound = [], 
	usersNotFound = [], 
	usersStreaming = [],
	usersNotStreaming = [], 
	usersOnline = [], 
	usersOffline = [], 
	strLogo = '', 
	strGame = '', 
	strStatus = '', 
	strHTML = '';


async function getTwitchUsers(strUser) {
	let streamInfo = await fetch(STREAMS_API + strUser);
	
	if (streamInfo.ok && streamInfo.status === 200) {
		let streamData = await streamInfo.json();
	
		if (streamData.stream !== null) {
			strLogo = streamData.stream.channel.logo;
			strGame = streamData.stream.channel.game;
			strStatus = streamData.stream.channel.status;
		
			usersOnline.push([strLogo, strUser, strGame, strStatus]);
	
		} else {
			let channelsInfo = await fetch(CHANNELS_API + strUser);
			let ChannelsData = await channelsInfo.json();
			strLogo = ChannelsData.logo;
			strGame = ChannelsData.game;
			strStatus = 'offline';
		
			usersOffline.push([strLogo, strUser, strGame, strStatus]);
		}
	
		usersAll.push([strLogo, strUser, strGame, strStatus]);
	}
}

function displayList(arr) {
	$(".section-content").empty();
	for (var counter = 0; counter < arr.length; counter++) {
		if (arr[counter][3] != "offline") {
			strHTML = `<div class="row content user-online">`;
		} else {
			strHTML = `<div class="row content user-${arr[counter][3]}">`;
		}
		strHTML += `<div class="col-xs-2">
			<img src="${arr[counter][0]}" alt="logo">
			</div>
			<div class="col-xs-10 content-detail">
			<p><a href="https://www.twitch.tv/${arr[counter][1]}" target="_blank">${arr[counter][1]}</a></p>`;
		if (arr[counter][3] != "offline") {
			strHTML += `<p>${arr[counter][2]}</p>`; // game  
		}
		strHTML += `<p>${arr[counter][3]}</p>
			</div>
			</div>`;

		$(".section-content").append(strHTML);
	}
}

$(document).ready(function () {
	let users = [
		"ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck",
		"habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"
	  ];

	users.forEach(user => getTwitchUsers(user));
	displayList(usersAll);
});