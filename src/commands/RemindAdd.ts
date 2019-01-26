
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import { Command, CommandExecute } from '../interfaces';
import { Reminder } from '../models/Reminders';
import { Commands } from '../structures';
import { Database } from '../structures/Database';
import { ms } from '../utils/ms';

export class RemindAdd implements Command {
	public api: ComponentAPI;
	public name: string = 'RemindAdd';

	public parent: Component = Commands;

	public command: string = 'remind';

	@Inject(Database)
	private database: Database;

	public async execute({ args, channel }: CommandExecute) {
		console.log(args);
		const repo = this.database.db.getRepository(Reminder);
	}
}
