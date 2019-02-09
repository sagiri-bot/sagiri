
import { Component, ComponentAPI } from '@ayana/bento';
import moment from 'moment';
import { Command, CommandExecute } from '../interfaces';
import { Commands } from '../structures';

export class UserInfo implements Command {
	public api: ComponentAPI;
	public name: string = 'UserInfo';

	public parent: Component = Commands;

	public command: string = 'userinfo';

	public async execute({ message, channel }: CommandExecute) {
		const author = message.member;
		await channel.createMessage({
			embed: {
				author: {
					name: `${author.username}#${author.discriminator}`,
					icon_url: author.staticAvatarURL
				},
				fields: [
					{
						name: 'ID',
						value: author.id,
						inline: true
					},
					{
						name: 'Nickname',
						value: author.nick,
						inline: true
					},
					{
						name: 'Status',
						value: author.status,
						inline: true
					},
					{
						name: 'Playing',
						value: author.game.name,
						inline: true
					},
					{
						name: 'Creation date',
						value: moment(author.createdAt).toString(),
						inline: true
					},
					{
						name: 'Jointed at',
						value: moment(author.joinedAt).toString(),
						inline: true
					},
					{
						name: 'Mention',
						value: channel.mention,
						inline: true,
					},
					{
						name: 'Roles',
						value: author.roles.map(r => channel.guild.roles.get(r).name).join(', '),
						inline: true,
					}
				]
			}
		});
	}
}
