const { Module } = require('sylphy');
const chalk = require('chalk');
const moment = require('moment');

class GuildLog extends Module {
    constructor(...args) {
        super(...args, {
            name: 'guilds:logger',
            events: {
                guildCreate: 'newGuild',
                guildDelete: 'delGuild'
            }
        });

        this.joinLog = process.env.JOINLOG_ID;
        this.leaveLog = process.env.LEAVELOG_ID;
    }

    init() {
        this.db = this._client.mongodb;
    }

    newGuild(guild) {
        const join = [
            '👋 Hi, I\'m **Sagiri**, a multi-purpose discord bot~',
            '\nYou can find a list of my commands by using `.help`!',
            '\nTo learn more about me, use `.about`~'
        ];

        this.logger.info(chalk.red.bold(`Sagiri has joined "${guild.name}" (${guild.id})`));

        this.send(this.joinLog, '', { embed: {
            color: this._client.sagiriColor,
            author: {
                name: `${guild.name} (${guild.id})`,
                icon_url: `${guild.iconURL}`
            },
            title: `Sagiri has joined "${guild.name}" 🎉`,
            description: `Members: ${guild.memberCount}`,
            footer: {
                text: `Shard ${guild.shard.id}  |  ${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
            }
        } });

        this.send(guild.defaultChannel || guild.channels.find(c => c.name === 'general') || guild.id, `${join.toString()}`, {
            help: '**`.help`**',
            about: '**`.about`**'
        });

        this.db.models.guilds.create({ serverName: guild.name, serverID: guild.id }, (error, add) => {
            if (error) {
                this.send(this.joinLog, `Could not add guild **${guild.name}** to the database`, { embed: {
                    color: this._client.redColor,
                    title: 'Guild.Create Error',
                    description: `${error}`,
                    footer: {
                        text: `Shard ${guild.shard.id}  |  ${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                    }
                } }).catch(this.logger.error);
            }
        });

        guild.members.forEach((member) => {
            if (member.bot === false) {
                this.db.models.users.create({ serverID: guild.id, userID: member.id, userName: member.username, userDisc: member.discriminator });
            }
        });
    }

    delGuild(guild) {
        this.logger.info(chalk.red.bold(`Sagiri has left "${guild.name}" (${guild.id})`));

        this.send(this.leaveLog, '', { embed: {
            color: this._client.redColor,
            author: {
                name: `${guild.name} (${guild.id})`,
                icon_url: `${guild.iconURL}`
            },
            title: `Sagiri has left "${guild.name}" 💀`,
            description: `Members: ${guild.memberCount}`,
            footer: {
                text: `Shard ${guild.shard.id}  |  ${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
            }
        } });

        this.db.models.guilds.deleteOne({ serverID: guild.id }, (error, remove) => {
            if (error) {
                this.send(this.leaveLog, `Could not remove guild **${guild.name}** from the database`, { embed: {
                    color: this._client.redColor,
                    title: 'Guild.Delete Error',
                    description: `${error}`,
                    footer: {
                        text: `Shard ${guild.shard.id}  |  ${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                    }
                } }).catch(this.logger.error);
            }
        });

        this.db.models.roles.deleteMany({ serverID: guild.id }, (error, remove) => {
            if (error) {
                this.send(this.leaveLog, `Could not remove roles in **${guild.name}** from the database`, { embed: {
                    color: this._client.redColor,
                    title: 'Guild.Delete Roles Error',
                    description: `${error}`,
                    footer: {
                        text: `Shard ${guild.shard.id}  |  ${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                    }
                } }).catch(this.logger.error);
            }
        });

        this.db.models.users.deleteMany({ serverID: guild.id }, (error, remove) => {
            if (error) {
                this.send(this.leaveLog, `Could not remove users in **${guild.name}** from the database`, { embed: {
                    color: this._client.redColor,
                    title: 'Guild.Delete Users Error',
                    description: `${error}`,
                    footer: {
                        text: `Shard ${guild.shard.id}  |  ${moment().format('ddd Do MMM, YYYY [at] hh:mm:ss a')}`
                    }
                } }).catch(this.logger.error);
            }
        });
    }
}

module.exports = GuildLog;