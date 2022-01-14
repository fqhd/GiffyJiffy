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
	const verbs = ['Fucking', 'Chocking on', 'Sucking', 'Fisting', 'Eating'];
	const names = ['sister', 'mother', 'brother', 'father', 'cousin'];
	const nouns = ['pussy', 'dick', 'ass', 'butt', 'boobs', 'tits', 'face', 'ding-dong'];
	const name_adjective = ['fucking', 'big fat', 'retarded', 'autistic', 'hot', 'hot ass', 'booby', 'sexy', 'naughty', 'clit'];
	const nouns_adjective = ['fucking', 'fat fukin', 'fat fucking', 'deep', 'tight'];

	const random_verb = get_random_element(verbs);
	const random_name = get_random_element(names);
	const random_noun = get_random_element(nouns);
	const random_name_adjective = get_random_element(name_adjective);
	const random_noun_adjective = get_random_element(nouns_adjective);

	channel.send(`Stop what? ${random_verb} your ${random_name_adjective} ${random_name}'s ${random_noun_adjective} ${random_noun}?`);
}

function get_random_element(arr){
	const random_index = Math.floor((Math.random() * arr.length));
	return arr[random_index];
}