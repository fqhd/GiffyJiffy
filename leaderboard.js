import fetch from 'node-fetch';
let is_active = false;
const TIMEOUT = 60;

const players = [
	{
		name: 'Fahd',
		ign: 'tobey quagmire',
		region: 'euw1',
	},
	{
		name: 'Amine',
		ign: 'Rona Season Bois',
		region: 'na1',
	},
	{
		name: 'Omar',
		ign: 'tobey quagmire',
		region: 'na1',
	},
	{
		name: 'Mehdi(NA)',
		ign: 'EverlastingMoon',
		region: 'na1',
	},
	{
		name: 'Mehdi(EUW)',
		ign: 'EndlessStarlight',
		region: 'euw1',
	},
	{
		name: 'Zein',
		ign: 'Zeineldines',	
		region: 'euw1',
	},
	{
		name: 'Axed',
		ign: 'Llerena',
		region: 'euw1',
	},
	{
		name: 'Samar',
		ign: 'samar',
		region: 'euw1',
	},
	{
		name: 'Imane',
		ign: 'PetitCuCu',
		region: 'na1',
	},
	{
		name: 'Jihwan',
		ign: 'F',
		region: 'euw1',
	}
];

export async function update_name(old_ign, new_ign){
	// TODO: Make this function update the element in players that has the old_ign wi the new_ign
}

export async function start_leaderboard(tokens, message, client){
	if(!is_active){
		is_active = true;
	}else{
		message.channel.send('Leaderboard is already active');
		return;
	}
	await update_leaderboard(tokens, message, client);
}

function rawAPICall(url){
    return new Promise((resolve, reject) => {
        setTimeout(async () => {
           const data = await fetch(url).catch(err => reject(err));
           resolve(data);
        }, TIMEOUT);
    });
}

async function apiCall(url){
	let badData = false;
	while(true){
		badData = false;
		const response = await rawAPICall(url).catch(err => {
			badData = true;
			console.log(err);
		});
		if(!badData){
			return response;
		}
	}
}

async function update_leaderboard(tokens, message, client){
	const leaderboardArray = [];
	let leaderboardString = "Wadup laaadz, fucked up season, but it's fiiine we shilliiiiiin(if you're not on the leaderboard it's cuz u ain't ranked yet l0ser)\n\n";

	// Adding ranks to leaderboard
	for(let i = 0; i < players.length; i++){
		const player = await getRank(players[i].ign, players[i].region);
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

async function getRank(ign, region){
	var idResponse = await apiCall("https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + ign + "?api_key=" + process.env.RIOT_KEY).catch(err => console.log(err));
	if(!idResponse){
		return;
	}
	const idData = await idResponse.json().catch(err => console.log(err));
	const response = await apiCall('https://' + region + '.api.riotgames.com/lol/league/v4/entries/by-summoner/' + idData.id + '?api_key=' + process.env.RIOT_KEY).catch(err => console.log(err));
	const data = await response.json();
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