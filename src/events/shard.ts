import { Component, ComponentAPI, SubscribeEvent } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { Discord } from '../components/Discord';
import { DiscordEvent } from '../Constants';
const log = Logger.get('ShardListener');

export class ShardListener {
	public api: ComponentAPI;
	public name: string = 'ShardListener';

	public dependencies: Array<Component> = [Discord];

	@SubscribeEvent(Discord, DiscordEvent.SHARD_READY)
	private handleReady(id: number) {
		log.info(`Shard ${id} Ready!`);
	}

	@SubscribeEvent(Discord, DiscordEvent.SHARD_RESUME)
	private handleResume(id: number) {
		log.info(`Shard ${id} Resumed!`);
	}

	@SubscribeEvent(Discord, DiscordEvent.SHARD_DISCONNECT)
	private handleDisconnect(id: number) {
		log.info(`Shard ${id} Disconnected!`);
	}
}
