const { Command } = require('sylphy');

class Ping extends Command {
    constructor (...args) {
        super(...args, {
            name: 'ping',
            group: 'core',
            cooldown: 10,
            options: { guildOnly: true }
        });
    }

    handle ({ client, msg }, responder) {
        return responder.send(`${msg.author.mention} | **Pong! - ${msg.channel.guild.shard.latency} ms** `).catch(this.logger.error);
    }
}

module.exports = Ping;
