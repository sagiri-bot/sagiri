import { ComponentAPI, SubscribeEvent } from '@ayana/bento';

import * as Eris from 'eris';

export class Discord {
	public api: ComponentAPI;
	public name: string = 'name';

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

	@SubscribeEvent(Discord, 'ready')
	private onReady() {
		console.log(`Logged in as ${this.cli.user.username}#${this.cli.user.discriminator}`);
		this.cli.editStatus('online', { name: 'trying bento' });
	}

	@SubscribeEvent(Discord, 'messageCreate')
	private async onMessageCreate(message: Eris.Message) {
		console.log(`onMessageCreate`);
	}
}
