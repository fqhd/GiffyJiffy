import * as DotEnv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { commands } from './command_handler.js';

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });
DotEnv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
	const { command, tokens } = split_message_into_command_and_tokens(message);
	run_command(command, tokens);
});

function run_command(command, tokens){
	commands[command](tokens);
}

function split_message_into_command_and_tokens(message){
	const message_split_by_spaces = message.content.split(' ');
	return {
		command: message_split_by_spaces[0],
		tokens: message.substring(1),
	};
}

client.login(process.env.DISCORD_KEY);