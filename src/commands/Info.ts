
import { Component, ComponentAPI, Inject } from '@ayana/bento';
import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';
import { ms } from '../utils/ms';

export class Info implements Command {
	public api: ComponentAPI;
	public name: string = 'Info';

	public parent: Component = Commands;

	@Inject(Discord)
	private discord: Discord;

	public command: string = 'info';

	public async execute({ channel }: CommandExecute) {
		await channel.createMessage({
			embed: {
				author: {
					name: this.discord.cli.user.username,
					icon_url: this.discord.cli.user.staticAvatarURL,
					url: 'https://sagiri.party'
				},
				fields: [
					{
						name: 'Version',
						value: '4.0.0',
						inline: true
					},
					{
						name: 'Library',
						value: 'Eris',
						inline: true
					},
					{
						name: 'Shard',
						value: `${channel.guild.shard.id}/${this.discord.cli.shards.size} `,
						inline: true
					},
					{
						name: 'Uptime',
						value: ms(this.discord.cli.uptime).toString(),
						inline: true
					},
					{
						name: 'Memory Usage',
						value: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
						inline: true
					},
					{
						name: 'Servers',
						value: this.discord.cli.guilds.size.toString(),
						inline: true
					},
					{
						name: 'Users',
						value: this.discord.cli.users.size.toString(),
						inline: true
					},
					{
						name: 'GitHub Repository',
						value: '[sagiri-bot/sagiri](https://github.com/sagiri-bot/sagiri)',
						inline: true
					}
				]
			}
		});
	}
}
