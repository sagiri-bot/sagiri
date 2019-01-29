import { ComponentAPI, Inject } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { Guild } from 'eris';
import { Setting } from '../models/Settings';
import { Database } from './Database';
const log = Logger.get(null);

export class SettingProvider {
	public api: ComponentAPI;
	public name: string = 'Settings';

	@Inject(Database)
	private database: Database;

	public async onLoad() {
		log.info('SettingProvider ready');
	}

	async get(repo: any, guild: Guild, value: any) {
		const settingRepo = await this.database.db.getRepository(repo);

		const settings = await settingRepo.findOne({ guild: guild.id });

		if (!settings) {
			let setting = new Setting();
			setting.guild = guild.id;

			setting = await settingRepo.save(setting);
		}

		value = settings;

		return value;
	}
}
