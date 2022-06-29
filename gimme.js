import fetch from 'node-fetch';

export async function gimme(tokens, message, client){
	const url = `https://tenor.googleapis.com/v2/search?q=${tokens[0]}&key=${process.env.TENOR}&client_key=my_test_app&limit=32`;
	const response = await fetch(url);
	const json = await response.json();
	const index = Math.floor(Math.random() * json.results.length);
	message.channel.send(json.results[index].url);
}
