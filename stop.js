export async function stop(tokens, message, client){
	if(check_if_bot_stop_requested(tokens)){
		stop_bot();
	}else{
		send_funny_stop_message(message.channel);
	}
}

async function stop_bot(){
	console.log('Stopping bot...');
	await message.channel.send('Stopping bot...');
	client.destroy();
}

function send_funny_stop_message(channel){
	channel.send('Stop what?');
}
