
import { Component, ComponentAPI, Variable, VariableDefinitionType } from '@ayana/bento';

import axios from 'axios';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

const pkg = require('../../package.json');
const types = [
	'awoo',
	'blush',
	'clagwimoth',
	'bang',
	'cry',
	'cuddle',
	'dance',
	'hug',
	'insult',
	'jojo',
	'kiss',
	'lewd',
	'lick',
	'megumin',
	'neko',
	'nom',
	'owo',
	'pat',
	'pout',
	'rem',
	'slap',
	'smile',
	'smug',
	'stare',
	'thumbsup',
	'triggered',
	'wag',
	'waifu_insult',
	'tickle',
	'banghead',
	'bite',
	'discord_memes',
	'nani',
	'initial_d',
	'delet_this',
	'thinking',
	'greet',
	'punch',
	'kemonomimi',
	'deredere',
	'animal_cat',
	'animal_dog',
	'poke',
	'shrug',
	'sleepy',
	'dab',
	'teehee',
	'poi',
	'highfive',
	'trap',
	'handholding',
	'sumfuk',
	'wasted',
	'baka'
];

export class WeebSh implements Command {
	public api: ComponentAPI;
	public name: string = 'WeebSh';

	public parent: Component = Commands;

	public command: string = 'weebsh';

	private client = axios.create({
		baseURL: `https://api.weeb.sh/images`,
		headers: { Authorization: `Bearer ${process.env.WEEB_SH}`, 'User-Agent': `Sagiri/${pkg.version}` }
	});

	public async execute({ args, message, channel }: CommandExecute) {
		if (!args.length || !types.includes(args.toString())) {
			channel.createMessage(`You need to provide a valid type: \`${types.join(', ')}\``);
			return;
		}
		const request = await this.client({ method: 'get', url: `/random?type=${args.toString()}` });
		await channel.createMessage({
			embed: {
				author: {
					name: `${message.author.username}#${message.author.discriminator}`,
					icon_url: message.author.staticAvatarURL
				},
				image: { url: request.data.url },
				footer: { icon_url: 'https://cdn.discordapp.com/icons/300407204987666432/fc31ac49429fab1238a1beb2653a9dff.jpg', text: 'Powered by weeb.sh' }
			}
		});
		return;
	}
}
