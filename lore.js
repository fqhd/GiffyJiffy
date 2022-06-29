import fetch from 'node-fetch';

export function lore(tokens, message, client){
	const champ = tokens[0];
	if(tokens[0] == "Fahd"){
		message.channel.send("Fahd is a one of the mose sacred NPCs of league of legends. Notorious for his inting skills and dogshit mechanics, he is able consistently tilt amine regardless of what he does in the game, if he split pushes, amine rages why he didn't tp, and when he tps, amine flames his tp. This never ending cycle of toxicicity continues between these individuals who will never make it past plat 3.");
	}else{
		fetch(`http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${champ}.json`).then(response => response.json()).then(json => {
		message.channel.send(json.data[champ].lore);
	}).catch(err => {
		console.log(err);
			message.channel.send("Can't find champion, try different spelling perhaps?");
		});
	}
}