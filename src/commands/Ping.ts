
import { Component, ComponentAPI } from '@ayana/bento';

import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Ping implements Command {
	public api: ComponentAPI;
	public name: string = 'Ping';

	public parent: Component = Commands;

	public command: string = 'ping';

	public async execute({ channel }: CommandExecute) {
		await channel.createMessage('Pong!');
	}
}
