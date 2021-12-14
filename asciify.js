import getPixels from 'get-pixels';

export async function asciify(tokens, message, client){
	const { url, resolution } = get_url_and_resolution_from_tokens(tokens);
	if(check_url_and_resolution(url, resolution, message) == -1){
		return;
	}

	const desired_resolution = convert_resolution_string_to_vec(resolution);
	if(check_desired_resolution(desired_resolution, message) == -1){
		return;
	}

	const pixels = await get_pixels_from_url(url);
	if(check_pixels(pixels, message) == -1){
		return;
	}
	
	const brightness_values = create_array_of_brightness_values(pixels, desired_resolution);

	const string_array_image = create_array_of_strings_from_brightness_values(brightness_values, desired_resolution);

	const final_string_message = create_final_string_message(string_array_image, desired_resolution);

	message.channel.send(final_string_message);
}

function get_url_and_resolution_from_tokens(tokens){
	return {
		url: tokens[0],
		resolution: tokens[1],
	}
}

function create_final_string_message(string_array_image, desired_resolution){
	let final_str = '```';
	for(let i = 0; i < desired_resolution[1]; i++){
		final_str += string_array_image[i];
	}
	final_str += '```';
	return final_str;
}

function check_url_and_resolution(url, resolution, message){
	if(!url){
		message.channel.send('No url provided');
		send_usage(message.channel);
		return -1;
	}
	if(!resolution){
		message.channel.send('No resulution provided');
		send_usage(message.channel);
		return -1;
	}
	return 0;
}

function create_array_of_strings_from_brightness_values(brightness_values, desired_resolution){
	const ascii_sorted_by_brightness = '$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,"^\'.';
	const num_ascii_characters = ascii_sorted_by_brightness.length;
	const strings = [];
	for(let y = 0; y < desired_resolution[1]; y++){
		let current_line = "";
		for(let x = 0; x < desired_resolution[0]; x++){
			const index = Math.floor(brightness_values[y * desired_resolution[0] + x] * (num_ascii_characters - 1));
			current_line += ascii_sorted_by_brightness[index];
		}
		strings.push(current_line + '\n');
	}
	return strings;
}

function create_array_of_brightness_values(pixels, desired_resolution){
	const { image_resolution_x, image_resolution_y } = get_image_resolution_from_pixels(pixels);

	const x_step = Math.floor(image_resolution_x / desired_resolution[0]);
	const y_step = Math.floor(image_resolution_y / desired_resolution[1]);
	const arr = [];

	for(let y = 0; y < desired_resolution[1]; y++){
		for(let x = 0; x < desired_resolution[0]; x++){
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

	return arr;
}

function get_image_resolution_from_pixels(pixels){
	return {
		image_resolution_x: pixels.shape.slice()[0],
		image_resolution_y: pixels.shape.slice()[1],
	}
}

function check_desired_resolution(desired_resolution, message){
	if(!desired_resolution[0] || !desired_resolution[1]){
		message.channel.send('Incorrect resolution format');
		send_usage(message.channel);
		return -1;
	}
	return 0;
}

async function get_pixels_from_url(url){
	const pixels = await get_image_pixels(url).catch(() => {
		// Empty catch statement to not block the flow of the program
	});
	return pixels;
}

function check_pixels(pixels, message){
	if(!pixels){
		message.channel.send('Bad link');
		send_usage(message.channel);
		return -1;
	}
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

function convert_resolution_string_to_vec(resolution){
	const x = parseInt(resolution.split('x')[0]);
	const y = parseInt(resolution.split('x')[1]);
	return [x, y];
}

function send_usage(channel){
	let str = '';
	str += 'Usage: asciify <link> <resolution>\n';
	str += 'Example: asciify <https://i.imgur.com/SltXmSk.jpeg> 4x4\n';
	str += 'Note: Larger images may take longer to process\n';
	str += 'Note: Resolution must be kinda small\n';
	channel.send(str);
}
