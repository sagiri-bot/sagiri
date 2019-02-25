
import { ConfigBuilder, ConfigDefinitionType } from '@ayana/bento';

export enum Config {
	BOT_TOKEN = 'botToken',
	BOT_PREFIX = 'botPrefix',
	BOT_ID = 'botID',
	DB = 'postgres://user:password@localhost/db',
	REDIS = 'localhost',
	LAVALINK_REST = 'lavalinkRest',
	LAVALINK_WS = 'lavalinkWS',
	LAVALINK_PASS = 'lavalinkPass'
}

export const Definitions = new ConfigBuilder()

.add(Config.BOT_TOKEN, {
	type: ConfigDefinitionType.STRING,
	env: 'BOT_TOKEN',
})
.add(Config.BOT_PREFIX, {
	type: ConfigDefinitionType.STRING,
	env: 'BOT_PREFIX',
})
.add(Config.BOT_ID, {
	type: ConfigDefinitionType.STRING,
	env: 'BOT_ID',
})
.add(Config.DB, {
	type: ConfigDefinitionType.STRING,
	env: 'DB',
})
.add(Config.REDIS, {
	type: ConfigDefinitionType.STRING,
	env: 'REDIS',
})
.add(Config.LAVALINK_REST, {
	type: ConfigDefinitionType.STRING,
	env: 'LAVALINK_REST',
})
.add(Config.LAVALINK_WS, {
	type: ConfigDefinitionType.STRING,
	env: 'LAVALINK_WS',
})
.add(Config.LAVALINK_REST, {
	type: ConfigDefinitionType.STRING,
	env: 'LAVALINK_REST',
})
.build();
