
import {
	ComponentAPI,
	Variable,
	VariableDefinitionType
} from '@ayana/bento';

import { Logger } from '@ayana/logger';
import { Connection, ConnectionManager } from 'typeorm';
import { Config } from '../Config';
import { Setting } from '../models/Settings';

const log = Logger.get('Database');

export class Database {
	public api: ComponentAPI;
	public name: string = 'Database';

	@Variable({ type: VariableDefinitionType.STRING, name: Config.DB, default: null })
	private url: string = null;

	public db: Connection;

	public connectionManager = new ConnectionManager();

	public async onLoad() {
		if (this.url == null) throw new Error('Please set the DB env variable to your postgres URL');

		log.info('Connecting database...');

		const db = this.connectionManager.create({
			name: 'sagiri',
			type: 'postgres',
			url: this.url,
			synchronize: true,
			entities: [Setting]
		});

		await db.connect();

		this.db = db;

		await log.info('Connected to the database');
	}

	public async onUnload() {
		await this.db.close();

		await log.info('Database connection closed');
	}
}
