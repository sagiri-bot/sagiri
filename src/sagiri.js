const SagiriClient = require('./sagiriClient.js');
const chalk = require('chalk');
const { createLogger, format, transports } = require('winston');
const { colorize, combine, timestamp, label, printf } = format;
const moment = require('moment');
const fs = require('fs');
const path = require('path');

global.Promise = require('bluebird');
require('longjohn');
require('dotenv-safe').config({
    path: path.join(process.cwd(), '.env'),
    allowEmptyValues: true
});

const processID = parseInt(process.env['PROCESS_ID'], 10)
const processShards = parseInt(process.env['SHARDS_PER_PROCESS'], 10)
const firstShardID = processID * processShards
const lastShardID = firstShardID + processShards - 1
const maxShards = processShards * parseInt(process.env['PROCESS_COUNT'], 10);

const resolve = (str) => path.join('src', str);

const sagiriFormat = printf((info) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
    level: 'silly',
    format: combine(
        colorize(),
        label({ label: processShards > 1 ? `C ${firstShardID}-${lastShardID}` : `C ${processID}` }),
        timestamp(`[${chalk.magenta(moment().format('YYYY MMM Do, h:mm:ss a'))}]`),
        sagiriFormat
    ),
    transports: [new transports.Console()]
});

const sagiri = new SagiriClient({
    token: process.env.CLIENT_TOKEN,
    prefix: process.env.CLIENT_PREFIX,
    admins: (process.env.ADMIN_IDS).split(', '),
    modules: resolve('modules'),
    messageLimit: 151,
    getAllUsers: true,
    disableEveryone: false,
    maxShards: maxShards,
    firstShardID: firstShardID,
    lastShardID: lastShardID,
    autoreconnect: true
});

const cmdpath = resolve('commands');
sagiri.unregister('logger', 'console');
sagiri.register('logger', 'winston', logger);
sagiri.unregister('middleware', true);
sagiri.register('middleware', resolve('middleware'));
sagiri.register('commands', cmdpath, { groupedCommands: true });

sagiri.on('ready', () => {
    const shards = sagiri.shards.size;
    const guilds = sagiri.guilds.size;
    const users = sagiri.users.size;
    const statuses = [
        { type: 0, name: 'type .help for help' },
        { type: 0, name: 'the saxophone' },
        { type: 2, name: 'your voices' },
        { type: 3, name: 'some lewdies' },
        { type: 0, name: 'a fun game' },
        { type: 3, name: 'anime' },
        { type: 0, name: 'with cute girls' },
        { type: 3, name: 'you struggle' },
        { type: 0, name: 'with catgirls' },
        { type: 0, name: `with ${users} users` },
        { type: 2, name: `to ${users} users` },
        { type: 3, name: `${users} users` },
        { type: 0, name: `in ${guilds} servers` },
        { type: 3, name: `${guilds} servers` }
    ];

    sagiri.ascii = () => {
        fs.readFile('./res/boot/ascii.txt', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(data);
        });
    };

    sagiri.ascii();

    sagiri.logger.info(`${chalk.red.bold(sagiri.user.username)} - ${
        firstShardID === lastShardID
        ? `Shard ${firstShardID} is ready!`
        : `Shards ${firstShardID} to ${lastShardID} are ready!`
    }`);

    sagiri.logger.info(
        `Shards: ${chalk.cyan.bold(shards)} | ` +
        `Guilds: ${chalk.cyan.bold(guilds)} | ` +
        `Users: ${chalk.cyan.bold(users)}`
    );

    try {
        sagiri.mongodb.load(sagiri);
    } catch (err) {
        sagiri.logger.error(chalk.red.bold(`[Mongoose]: ${err}`));
    }

    sagiri.logger.info(chalk.yellow.bold(`Prefix: ${sagiri.prefix}`));
    sagiri.logger.info(chalk.green.bold('Sagiri Is Ready To Rumble~!'));

    sagiri.changeStatus = () => {
        const chooseStatus = statuses[~~(Math.random() * statuses.length)];
        sagiri.editStatus({ name: chooseStatus.name, type: chooseStatus.type || 0 });
        sagiri.logger.info(chalk.yellow.bold(`Sagiri's status changed to -"${chooseStatus.name}"`));
    };

    setInterval(() => sagiri.changeStatus(), 120000);
});

process.on('SIGINT', async () => await sagiri.shutdown());
process.on('unhandledException', (err) => sagiri.logger.error(err));
process.on('unhandledRejection', (err) => sagiri.logger.error(err));
sagiri.on('error', (err) => sagiri.logger.error(err));

sagiri.run();
