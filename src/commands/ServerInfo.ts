
import { Component, ComponentAPI } from '@ayana/bento';
import { User } from 'eris';
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
						value: `Members: ${channel.guild.memberCount - bots} / Bots: ${bots}`,
						inline: true
					},
					{
						name: 'Creation date',
						value: moment(channel.guild.createdAt).toString(),
						inline: true
					},
					{
						name: 'Verification Level',
						value: channel.guild.verificationLevel.toString(),
						inline: true
					},
					{
						name: 'Emojis',
						value: channel.guild.emojis.length.toString() || 'None',
						inline: true,
					},
					{
						name: 'Roles',
						value: channel.guild.roles.size.toString() || 'None',
						inline: true,
					}
				]
			}
		});
	}
}
