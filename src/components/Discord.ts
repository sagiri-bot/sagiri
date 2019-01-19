import { Component, ComponentAPI, SubscribeEvent } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import * as Eris from 'eris';
import { EventEmitter } from 'events';
const log = Logger.get('DiscordComponents');
export class Discord {
	public api: ComponentAPI;
	public name: string = 'Discord';

	public dependencies: Array<Component> = [];

	private cli: Eris.Client = null;

	public async onLoad() {
		this.cli = new Eris.Client(process.env.SAGIRI_TOKEN, {
			maxShards: 'auto',
			disableEveryone: true,
			autoreconnect: true
		});

        // forward eris events
		this.api.forwardEvents(this.cli, ['ready', 'messageCreate']);

		this.cli.connect();
	}
}
