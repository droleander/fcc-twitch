// Pseudocode
// - After loading the page...

const BASE_API = 'https://cors-anywhere.herokuapp.com/https://wind-bow.gomix.me/twitch-api';
const USERS_API = BASE_API + "/users/";
const STREAMS_API = BASE_API + "/streams/";
const CHANNELS_API = BASE_API + "/channels/";

let usersAll = [], 
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
	} else {
		throw new Error(`${strUser} (HTTP ${streamInfo.status} ${streamInfo.statusText}) has occurred.`);
	}
}

function displayList(arr) {
	$(".section-content").empty();
	arr.forEach(arrProp => {
		if (arrProp[3] != "offline") {
			strHTML = `<div class="row content user-online">`;
		} else {
			strHTML = `<div class="row content user-${arrProp[3]}">`;
		}
		strHTML += `<div class="col-xs-2">
			<img src="${arrProp[0]}" alt="logo">
			</div>
			<div class="col-xs-10 content-detail">
			<p><a href="https://www.twitch.tv/${arrProp[1]}" target="_blank">${arrProp[1]}</a></p>`;
		if (arrProp[3] != "offline") {
			strHTML += `<p>${arrProp[2]}</p>`; // game  
		}
		strHTML += `<p>${arrProp[3]}</p>
			</div>
			</div>`;

		$(".section-content").append(strHTML);		
	});
}

$(document).ready(function () {
	let users = [
		"ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck",
		"habathcx", "RobotCaleb", "noobs2ninjas", "brunofin", "comster404"
	  ];
	users.forEach(user => getTwitchUsers(user));
	displayList(usersAll);
});