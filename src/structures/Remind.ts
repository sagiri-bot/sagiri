
import {
	ComponentAPI,
	Inject
} from '@ayana/bento';

import { Logger } from '@ayana/logger';
import { TextChannel } from 'eris';
import { LessThan, Repository } from 'typeorm';
import { Discord } from '../components/Discord';
import { Reminder } from '../models/Reminder';
import { Database } from './Database';

const log = Logger.get('Remind');

export class Remind {
	public api: ComponentAPI;
	public name: string = 'Remind';

	@Inject(Discord)
	private discord: Discord;

	@Inject(Database)
	private database: Database;

	private checkRate: number;

	private checkInterval!: NodeJS.Timeout;

	private queuedSchedules = new Map();

	public async onLoad() {
		console.log(this.database.db);
		await this._check();
		this.checkInterval = setInterval(this._check.bind(this), this.checkRate);
	}

	public async _check() {
		const remindersRepo = this.database.db.getRepository(Reminder);
		const reminders = await remindersRepo.find({ triggers_at: LessThan(new Date(Date.now() + this.checkRate)) });
		const now = new Date();

		for (const reminder of reminders) {
			if (this.queuedSchedules.has(reminder.id)) continue;

			if (reminder.triggers_at < now) {
				this.runReminder(reminder);
			} else {
				this.queueReminder(reminder);
			}
		}
	}

	public async runReminder(reminder: Reminder) {
		try {
			const reason = reminder.reason || `${reminder.channel ? 'y' : 'Y'}ou wanted me to remind you around this time!`;
			const content = `${reminder.channel ? `<@${reminder.user}>, ` : ''} ${reason}\n\n<${reminder.trigger}>`;
			const channel = reminder.channel && this.discord.cli.getChannel(reminder.channel) as TextChannel;

			if (channel) {
				await channel.createMessage(content);
			} else {
				const user = await this.discord.cli.getDMChannel(reminder.user);
				await user.createMessage(content);
			}
		} catch (error) {
			log.error(error.stack);
		}

		try {
			await this.deleteReminder(reminder);
		} catch (error) {
			log.error(error.stack);
		}
	}

	public async addReminder(reminder: Reminder) {
		const remindersRepo = this.database.db.getRepository(Reminder);
		const rmd = new Reminder();
		rmd.user = reminder.user;
		if (reminder.channel) rmd.channel = reminder.channel;
		rmd.reason = reminder.reason;
		rmd.trigger = reminder.trigger;
		rmd.triggers_at = reminder.triggers_at;
		const dbReminder = await remindersRepo.save(rmd);
		if (dbReminder.triggers_at.getTime() < (Date.now() + this.checkRate)) {
			this.queueReminder(dbReminder);
		}
	}

	public cancelReminder(id: string) {
		const schedule = this.queuedSchedules.get(id);
		if (schedule) clearTimeout(schedule);
		return this.queuedSchedules.delete(id);
	}

	public async deleteReminder(reminder: Reminder) {
		const schedule = this.queuedSchedules.get(reminder.id);
		if (schedule) clearTimeout(schedule);
		this.queuedSchedules.delete(reminder.id);
		const remindersRepo = this.database.db.getRepository(Reminder);
		const deleted = await remindersRepo.remove(reminder);
		return deleted;
	}

	public queueReminder(reminder: Reminder) {
		this.queuedSchedules.set(reminder.id, setTimeout(() => {
			this.runReminder(reminder);
		}, reminder.triggers_at.getTime() - Date.now()));
	}
}
