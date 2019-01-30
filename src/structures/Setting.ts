import { ComponentAPI, Inject } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { Guild } from 'eris';
import { Repository } from 'typeorm';
import { Setting } from '../models/Settings';
import { Database } from './Database';
const log = Logger.get(null);

export class SettingProvider {
	public api: ComponentAPI;
	public name: string = 'Settings';

	@Inject(Database)
	private database: Database;

	public settingRepo: Repository<Setting> = null;

	public async onLoad() {
		this.settingRepo = await this.database.db.getRepository(Setting);

		log.info('SettingProvider ready');
	}

	async get(guild: Guild) {
		const settings = await this.settingRepo.findOne({ guild: guild.id });

		if (!settings) {
			let setting = new Setting();
			setting.guild = guild.id;

			setting = await this.settingRepo.save(setting);
		}

		return settings;
	}

	async set(guild: Guild, target: string, field: string) {
		const settings = await this.get(guild);

		settings[target] = field;

		this.settingRepo.save(settings);
	}
}
