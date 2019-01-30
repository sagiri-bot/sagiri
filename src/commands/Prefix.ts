
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Prefix implements Command {
	public api: ComponentAPI;
	public name: string = 'Prefix';

	public parent: Component = Commands;

	public command: string = 'prefix';

	@Inject(Discord)
	private discord: Discord;

	public async execute({ args, settings, channel }: CommandExecute) {
		if (!args.length) {
			await channel.createMessage(`The current prefix is \`${settings.prefix}\``);
			return;
		}

		await this.discord.settingsprovider.set(channel.guild, 'prefix', args.toString());

		await channel.createMessage(`The prefix has been changed to \`${args}\``);
	}
}
