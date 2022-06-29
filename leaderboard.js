import fetch from 'node-fetch';
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
	}
];

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

function toMinutes(m){
	if(m < 10){
		return "0" + m;
	}
	return m;
}

export async function update_leaderboard(tokens, message, client){
	const leaderboardArray = [];
	let leaderboardString = "Hey everyone, Fahd here. First of all I'd like to wish everyone an awesome summer and good luck to those who still have exams 💪. Lots of updates to the rift recently with the new skins and huge number update. Lots of buffs and nerfs too. And for those still on the grind, keep up the good work!\n\n";

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

	// Updating the leaderboard message
	const channel = await client.channels.fetch("831148754181816351");
	const leaderboard_message = await channel.messages.fetch('984085447997276190');
	leaderboard_message.edit(leaderboardString);
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