const chalk = require('chalk');

async function handleShutdown(sagiri) {
    try {
        await sagiri.mongodb.destroy();
    } catch (error) {
        sagiri.logger.error(chalk.red.bold(`[Shutdown] ${error}`));
    }
    sagiri.editStatus('invisible', null);
    sagiri.disconnect({ reconnect: false });
}

module.exports = {
    handleShutdown
};
