import fetch from 'node-fetch';
let is_active = false;

export async function update_leaderboard(tokens, message, client){
	if(!is_active){
		is_active = true;
	}else{
		message.channel.send('Leaderboard is already active');
		return;
	}

	const names = ["Fahd", "Amine", "Omar", "Mehdi", "Samar", "Yahia", "Sarah", "Axed", "Imane", "Jihwan"];
	const usernames = ["PANV_xgn3lYQXsNSdCXViBhtIlMvzjvJnku-jdLHmCuFj0mF", "hDrk5vOdOW9AoTzs6WOvlb5Orctn_dMtsfgvzYPqxdtsJJmL", "o60Asiz2h1YejtyMF1SIg-QAz0RQxvNltcmGmRZcbMfrtDQW", "FoEoLD2s3QuHi7iggV_oSGxelhdgi7lzj-dgiIOKfamk0lBQ", "EXpLqDc2TG9hYALDdbPzBkVsr7y54UJPMeoahW7x3H6Bms1C", "fIrlYQ9O0dE9uAtpRRMBx2Z66bhE82FAhgGvjjx-ZxQGYihW", "i_WpCTFvx1feyR29DcD13Fl2b2bvffLpb8bI1-eurOLxLFiC", "5ZxZUR3iPXMjbhjlNSY2d5ixKYYtFJ19Q89YDafTyIPQ0sJK", "Uszb-967hvrhwyGzGe_tnsbh6STIDGn-Bi-X1dm_DfaRROE8", "Dw5v-dla666TOJ8PX8oRGJ9nEOWaaopjsb9eO4_H8fM893Vu"];

	const leaderboardArray = [];
	let leaderboardString = "Wadup laaadz, fucked up season, but it's fiiine we shilliiiiiin(if you're not on the leaderboard it's cuz u ain't ranked yet l0ser)\n\n";

	// Adding ranks to leaderboard
	for(let i = 0; i < names.length; i++){
		const player = await getRank(usernames[i]);
		if(player){
			const mmr = rankToMMR(player.tier, player.rank, player.lp);
			const name = names[i];
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

	leaderboardString += "Next Updated: " + new Date(new Date().getTime() + 5*60*1000);

	// Getting channel, leaderboard message, and leaderboard log message
	const channel = await client.channels.fetch("831148754181816351");
	const leaderboard_message = await channel.messages.fetch('925875313680990279');
	leaderboard_message.edit(leaderboardString);

	setTimeout(update_leaderboard, 1000 * 60 * 5, tokens, message, client); // Call this function in 5 minutes
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

async function getRank(puuid){
	let region = (puuid == "Uszb-967hvrhwyGzGe_tnsbh6STIDGn-Bi-X1dm_DfaRROE8") ? "na1" : "euw1";

	var response = await fetch("https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + puuid + "?api_key=" + process.env.RIOT_KEY).catch(err => console.log(err));
	var data = await response.json().catch(err => console.log(err));
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