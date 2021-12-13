export async function gimme(tokens, message, client){
	const gif_keyword = get_gif_keyword(tokens);
	send_gif_to_channel(message.channel, gif_keyword);
}

function get_gif_keyword(tokens){
	return tokens[0];
}

async function send_gif_to_channel(channel, keyword){
	const response = await fetch(`https://g.tenor.com/v1/search?q=${keyword}&key=${process.env.DISCORD_KEY}&limit=32`);
	const json = await response.json();
	const random_element_from_array = get_random_element_from_array(json.results);
	channel.send(random_element_from_array.url);
}

function get_random_element_from_array(array){
	const random_index = Math.floor(Math.random * array.length);
	return array[random_index];
}