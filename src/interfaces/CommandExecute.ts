import {
	Member,
	Message,
	TextChannel,
	User,
} from 'eris';
import { Client as MusicClient } from 'lavaqueue';

export interface CommandExecute {
	message: Message;
	channel: TextChannel;
	author: Member | User;
	settings: any;
	music: MusicClient;
	args: Array<string>;
}
