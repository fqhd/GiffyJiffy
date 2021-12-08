import * as DotEnv from 'dotenv';
import fetch from 'node-fetch';
DotEnv.config();
import { Client, Intents } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
	const tokens = message.content.split(' ');
	if(tokens[0] == 'gimme'){
		send_gif_to_channel(message.channel, tokens[1]);
	}
	if(message.content == 'bot stop'){
		console.log('Stopping bot...');
		await message.channel.send('Stopping bot...');
		client.destroy();
	}
});

async function send_gif_to_channel(channel, keyword){
	const response = await fetch(`https://g.tenor.com/v1/search?q=${keyword}&key=${process.env.DISCORD_KEY}&limit=32`);
	const json = await response.json();
	const index = Math.floor(Math.random() * json.results.length);
	channel.send(json.results[index].url);
}

client.login(process.env.DISCORD_KEY);