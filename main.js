import * as DotEnv from 'dotenv';
import { Client, Intents } from 'discord.js';
import { commands_map } from './command_handler.js';

const client = new Client({ intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS] });
DotEnv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  commands_map.update_leaderboard(client)

  setInterval(() => {
	commands_map.update_leaderboard(client)
  }, 1000 * 300) // 5 minute interval
});

client.on('messageCreate', async message => {
	const { command_name, tokens } = split_message_into_command_and_tokens(message);
	run_command(command_name, message, tokens);
});

function run_command(command_name, message, tokens){
	const command_function = commands_map[command_name];
	if(command_function){
		command_function(tokens, message, client);
	}
}

function split_message_into_command_and_tokens(message){
	const tokens = message.content.split(' ');
	const command_name = tokens[0];
	tokens.shift();
	return {
		command_name,
		tokens
	};
}

client.login(process.env.DISCORD_TOKEN);