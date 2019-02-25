import { Component, ComponentAPI, Inject, SubscribeEvent } from '@ayana/bento';
import { Logger } from '@ayana/logger';
import { RawPacket } from 'eris';
import { ReferenceType } from 'rejects';
import { Discord } from '../components/Discord';

export class RawListener {
	public api: ComponentAPI;
	public name: string = 'RawListener';

	public dependencies: Array<Component> = [Discord];

	@Inject(Discord)
	public discord: Discord;

	@SubscribeEvent(Discord, 'rawWS')
	private async handleRaw(packet: RawPacket, id: number) {
		switch (packet.t) {
			case 'VOICE_STATE_UPDATE':
				if (packet.d.user_id !== process.env.BOT_ID) return;
				this.discord.music.voiceStateUpdate(packet.d);
				const players: { guild_id: string, channel_id?: string }[] | null = await this.discord.storage.get('players', { type: ReferenceType.ARRAY });
				let index: number = 0;
				if (Array.isArray(players)) index = players.findIndex(player => player.guild_id === packet.d.guild_id);
				if (((!players && !index) || index < 0) && packet.d.channel_id) {
					this.discord.storage.upsert('players', [{ guild_id: packet.d.guild_id, channel_id: packet.d.channel_id }]);
				} else if (players && typeof index !== 'undefined' && index >= 0 && !packet.d.channel_id) {
					players.splice(index, 1);
					await this.discord.storage.delete('players');
					if (players.length) await this.discord.storage.set('players', players);
				}
				break;
			case 'VOICE_SERVER_UPDATE':
				this.discord.music.voiceServerUpdate(packet.d);
				break;
			default:
				break;
		}
	}
}
