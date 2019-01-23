
import {
	ComponentAPI,
	Variable,
	VariableDefinitionType
} from '@ayana/bento';

import { Logger } from '@ayana/logger';
import { ConnectionManager } from 'typeorm';
import { Config } from '../Config';
import { Setting } from '../models/Settings';

const log = Logger.get('Database');

export class Database {
	public api: ComponentAPI;
	public name: string = 'Database';

	@Variable({ type: VariableDefinitionType.STRING, name: Config.DB, default: null })
	private db: string = null;

	public async onLoad() {
		if (this.db == null) throw new Error('Please set the DB env variable to your postgres URL');

		const connectionManager = new ConnectionManager();
		log.info('Connecting database...');

		connectionManager.create({
			name: 'sagiri',
			type: 'postgres',
			synchronize: true,
			url: this.db,
			entities: [Setting]
		});

		log.info('Connected to the database');
	}
}
