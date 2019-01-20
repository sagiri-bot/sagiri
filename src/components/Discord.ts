
import * as Eris from 'eris';

import {
	ComponentAPI,
	SubscribeEvent,
	Variable,
	VariableDefinitionType,
} from '@ayana/bento';

import { Config } from '../Config';
import { DiscordEvent } from '../Constants';

import { Logger } from '@ayana/logger';
const log = Logger.get('Discord');

export class Discord {
	public api: ComponentAPI;
	public name: string = 'Discord';

	private cli: Eris.Client = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.BOT_TOKEN, default: null })
	private token: string = null;

	public async onLoad() {
		if (this.token == null) throw new Error(`Please set the BOT_TOKEN env variable to your token`);

		log.info(`Initilizing Discord`);
		// create our eris client
		this.cli = new Eris.Client(this.token, {
			autoreconnect: true,
			firstShardID: 0,
			lastShardID: 0,
		});

		// forward events we care about
		this.api.forwardEvents(this.cli, Object.values(DiscordEvent));

		await this.cli.connect();
	}

	public async onUnload() {
		// cleanup
		this.cli.disconnect({ reconnect: false });
		this.cli.removeAllListeners();

		this.cli = null;
	}
}
