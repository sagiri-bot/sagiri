
import * as Eris from 'eris';

import {
	ComponentAPI,
	Inject,
	Variable,
	VariableDefinitionType,
} from '@ayana/bento';

import { Logger } from '@ayana/logger';
import { Client as MusicClient } from 'lavaqueue';
import { ExtendedRedis } from 'lavaqueue/typings/QueueStore';
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

	@Inject(SettingProvider)
	public settingsprovider: SettingProvider;

	public music: MusicClient = new MusicClient({
		password: process.env.LAVALINK_PASS,
		userID: process.env.BOT_ID,
		hosts: {
			rest: process.env.LAVALINK_REST,
			ws: process.env.LAVALINK_WS,
			redis: process.env.REDIS ? {
				port: 6379,
				host: process.env.REDIS,
				db: 0
			} : undefined
		},
		send: async (guild: string, packet: any): Promise<void> => {
			const shardGuild = this.cli.guilds.get(guild);
			shardGuild.shard.sendWS(packet.op, packet.d);
			return Promise.resolve();
		}
	});

	public redis: ExtendedRedis = this.music.queues.redis;

	public storage: Storage = new Storage(this.redis);

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
