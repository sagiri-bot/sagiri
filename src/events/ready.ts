import { Component, ComponentAPI, Inject, SubscribeEvent } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { ReferenceType } from 'rejects';
import { Discord } from '../components/Discord';
const log = Logger.get('ReadyListener');

export class ReadyListener {
	public api: ComponentAPI;
	public name: string = 'ReadyListener';

	public dependencies: Array<Component> = [Discord];

	@Inject(Discord)
	public discord: Discord;

	@SubscribeEvent(Discord, 'ready')
	private async ready() {
		log.info(`H-hi? My name is ${this.discord.cli.user.username} (${this.discord.cli.user.id}), I just draw a little, now get out b-baka!`);

		const players = await this.discord.storage.get('players', { type: ReferenceType.ARRAY });
		if (players) {
			for (const player of players) {
				if (player.channel_id) {
					const queue = this.discord.music.queues.get(player.guild_id);
					await queue.player.join(player.channel_id);
				}
			}
			await this.discord.music.queues.start();
		}
	}
}
