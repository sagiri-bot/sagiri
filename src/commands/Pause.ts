
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Pause implements Command {
	public api: ComponentAPI;
	public name: string = 'Pause';

	public parent: Component = Commands;

	@Inject(Discord)
    private discord: Discord;

	public command: string = 'pause';

	public async execute({ message, args, channel }: CommandExecute) {
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
		await queue.player.pause();

		channel.createMessage('I paused just for you, senpai!');
		return;
	}
}
