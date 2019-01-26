
import { Bento, ConfigLoader, FSComponentLoader } from '@ayana/bento';

import { Logger } from '@ayana/logger';
import * as dotenv from 'dotenv';
import { Definitions } from './Config';
dotenv.config({ path: `${__dirname}/../.env` });

const log = Logger.get('index');

const bento = new Bento();

(async () => {
	// Configloader plugin
	const config = new ConfigLoader();

	// add generated definitions from ./Config.ts
	config.addDefinitions(Definitions);

	// Use FSComponentLoader Plugin
	const fsloader = new FSComponentLoader();
	// Look for components in the directories
	await fsloader.addDirectory(__dirname, 'structures');
	await fsloader.addDirectory(__dirname, 'components');
	await fsloader.addDirectory(__dirname, 'events');

	// attach plugins and verify bento state
	await bento.addPlugins([config, fsloader]);
	await bento.verify();

	log.info('Loaded components');
})().catch(e => {
	log.error('Uh-oh it looks like it\'s broken!');
	log.error(e);
	process.exit(1);
});
