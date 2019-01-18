const Mongoose = require('mongoose');
const chalk = require('chalk');

const UserModel = require('../models/User.js');
const GuildModel = require('../models/Guild.js');

class Database {
    constructor(options={}) {
        this.URI = `mongodb://${options.username}:${options.password}@${options.host}:${options.port}/${options.dbname}`;
        this.models = { users: UserModel, guilds: GuildModel };
        this.cache = { users: {}, guilds: {} };
    }

    load(sagiri) {
        return new Promise((resolve, reject) => {
            this.sagiri = sagiri;
            Mongoose.Promise = global.Promise;
            Mongoose.connect(this.URI, { useNewUrlParser: true }).catch((error) => {
                return reject(error);
            });
            Mongoose.connection.on('error', (error) => this.sagiri.logger.error(chalk.red.bold(`[DB] Mongoose error: ${error}`)));
            Mongoose.connection.once('open', () => this.sagiri.logger.info(chalk.green.bold('[DB] Mongoose Connected')));
            return resolve(this);
        });
    }

    destroy() {
        return new Promise((resolve, reject) => {
            this.sagiri = undefined;
            Mongoose.disconnect().catch((error) => {
                return reject(error);
            });
            Mongoose.connection.removeAllListeners('error');
            Mongoose.connection.removeAllListeners('open');
            return resolve();
        });
    }
}

module.exports = Database;
