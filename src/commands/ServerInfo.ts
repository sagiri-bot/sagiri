
import { Component, ComponentAPI } from '@ayana/bento';
import { EmbedOptions, User } from 'eris';
import moment from 'moment';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class ServerInfo implements Command {
	public api: ComponentAPI;
	public name: string = 'ServerInfo';

	public parent: Component = Commands;

	public command: string = 'serverinfo';

	public async execute({ channel }: CommandExecute) {
		const owner: User = channel.guild.members.get(channel.guild.ownerID).user;
		const bots = channel.guild.members.filter(m => m.bot).length;
		await channel.createMessage({
			embed: {
				author: {
					name: channel.guild.name,
					icon_url: channel.guild.iconURL
				},
				fields: [
					{
						name: 'ID',
						value: channel.guild.id,
						inline: true
					},
					{
						name: 'Region',
						value: channel.guild.region,
						inline: true
					},
					{
						name: 'Owner',
						value: `${owner.username}#${owner.discriminator} (${owner.id})`,
						inline: true
					},
					{
						name: 'Members',
						value: `${channel.guild.memberCount - bots} Bots: ${bots}`,
						inline: true
					},
					{
						name: 'Creation date',
						value: moment(channel.guild.createdAt, 'YYYYMMDD').fromNow()
					},
				]
			}
		});
	}
}
