import getPixels from 'get-pixels';

// I'm pushing this for now for functionalitys sake, but fuck im tired as hell
// Tomorrow morning ill clean up this code up first thing
export async function asciify(tokens, message, client){
	const url = tokens[0];
	if(!url){
		message.channel.send('No url provided');
		send_usage(message.channel);
		return;
	}
	if(!tokens[1]){
		message.channel.send('No resulution provided');
		send_usage(message.channel);
		return;
	}
	const desired_resolution_x = parseInt(tokens[1].split('x')[0]);
	const desired_resolution_y = parseInt(tokens[1].split('x')[1]);
	if(!desired_resolution_x || !desired_resolution_y){
		message.channel.send('Incorrect resolution format');
		send_usage(message.channel);
		return;
	}

	const pixels = await get_image_pixels(url).catch(() => {
		message.channel.send('Bad link');
	});
	if(!pixels){
		send_usage(message.channel);
		return;
	}

	const image_resolution_x = pixels.shape.slice()[0];
	const image_resolution_y = pixels.shape.slice()[1];

	const ascii_sorted_by_brightness = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\'.';

	const num_ascii_characters = ascii_sorted_by_brightness.length;

	const x_step = Math.floor(image_resolution_x / desired_resolution_x);
	const y_step = Math.floor(image_resolution_y / desired_resolution_y);
	const arr = [];

	for(let y = 0; y < desired_resolution_y; y++){
		for(let x = 0; x < desired_resolution_x; x++){
			let total = 0;
			for(let cy = 0; cy < y_step; cy++){
				for(let cx = 0; cx < x_step; cx++){
					const r_value = pixels.get(x*x_step+cx, y*y_step+cy, 0);
					const g_value = pixels.get(x*x_step+cx, y*y_step+cy, 1);
					const b_value = pixels.get(x*x_step+cx, y*y_step+cy, 2);
					const brightness = r_value + g_value + b_value;
					total += brightness/765;
				}
			}
			arr.push(1 - (total / (y_step * x_step)));
		}
	}

	let r = 0;
	const second_array = [];
	for(let y = 0; y < desired_resolution_y; y++){
		let str = "";
		for(let x = 0; x < desired_resolution_x; x++){
			r++;
			const index = Math.floor(arr[y * desired_resolution_x + x] * (num_ascii_characters - 1));
			str += ascii_sorted_by_brightness[index];
		}
		second_array.push(str + '\n');
	}

	const f = desired_resolution_y * desired_resolution_x;

	// console.log('calculated ' + r + ' pixels');
	// console.log('should get ' + f + ' pixels');

	let final_str = '```';
	for(let i = 0; i < desired_resolution_y; i++){
		final_str += second_array[i];
	}
	final_str += '```';

	message.channel.send(final_str);
}


function get_image_pixels(url){
	return new Promise((resolve, reject) => {
		getPixels(url, (err, pixels) => {
			if(err){
				reject();
			}
			resolve(pixels);
		});
	});
}

function send_usage(channel){
	let str = '';
	str += 'Usage: asciify <link> <resolution>\n';
	str += 'Example: asciify <https://i.imgur.com/SltXmSk.jpeg> 4x4\n';
	str += 'Note: Larger images may take longer to process\n';
	str += 'Note: Resolution must be kinda small\n';
	channel.send(str);
}