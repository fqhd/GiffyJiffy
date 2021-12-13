import fetch from 'node-fetch';

export async function gimme(tokens, message, client){
	const response = await fetch(`https://g.tenor.com/v1/search?q=${tokens[0]}&key=${process.env.DISCORD_KEY}&limit=32`);
	const json = await response.json();
	const index = Math.floor(Math.random() * json.results.length);
	message.channel.send(json.results[index].url);
}
