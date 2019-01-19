
import { Bento, FSComponentLoader } from '@ayana/bento';

import { Logger } from '@ayana/logger';

const log = Logger.get('index');

const bento = new Bento();

(async () => {
	const fsloader = new FSComponentLoader();
	// Look for components in the ./components directory
	await fsloader.addDirectory(__dirname, 'components');

	// attach plugins and verify bento state
	await bento.addPlugin(fsloader);
	await bento.verify();

	log.info('Loaded components');
})().catch(e => {
	log.error('Uh-oh it looks like this example is broken! Please let someone know.');
	log.error(e);
	process.exit(1);
});
