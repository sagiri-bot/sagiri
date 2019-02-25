
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Stop implements Command {
	public api: ComponentAPI;
	public name: string = 'Stop';

	public parent: Component = Commands;

	@Inject(Discord)
    private discord: Discord;

	public command: string = 'stop';

	public async execute({ message, args, channel }: CommandExecute) {
		let voiceChannel;
		let voiceBot;
		const botMember = channel.guild.members.get(this.discord.cli.user.id);
		if (botMember.voiceState && botMember.voiceState.channelID) {
			voiceBot = channel.guild.channels.get(botMember.voiceState.channelID);
		} else {
			voiceBot = undefined;
		}
		if (message.member && message.member.voiceState && message.member.voiceState.channelID) {
			voiceChannel = channel.guild.channels.get(message.member.voiceState.channelID);
		} else {
			voiceChannel = undefined;
		}

		const queue = this.discord.music.queues.get(channel.guild.id);

		if (args.toString() === '--clear') await queue.clear();
		await queue.player.stop();
		await queue.player.destroy();

		if (voiceBot) await queue.player.leave();

		channel.createMessage('B-bye, you asked me to stop the queue.');
		return;
	}
}
