
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import { stripIndents } from 'common-tags';
import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';
import paginate from '../utils/Paginate';
import timeString from '../utils/TimeString';

export class Queue implements Command {
	public api: ComponentAPI;
	public name: string = 'Queue';

	public parent: Component = Commands;

	@Inject(Discord)
    private discord: Discord;

	public command: string = 'queue';

	public async execute({ args, message, channel }: CommandExecute) {
		if (args.length && isNaN(args.toString() as any)) {
			channel.createMessage('the page need to be a number, baka!');
			return;
		} else if (!args.length) args.push('1');
		const queue = this.discord.music.queues.get(channel.guild.id);
		const current = await queue.current();
		const tracks = [(current || { track: null }).track].concat(await queue.tracks()).filter(track => track);
		if (!tracks.length) {
			channel.createMessage('N-nothing to see here, baka!');
			return;
		}
		const decoded = await this.discord.music.decode(tracks as any[]);
		const totalLength = decoded.reduce((prev: number, song: any) => prev + song.info.length, 0);
		const paginated = paginate(decoded.slice(1), (args.toString() as any));
		let index = (paginated.page - 1) * 10;

		channel.createMessage({
			embed: {
				author: {
					name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
					icon_url: message.author.avatarURL
				},
				description: stripIndents`
                **Now playing:** [${decoded[0].info.title}](${decoded[0].info.uri}) (${timeString(current!.position)}/${timeString(decoded[0].info.length)})

				**Song queue${paginated.page > 1 ? `, page ${paginated.page}` : ''}:**

				${paginated.items.length ? paginated.items.map(song => `**${++index}.** [${song.info.title}](${song.info.uri}) (${timeString(song.info.length)})`).join('\n') : 'No more songs in queue.'}

				**Total queue time:** ${timeString(totalLength)}
                `,
				footer: { text: 'Use queue <page> to view a specific page.' }
			}
		});
	}
}
