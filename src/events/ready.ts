import { Component, ComponentAPI, SubscribeEvent } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { Message } from 'eris';
import { Discord } from '../components/Discord';
const log = Logger.get('ReadyListener');

export class ReadyListener {
	public api: ComponentAPI;
	public name: string = 'ReadyListener';

	public dependencies: Array<Component> = [Discord];

	@SubscribeEvent(Discord, 'ready')
    private async ready() {
		log.info('Ready');
	}
}
