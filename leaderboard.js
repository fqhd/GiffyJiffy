import fetch from 'node-fetch';
let is_active = false;

const players = [
	{
		name: 'Fahd',
		id: 'PANV_xgn3lYQXsNSdCXViBhtIlMvzjvJnku-jdLHmCuFj0mF',
		region: 'euw1',
	},
	{
		name: 'Amine',
		id: '1FrqsJSVzGG4BxnEay4SjTK5CAxW6ssZAJCQJ90nNyFM0XY',
		region: 'na1',
	},
	{
		name: 'Omar',
		id: 'o60Asiz2h1YejtyMF1SIg-QAz0RQxvNltcmGmRZcbMfrtDQW',
		region: 'euw1',
	},
	{
		name: 'Mehdi',
		id: 'FoEoLD2s3QuHi7iggV_oSGxelhdgi7lzj-dgiIOKfamk0lBQ',
		region: 'euw1',
	},
	{
		name: 'Samar',
		id: 'EXpLqDc2TG9hYALDdbPzBkVsr7y54UJPMeoahW7x3H6Bms1C',
		region: 'euw1',
	},
	{
		name: 'Yahia',
		id: 'fIrlYQ9O0dE9uAtpRRMBx2Z66bhE82FAhgGvjjx-ZxQGYihW',
		region: 'euw1',
	},
	{
		name: 'Sara',
		id: 'i_WpCTFvx1feyR29DcD13Fl2b2bvffLpb8bI1-eurOLxLFiC',
		region: 'euw1',
	},
	{
		name: 'Axed',
		id: '5ZxZUR3iPXMjbhjlNSY2d5ixKYYtFJ19Q89YDafTyIPQ0sJK',
		region: 'euw1',
	},
	{
		name: 'Imane',
		id: 'Uszb-967hvrhwyGzGe_tnsbh6STIDGn-Bi-X1dm_DfaRROE8',
		region: 'na1',
	},
	{
		name: 'Jihwan',
		id: 'Dw5v-dla666TOJ8PX8oRGJ9nEOWaaopjsb9eO4_H8fM893Vu',
		region: 'euw1',
	},
	{
		name: 'Zein',
		id: 'kxfte62HDuZ2n5hUhRWygP0RmyKDNCDHRGpZ-sD1_X0FaOOC',
		region: 'euw1',
	},
	{
		name: 'Chakib',
		id: '5-Xqb7R6I7ZV9fbpmknZpUbZBfCTVRx36CEKfzZk3jqd0DX9P9Q826fOtQ',
		region: 'na1',
	},
];

export async function start_leaderboard(tokens, message, client){
	if(!is_active){
		is_active = true;
	}else{
		message.channel.send('Leaderboard is already active');
		return;
	}
	await update_leaderboard(tokens, message, client);
}

async function update_leaderboard(tokens, message, client){
	const leaderboardArray = [];
	let leaderboardString = "Wadup laaadz, fucked up season, but it's fiiine we shilliiiiiin(if you're not on the leaderboard it's cuz u ain't ranked yet l0ser)\n\n";

	// Adding ranks to leaderboard
	for(let i = 0; i < players.length; i++){
		const player = await getRank(players[i].id, players[i].region);
		if(player){
			const mmr = rankToMMR(player.tier, player.rank, player.lp);
			const name = players[i].name;
			leaderboardArray.push({ name, player, mmr });
		}
	}

	// Sorting the array
	leaderboardArray.sort(compare);

	// Updating leaderboard with sorted array of ranks
	for(let i = 0; i < leaderboardArray.length; i++){
		let player = leaderboardArray[i].player;
		leaderboardString += `${i+1}) ${leaderboardArray[i].name} ${player.tier} ${player.rank} ${player.lp} LP\n`;
	}

	// Adding date and time to leaderboard
	leaderboardString += "\n";

	leaderboardString += "Next Update: " + new Date(new Date().getTime() + 5*60*1000);

	// Getting channel, leaderboard message, and leaderboard log message
	const channel = await client.channels.fetch("831148754181816351");
	const leaderboard_message = await channel.messages.fetch('925875313680990279');
	leaderboard_message.edit(leaderboardString);

	setTimeout(async () => {
		await update_leaderboard(tokens, message, client);
	}, 1000 * 60 * 5);
}

function compare(a, b){
	return b.mmr - a.mmr;
}

function rankToMMR(tier, rank, lp){
	let number = 0;
	switch(tier){
		case "challenger":
			number += 90000;
		break;
		case "grandmaster":
			number += 80000;
		break;
		case "grandmaster":
			number += 70000;
		break;
		case "master":
			number += 60000;
		break;
		case "diamond":
			number += 50000;
		break;
		case "platinum":
			number += 40000;
		break;
		case "gold":
			number += 30000;
		break;
		case "silver":
			number += 20000;
		break;
		case "bronze":
			number += 10000;
		break;
	}
	switch(rank){
		case "I":
			number += 4000;
		break;
		case "II":
			number += 3000;
		break;
		case "III":
			number += 2000;
		break;
		case "IV":
			number += 1000;
		break;
	}

	number += parseInt(lp);

	return number;
}

async function getRank(id, region){
	var response = await fetch("https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + id + "?api_key=" + process.env.RIOT_KEY).catch(err => console.log(err));
	if(!response){
		return;
	}
	var data = await response.json().catch(err => console.log(err));
	if(!data){
		return;
	}
	if(response.status != 200){
		console.log("Reponse failed with status code: " + response.status);
		return null;
	}
	for (let i = 0; i < data.length; i++) {
		if (data[i].queueType == "RANKED_SOLO_5x5") {
			let tier = data[i].tier.toLowerCase();
			let rank = data[i].rank;
			let lp = data[i].leaguePoints;
			return { tier, rank, lp };
		}
	}
}