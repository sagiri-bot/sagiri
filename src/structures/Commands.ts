
import {
	Component,
	ComponentAPI,
	FSComponentLoader,
	SubscribeEvent,
	Variable,
	VariableDefinitionType
} from '@ayana/bento';

import { Message, TextChannel } from 'eris';
import { Discord } from '../components/Discord';
import { Config } from '../Config';
import { DiscordEvent } from '../Constants';
import { Command, CommandExecute } from '../interfaces';

import { Logger } from '@ayana/logger';
const log = Logger.get(null);

export class Commands {
	public api: ComponentAPI;
	public name: string = 'Commands';

	public dependencies: Component[] = [Discord];

	private commands: Map<string, Command> = new Map();

	@Variable({ type: VariableDefinitionType.STRING, name: Config.BOT_PREFIX, default: null })
	private prefix: string = null;

	public async onLoad() {
		log.info('Loading commands...');
		await this.api.loadComponents(FSComponentLoader, __dirname, '../commands');
	}

	// lifecycle event
	public async onChildLoad(command: Command) {
		try {
			await this.addCommand(command);
		} catch (e) {
			log.warn(e);
		}
	}

	// lifecycle event
	public async onChildUnload(command: Command) {
		try {
			await this.removeCommand(command);
		} catch (e) {
			log.warn(e);
		}
	}

	public async addCommand(command: Command) {
		if (typeof command.execute !== 'function') throw new Error('Command component execute must be a function');
		if (typeof command.command !== 'string') throw new Error('Command component command must be a string');

		// check if dupe
		if (this.commands.has(command.command)) throw new Error(`Command already exists`);

		log.info(`Registered command: ${command.command}`);
		this.commands.set(command.command, command);
	}

	public async removeCommand(command: Command) {
		if (this.commands.has(command.command)) this.commands.delete(command.command);
	}

	@SubscribeEvent(Discord, DiscordEvent.MESSAGE_CREATE)
	private async handleMessageCreate(message: Message) {
		const channel = message.channel;
		const author = message.author;

		// ignore messages from non text channels
		if (!(channel instanceof TextChannel)) return;

		// ignore no content, no channel, and anything from a bot
		if (!message.content || !channel || author.bot) return;
		const raw = message.content;

		// this is a very simple parser, replace it with regex if you know how
		if (!raw.startsWith(this.prefix)) return;

		// split on spaces, making first element of array {prefix}command
		const args: string[] = raw.split(' ');
		const commandName = args[0].slice(this.prefix.length).toLowerCase(); // remove prefix

		// check if known command
		if (!this.commands.has(commandName)) return;
		const command = this.commands.get(commandName);

		// build commandExecute
		const execute: CommandExecute = {
			message,
			channel,
			author,
			args: args.slice(1), // remove first element
		};

		try {
			await command.execute(execute);
		} catch (e) {
			log.error(`Error executing command: ${e}`);
		}
	}
}
