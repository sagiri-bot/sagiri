import { Component, ComponentAPI, SubscribeEvent } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { Discord } from '../components/Discord';
const log = Logger.get('MessageListener');

export class MessageListener {
	public api: ComponentAPI;
	public name: string = 'MessageListener';

	public dependencies: Array<Component> = [Discord];

	@SubscribeEvent(Discord, 'messageCreate')
    private async onMessageCreate() {
		log.info(`onMessageCreate`);
	}
}
