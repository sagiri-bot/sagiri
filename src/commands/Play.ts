
import { Component, ComponentAPI, Inject } from '@ayana/bento';

import * as path from 'path';
import * as url from 'url';
import { Discord } from '../components/Discord';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class Play implements Command {
	public api: ComponentAPI;
	public name: string = 'Play';

	public parent: Component = Commands;

	@Inject(Discord)
	private discord: Discord;

	public command: string = 'play';

	public async execute({ args, message, channel, music }: CommandExecute) {
		let voiceChannel;
		let voiceBot;
		const botMember = channel.guild.members.get(this.discord.cli.user.id);
		if (message.member && message.member.voiceState && message.member.voiceState.channelID) {
			voiceChannel = channel.guild.channels.get(message.member.voiceState.channelID);
		} else {
			voiceChannel = undefined;
		}

		if (botMember.voiceState && botMember.voiceState.channelID) {
			voiceBot = channel.guild.channels.get(botMember.voiceState.channelID);
		} else {
			voiceBot = undefined;
		}

		if (!voiceChannel) {
			channel.createMessage('You need to be in a voice channel first, baka!');
			return;
		}

		const permissions = voiceChannel.permissionsOf(this.discord.cli.user.id);
		if (!permissions.has('voiceConnect') || !permissions.has('voiceSpeak')) {
			channel.createMessage('Senpai, please grant me permissions to join & speak in this channel.');
			return;
		}

		if (!args.length && message.attachments[0]) {
			args.push(message.attachments[0]!.url);
			if (!['.mp3', '.ogg', '.flac', '.m4a'].includes(path.parse(url.parse(args.toString()).path!).ext)) return;
		} else if (!args.length) {
			return;
		}

		if (!['http:', 'https:'].includes(url.parse(args.toString()).protocol!)) args[args.indexOf(args.toString())] = (`ytsearch:${args}`);

		const res: any = await this.discord.music.load(args.toString());
		const queue = this.discord.music.queues.get(channel.guild.id);

		if (!voiceBot) await queue.player.join(message.member.voiceState.channelID);
		let msg;
		if (['TRACK_LOADED', 'SEARCH_RESULT'].includes(res.loadType)) {
			await queue.add(res.tracks[0].track);
			msg = res.tracks[0].info.title;
		} else if (res.loadType === 'PLAYLIST_LOADED') {
			await queue.add(...res.tracks.map((track: { track: string }) => track.track));
			msg = res.playlistInfo.name;
		} else {
			channel.createMessage('S-sorry senpai, but I couldn\'t find anything!');
			return;
		}

		if (!queue.player.playing && !queue.player.paused) await queue.start();

		channel.createMessage(`Queued up: \`${msg}\``);
		return;
	}
}
