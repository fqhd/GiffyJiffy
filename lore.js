import fetch from 'node-fetch';

export function lore(tokens, message, client){
	const champ = tokens[0];
	fetch(`http://ddragon.leagueoflegends.com/cdn/12.12.1/data/en_US/champion/${champ}.json`).then(response => response.json()).then(json => {
		message.channel.send(json.data[champ].lore);
	}).catch(err => {
		console.log(err);
		message.channel.send("Can't find champion, try different spelling perhaps?");
	});
}