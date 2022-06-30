import { Configuration, OpenAIApi } from "openai";
import * as DotEnv from 'dotenv';
import _ from "lodash";
DotEnv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_KEY,
  });
const openai = new OpenAIApi(configuration);

export default async function lolify(tokens, message, client){
	const prompt = `Write a league of legends lore for ${tokens.join(' ')}`

    message.channel.send(`Making some lore for "${tokens.join(' ')}"...`)

    const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt,
        temperature: 1,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });

    const data = response.data

    try {
        let text = _.trim(data.choices[0].text, "\n\n")
        let chunks = []

        // Handler for lores with 2000+ characters
        for (let i = 0; i < text.length; i += 2000) {
            const chunk = text.slice(i, i + 2000);
            chunks.push(chunk)
        }
    
        for(let chunk of chunks) {
            message.channel.send(chunk)
        }

    } catch (e) {
        console.error(e)
        message.channel.send(`Could not generate lore for ${tokens.join(' ')} :(`)
    }
}