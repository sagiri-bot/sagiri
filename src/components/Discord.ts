
import * as Eris from 'eris';

import {
	ComponentAPI,
	Inject,
	Variable,
	VariableDefinitionType,
} from '@ayana/bento';

import { Logger } from '@ayana/logger';
import { Client as MusicClient } from 'lavaqueue';
import Storage from 'rejects';
import { Config } from '../Config';
import { DiscordEvent } from '../Constants';
import { SettingProvider } from '../structures/Setting';
const log = Logger.get('Discord');

export class Discord {
	public api: ComponentAPI;
	public name: string = 'Discord';

	public cli: Eris.Client = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.BOT_TOKEN, default: null })
	private token: string = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.LAVALINK_WS, default: null })
	private ws: string = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.LAVALINK_REST, default: null })
	private rest: string = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.LAVALINK_PASS, default: null })
	private pass: string = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.REDIS, default: null })
	private redis: string = null;

	@Variable({ type: VariableDefinitionType.STRING, name: Config.BOT_ID, default: null })
	private id: string = null;

	@Inject(SettingProvider)
	public settingsprovider: SettingProvider;

	public music: MusicClient = new MusicClient({
		password: this.pass,
		userID: this.id,
		hosts: {
			rest: `http://${this.rest}`,
			ws: `ws://${this.ws}`,
			redis: this.redis ? {
				port: 6379,
				host: this.redis,
				db: 0
			} : undefined
		},
		send: async (guild: string, packet: any): Promise<void> => {
			if (this.cli.guilds.has(guild)) {
				await (this as any).ws.send(packet);
			}
		}
	});

	public redis_music = this.music.queues.redis;

	public storage = new Storage(this.redis_music);

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

process.on('unhandledRejection', err => log.error(err));
