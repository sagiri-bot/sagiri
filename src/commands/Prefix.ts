
import { Component, ComponentAPI } from '@ayana/bento';

import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Prefix implements Command {
	public api: ComponentAPI;
	public name: string = 'Prefix';

	public parent: Component = Commands;

	public command: string = 'prefix';

	public async execute({ args, settings, channel }: CommandExecute) {
		if (!args.length) await channel.createMessage(`The current prefix is \`${settings.prefix}\``);
	}
}
