
import { ConfigBuilder, ConfigDefinitionType } from '@ayana/bento';

export enum Config {
	BOT_TOKEN = 'botToken',
	BOT_PREFIX = 'botPrefix'
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
.build();
