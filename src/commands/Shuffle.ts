
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Shuffle implements Command {
	public api: ComponentAPI;
	public name: string = 'Shuffle';

	public parent: Component = Commands;

	@Inject(Discord)
    private discord: Discord;

	public command: string = 'shuffle';

	public async execute({ message, channel }: CommandExecute) {
		let voiceChannel;
		if (message.member && message.member.voiceState && message.member.voiceState.channelID) {
			voiceChannel = channel.guild.channels.get(message.member.voiceState.channelID);
		} else {
			voiceChannel = undefined;
		}
		if (!voiceChannel) {
			channel.createMessage('You need to be in a voice channel first, baka!');
			return;
		}

		const queue = this.discord.music.queues.get(channel.guild.id);
		await queue.shuffle();

		channel.createMessage('The queue is now shuffled, onii-san.');
		return;
	}
}
