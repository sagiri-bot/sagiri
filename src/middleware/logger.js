const chalk = require('chalk');

module.exports = {
	priority: 5,
	process: container => {
		const { client, msg, commands, logger, isPrivate, isCommand } = container;
		if (!isCommand) {
			return Promise.resolve();
		}

		logger.info(`${chalk.magenta.bold(!isPrivate ? msg.channel.guild.name : '(in PMs)')} > ` +
			`${chalk.cyan.bold(msg.author.username + '#' + msg.author.discriminator)}: ` +
			`${chalk.green.bold(msg.cleanContent.replace(/\n/g, ' '))}`);

		return Promise.resolve(container);
	}
};
