export async function stop(tokens, message, client){
	if(check_if_bot_stop_requested(tokens)){
		stop_bot(message, client);
	}else{
		send_funny_stop_message(message.channel);
	}
}

function check_if_bot_stop_requested(tokens){
	if(tokens[0] == 'bot'){
		return true;
	}else{
		return false;
	}
}

async function stop_bot(message, client){
	console.log('Stopping bot...');
	await message.channel.send('Stopping bot...');
	client.destroy();
}

function send_funny_stop_message(channel){
	channel.send('Stop what?');
}

function get_random_element(arr){
	const random_index = Math.floor((Math.random() * arr.length));
	return arr[random_index];
}