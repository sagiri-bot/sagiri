
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

	public async onLoad() {
		if (this.url == null) throw new Error('Please set the DB env variable to your postgres URL');

		const connection = new ConnectionManager();

		log.info('Connecting database...');

		connection.create({
			name: 'sagiri',
			type: 'postgres',
			synchronize: true,
			url: this.url,
			entities: [Setting]
		});

		log.info('Connected to the database');
	}
}
