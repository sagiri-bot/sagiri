
import { Component, ComponentAPI } from '@ayana/bento';

import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';
import { ms } from '../utils/ms';

export class Ping implements Command {
	public api: ComponentAPI;
	public name: string = 'Ping';

	public parent: Component = Commands;

	public command: string = 'ping';

	public async execute({ channel }: CommandExecute) {
		const msg = await channel.createMessage('Pong!');
		msg.edit(`${msg.content} - \`${ms(channel.guild.shard.latency)}\``);
	}
}
