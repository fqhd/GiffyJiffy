import * as DotEnv from 'dotenv';
DotEnv.config();
import { Client, Intents } from 'discord.js';
const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
	switch(message.content){
		case 'what am i':
			message.channel.send('You are beautiful ;)');
		break;
		case 'gimme cutie':
			// const response = await fetch(`https://g.tenor.com/v1/registershare?id=8776030&key=${process.env.TENOR_KEY}&q=cutie`);
			// const json = await response.json();
			// console.log(json);
		break;
		case 'bot stop':
			console.log('Stopping bot...');
			await message.channel.send('Stopping bot...');
			client.destroy();
		break;
	}
});
client.login(process.env.TOKEN);